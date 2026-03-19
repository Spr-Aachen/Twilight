import { visit } from "unist-util-visit";

/**
 * Rehype plugin to add lazy loading attributes to images, iframes, and videos.
 * - Adds `loading="lazy"` and `decoding="async"` to <img> tags.
 * - Adds `loading="lazy"` to <iframe> tags.
 * - Adds `preload="none"` to <video> and <audio> tags.
 */
export function rehypeLazyLoadMedia() {
    return (tree) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "img") {
                node.properties = node.properties || {};
                // If loading is not already set, set it to lazy
                if (!node.properties.loading) {
                    node.properties.loading = "lazy";
                }
                // If decoding is not already set, set it to async
                if (!node.properties.decoding) {
                    node.properties.decoding = "async";
                }
            } else if (node.tagName === "iframe") {
                node.properties = node.properties || {};
                // If loading is not already set, set it to lazy
                if (!node.properties.loading) {
                    node.properties.loading = "lazy";
                }
            } else if (node.tagName === "video" || node.tagName === "audio") {
                node.properties = node.properties || {};
                // If preload is not already set, set it to none to avoid downloading the media on page load
                if (!node.properties.preload) {
                    node.properties.preload = "none";
                }
            }
        });
    };
}