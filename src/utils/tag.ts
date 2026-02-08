export type Tag = {
    name: string;
    count: number;
};

export function parseTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
        return tags
            .map((tag) => String(tag).trim())
            .filter((tag) => tag.length > 0);
    }
    if (typeof tags === "string") {
        return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
    }
    return [];
}