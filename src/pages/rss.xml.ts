import { getImage } from "astro:assets";
import { parse as htmlParser } from "node-html-parser";
import type { APIContext, ImageMetadata } from "astro";
import type { RSSFeedItem } from "@astrojs/rss";
import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

import { siteConfig } from "@/config";
import { getSortedPosts } from "@utils/content";
import { getCategoryPathLabel } from "@utils/category";
import { parseTags } from "@utils/tag";
import { getFileDirFromPath, getPostUrl } from "@utils/url";


const markdownParser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
    "/src/content/**/*.{jpeg,jpg,png,gif,webp}", // include posts and assets
);

export async function GET(context: APIContext) {
    if (!context.site) {
        throw Error("site not set");
    }

    // Use the same ordering as site listing (pinned first, then by published desc)
    const posts = (await getSortedPosts()).filter((post) => !post.data.encrypted);
    const feed: RSSFeedItem[] = [];

    for (const post of posts) {
        // convert markdown to html string, ensure post.body is a string
        const body = markdownParser.render(String(post.body ?? ""));
        // convert html string to DOM-like structure
        const html = htmlParser.parse(body);
        // hold all img tags in variable images
        const images = html.querySelectorAll("img");
        // process each image tag to correct src paths
        for (const img of images) {
            const src = img.getAttribute("src");
            if (!src) continue;
            // Handle content-relative images and convert them to built _astro paths
            if (
                src.startsWith("./") ||
                src.startsWith("../") ||
                (!src.startsWith("http") && !src.startsWith("/"))
            ) {
                let importPath: string | null = null;
                // derive base directory from real file path to preserve casing
                const contentDirRaw = post.filePath
                    ? getFileDirFromPath(post.filePath)
                    : "src/content/posts";
                const contentDir = contentDirRaw.startsWith("src/")
                    ? contentDirRaw
                    : `src/${contentDirRaw}`;
                if (src.startsWith("./")) {
                    // Path relative to the post file directory
                    const prefixRemoved = src.slice(2);
                    importPath = `/${contentDir}/${prefixRemoved}`;
                } else if (src.startsWith("../")) {
                    // Path like ../assets/images/xxx -> relative to /src/content/
                    const cleaned = src.replace(/^\.\.\//, "");
                    importPath = `/src/content/${cleaned}`;
                } else {
                    // direct filename (no ./ prefix) - assume it's in the same directory as the post
                    importPath = `/${contentDir}/${src}`;
                }
                // import the image module dynamically
                const imageMod = await imagesGlob[importPath]?.()?.then(
                    (res) => res.default,
                );
                if (imageMod) {
                    const optimizedImg = await getImage({ src: imageMod });
                    img.setAttribute("src", new URL(optimizedImg.src, context.site).href);
                } else {
                    // log the failed import path
                    console.log(
                        `Failed to load image: ${importPath} for post: ${post.id}`,
                    );
                }
            } else if (src.startsWith("/")) {
                // images starting with `/` are in public dir
                img.setAttribute("src", new URL(src, context.site).href);
            }
        }

        const categories: string[] = [];
        const categoryLabel = getCategoryPathLabel(post.data.category);
        if (categoryLabel) categories.push(categoryLabel);
        
        const tags = parseTags(post.data.tags);
        if (tags && tags.length > 0) categories.push(...tags);

        feed.push({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.published,
            link: getPostUrl(post),
            categories: categories,
            // sanitize the new html string with corrected image paths
            content: sanitizeHtml(html.toString(), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            }),
        });
    }

    return rss({
        title: siteConfig.title,
        description: siteConfig.subtitle || "No description",
        site: context.site,
        items: feed,
        customData: `<language>${siteConfig.lang}</language>`,
    });
}