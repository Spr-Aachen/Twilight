import { getImage } from "astro:assets";
import { parse as htmlParser } from "node-html-parser";
import type { APIContext, ImageMetadata } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

import { siteConfig, profileConfig } from "@/config";
import { getSortedPosts } from "@utils/content";
import { getCategoryPathParts } from "@utils/category";
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
    // 过滤掉加密文章和草稿文章
    const posts = (await getSortedPosts()).filter((post) => !post.data.encrypted && post.data.draft !== true);

    // 创建Atom feed头部
    let atomFeed = `<?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
        <title>${siteConfig.title}</title>
        <subtitle>${siteConfig.subtitle || "No description"}</subtitle>
        <link href="${context.site}" rel="alternate" type="text/html"/>
        <link href="${new URL("atom.xml", context.site)}" rel="self" type="application/atom+xml"/>
        <id>${context.site}</id>
        <updated>${new Date().toISOString()}</updated>
        <language>${siteConfig.lang}</language>`;

    for (const post of posts) {
        // convert markdown to html string, ensure post.body is a string
        const body = markdownParser.render(String(post.body ?? ""));
        // convert html string to DOM-like structure
        const html = htmlParser.parse(body);
        // hold all img tags in variable images
        const images = html.querySelectorAll("img");

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
                    // optimize the image and get the final src URL
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

        // 添加Atom条目
        const postUrl = new URL(getPostUrl(post), context.site).href;
        const content = sanitizeHtml(html.toString(), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        });

        atomFeed += `
        <entry>
            <title>${post.data.title}</title>
            <link href="${postUrl}" rel="alternate" type="text/html"/>
            <id>${postUrl}</id>
            <published>${post.data.published.toISOString()}</published>
            <updated>${post.data.updated?.toISOString() || post.data.published.toISOString()}</updated>
            <summary>${post.data.description || ""}</summary>
            <content type="html"><![CDATA[${content}]]></content>
            <author>
                <name>${profileConfig.name}</name>
            </author>`;
        // 添加分类标签
        const categoryParts = getCategoryPathParts(post.data.category);
        if (categoryParts && categoryParts.length > 0) {
            for (let i = 0; i < categoryParts.length; i++) {
                const term = categoryParts.slice(0, i + 1).join(" / ");
                atomFeed += `
            <category term="${term}"></category>`;
            }
        }
        // 添加标签
        const postTags = parseTags(post.data.tags);
        if (postTags && postTags.length > 0) {
            for (const tag of postTags) {
                atomFeed += `
            <category term="${tag}" label="${tag}"></category>`;
            }
        }
        atomFeed += `
            </entry>`;
    }

    // 关闭Atom feed
    atomFeed += `
        </feed>`;

    return new Response(atomFeed, {
        headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",

        },
    });
}