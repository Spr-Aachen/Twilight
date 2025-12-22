import type { CollectionEntry } from "astro:content";

import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";


export function pathsEqual(path1: string, path2: string) {
    const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
    const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
    return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
    const joined = parts.join("/");
    return joined.replace(/\/+/g, "/");
}

export function removeFileExtension(id: string): string {
    return id.replace(/\.(md|mdx|markdown)$/i, "");
}

export function getPostUrlBySlug(slug: string): string {
    // 移除文件扩展名（如 .md, .mdx 等）
    const slugWithoutExt = removeFileExtension(slug);
    return url(`/posts/${slugWithoutExt}/`);
}

export function getPostUrlByRouteName(routeName: string): string {
    // 移除开头的斜杠并确保固定链接在 /posts/ 路径下
    const cleanRouteName = routeName.replace(/^\/+/, "");
    return url(`/posts/${cleanRouteName}/`);
}

export function getPostUrl(post: CollectionEntry<"posts">): string;
export function getPostUrl(post: { id: string; data: { routeName?: string } }): string;
export function getPostUrl(post: any): string {
    // 如果文章有自定义固定链接，优先使用固定链接
    if (post.data.routeName) {
        return getPostUrlByRouteName(post.data.routeName);
    }
    // 否则使用默认的 slug 路径
    return getPostUrlBySlug(post.id);
}

export function getTagUrl(tag: string): string {
    if (!tag) return url("/archive/");
    return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(category: string | null): string {
    if (
        !category ||
        category.trim() === "" ||
        category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
    )
        return url("/archive/?uncategorized=true");
    return url(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

export function getDir(path: string): string {
    // 移除文件扩展名
    const pathWithoutExt = removeFileExtension(path);
    const lastSlashIndex = pathWithoutExt.lastIndexOf("/");
    if (lastSlashIndex < 0) {
        return "/";
    }
    return pathWithoutExt.substring(0, lastSlashIndex + 1);
}

export function getFileDirFromPath(filePath: string): string {
    return filePath.replace(/^src\//, "").replace(/\/[^/]+$/, "");
}

export function url(path: string) {
    return joinUrl("", import.meta.env.BASE_URL, path);
}