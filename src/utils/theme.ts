import {
    SYSTEM_MODE,
    DARK_MODE,
    LIGHT_MODE,
} from "@constants/constants";
import type {
    LIGHT_DARK_MODE,
} from "@/types/config";
import {
    siteConfig,
} from "@/config";


// Function to apply theme to document
export function applyThemeToDocument(theme: LIGHT_DARK_MODE, force = false) {
    // 获取当前主题状态的完整信息
    const currentIsDark = document.documentElement.classList.contains("dark");
    const currentTheme = document.documentElement.getAttribute("data-theme");
    // 计算目标主题状态
    let targetIsDark: boolean;
    switch (theme) {
        case LIGHT_MODE:
            targetIsDark = false;
            break;
        case DARK_MODE:
            targetIsDark = true;
            break;
        case SYSTEM_MODE:
            targetIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            break;
        default:
            targetIsDark = currentIsDark; // fallback to current mode if theme is unknown
            break;
    }
    // 检测是否真的需要主题切换
    const needsThemeChange = currentIsDark !== targetIsDark;
    const targetTheme = targetIsDark ? "github-dark" : "github-light";
    const needsCodeThemeUpdate = currentTheme !== targetTheme;
    // 如果既不需要主题切换也不需要代码主题更新且不是强制更新，直接返回
    if (!force && !needsThemeChange && !needsCodeThemeUpdate) {
        return;
    }
    // 只在需要主题切换时添加过渡保护
    if (needsThemeChange) {
        document.documentElement.classList.add("is-theme-transitioning");
    }
    // 使用 requestAnimationFrame 确保在下一帧执行，避免闪屏
    requestAnimationFrame(() => {
        // 应用主题变化
        if (needsThemeChange) {
            if (targetIsDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
        // Set the theme for Expressive Code based on current mode
        document.documentElement.setAttribute("data-theme", targetTheme);
        // 在下一帧快速移除保护类，使用微任务确保DOM更新完成
        if (needsThemeChange) {
            // 使用 requestAnimationFrame 确保在下一帧移除过渡保护类
            requestAnimationFrame(() => {
                document.documentElement.classList.remove("is-theme-transitioning");
            });
        }
    });
}

// Function to set theme
export function setTheme(theme: LIGHT_DARK_MODE): void {
    localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
}

// Function to get stored theme from local storage or default
export function getStoredTheme(): LIGHT_DARK_MODE {
    return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || siteConfig.defaultTheme;
}

// Function to initialize theme from local storage or default
export function initTheme(): void {
    const storedTheme = getStoredTheme();
    applyThemeToDocument(storedTheme, true);
    // 监听系统主题变化
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const currentStored = getStoredTheme();
        if (currentStored === SYSTEM_MODE) {
            applyThemeToDocument(SYSTEM_MODE);
        }
    });
}