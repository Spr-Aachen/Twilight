/**
 * 导航工具函数
 * 提供统一的页面导航功能，支持 Swup 无刷新跳转
 */
import { navBarConfig } from "@/config";
import { LinkPresets } from "@constants/link-presets";
import { type NavBarLink } from "@/types/config";
import { pathsEqual } from "./url";


/**
 * 根据当前路径查找其所属的父级页面（如 [...menu].astro 生成的中转页）
 * @param currentPath 当前页面的路径
 * @returns 如果找到父级页面，则返回该页面的 NavBarLink 对象，否则返回 undefined
 */
export function getParentLink(currentPath: string): NavBarLink | undefined {
    // 遍历导航栏中的所有链接
    for (const link of navBarConfig.links) {
        // 检查是否有子链接且不是 LinkPreset 枚举
        if (typeof link !== "number" && link.children && link.children.length > 0) {
            // 检查子链接中是否包含当前路径
            for (const child of link.children) {
                let childLink: NavBarLink;
                if (typeof child === "number") {
                    childLink = LinkPresets[child];
                } else {
                    childLink = child;
                }
                // 比较路径是否匹配
                if (pathsEqual(childLink.url, currentPath)) {
                    return link;
                }
            }
        }
    }
    return undefined;
}

/**
 * 降级导航函数
 * 当 Swup 不可用时使用普通的页面跳转
 */
function fallbackNavigation(
    url: string,
    options?: {
        replace?: boolean;
        force?: boolean;
    },
): void {
    if (typeof window === "undefined") return;
    if (options?.replace) {
        window.location.replace(url);
    } else {
        window.location.href = url;
    }
}

/**
 * 导航到指定页面
 * @param url 目标页面URL
 * @param options 导航选项
 */
export function navigateToPage(
    url: string,
    options?: {
        replace?: boolean;
        force?: boolean;
    },
): void {
    // 检查 URL 是否有效
    if (!url || typeof url !== "string") {
        console.warn("navigateToPage: Invalid URL provided");
        return;
    }

    // 如果是外部链接，直接跳转
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
    ) {
        window.open(url, "_blank");
        return;
    }

    // 如果是锚点链接，滚动到对应位置
    if (url.startsWith("#")) {
        if (typeof document !== "undefined") {
            const element = document.getElementById(url.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        return;
    }

    // 检查 Swup 是否可用
    if (typeof window !== "undefined" && (window as any).swup) {
        try {
            // 使用 Swup 进行无刷新跳转
            if (options?.replace) {
                (window as any).swup.navigate(url, { history: false });
            } else {
                (window as any).swup.navigate(url);
            }
        } catch (error) {
            console.error("Swup navigation failed:", error);
            // 降级到普通跳转
            fallbackNavigation(url, options);
        }
    } else {
        // Swup 不可用时的降级处理
        fallbackNavigation(url, options);
    }
}

/**
 * 获取当前页面路径
 */
export function getCurrentPath(): string {
    return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * 检查是否为首页
 */
export function isHomePage(): boolean {
    const path = getCurrentPath();
    return path === "/" || path === "";
}