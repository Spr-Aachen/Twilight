export const CATEGORY_SEPARATOR = " / ";

export type CategoryPath = string[];

type CategoryInput =
    | string
    | string[]
    | Record<string, unknown>
    | Array<unknown>
    | null
    | undefined;

export function getCategoryPathParts(category: CategoryInput): CategoryPath | null {
    if (!category) return null;
    if (typeof category === "string") {
        const trimmed = category.trim();
        if (!trimmed) return null;
        const parts = trimmed
            .split(CATEGORY_SEPARATOR)
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        return parts.length > 0 ? parts : null;
    }
    if (Array.isArray(category)) {
        const stringItems = category.filter((item) => typeof item === "string") as string[];
        if (stringItems.length === category.length) {
            const parts = stringItems
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
            return parts.length > 0 ? parts : null;
        }
        for (const item of category) {
            const parts = getCategoryPathParts(item as CategoryInput);
            if (parts && parts.length > 0) return parts;
        }
        return null;
    }
    if (typeof category === "object") {
        const keys = Object.keys(category);
        for (const key of keys) {
            const name = key.trim();
            if (!name) continue;
            const child = (category as Record<string, unknown>)[key];
            const childParts = getCategoryPathParts(child as CategoryInput);
            return childParts ? [name, ...childParts] : [name];
        }
        return null;
    }
    return null;
}

export function getCategoryPathLabel(category: string | string[] | null | undefined): string | null {
    const parts = getCategoryPathParts(category);
    return parts ? parts.join(CATEGORY_SEPARATOR) : null;
}