import {
    BREAKPOINT_LG,
} from "@/constants/breakpoints";
import {
    WALLPAPER_FULLSCREEN,
    WALLPAPER_BANNER,
    WALLPAPER_NONE,
    BANNER_HEIGHT,
    MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "@constants/constants";
import type {
    WALLPAPER_MODE,
} from "@/types/config";
import {
    siteConfig,
} from "@/config";


// Declare global function types for carousel initializers
declare global {
    interface Window {
        initBannerCarousel?: () => void;
        initFullscreenWallpaperCarousel?: () => void;
        initSemifullScrollDetection?: () => void;
    }
}


// Function to get navbar transparent mode for wallpaper mode
export function getNavbarTransparentModeForWallpaperMode(mode: WALLPAPER_MODE): string {
    if (mode === WALLPAPER_FULLSCREEN) {
        return siteConfig.wallpaper.fullscreen?.navbar?.transparentMode || "semi";
    }
    if (mode === WALLPAPER_BANNER) {
        return siteConfig.wallpaper.banner?.navbar?.transparentMode || "semifull";
    }
    return "semi"; // 其他情况使用默认的 semi 模式
}

// Function to adjust main content position based on wallpaper mode
function adjustMainContentPosition(mode: WALLPAPER_MODE | 'banner' | 'none' | 'fullscreen') {
    const mainContent = document.querySelector('.absolute.w-full.z-30') as HTMLElement;
    if (!mainContent) return;
    // Remove existing position classes
    mainContent.classList.remove('mobile-main-no-banner', 'no-banner-layout');
    // Add new position classes based on mode
    switch (mode) {
        case 'banner':
            // Banner模式：桌面端主内容在banner下方，其他情况下不预留banner空间
            const isMobile = window.innerWidth < BREAKPOINT_LG;
            // 优先从 navbar 的 data 属性读取是否首页，避免与 SSR 逻辑不一致
            const navbar = document.getElementById('navbar');
            const dataIsHome = navbar?.getAttribute('data-is-home');
            const isHome = dataIsHome != null ? dataIsHome === 'true' : (location.pathname === '/' || location.pathname === '');
            const bannerWrapper = document.getElementById('banner-wrapper');
            const bannerHiddenForMobile = isMobile && !isHome || (bannerWrapper?.classList.contains('mobile-hide-banner') ?? false); // 若banner被隐藏（移动端非首页），则视为无banner布局
            if (!bannerHiddenForMobile) {
                mainContent.style.top = `calc(${BANNER_HEIGHT}vh - ${MAIN_PANEL_OVERLAPS_BANNER_HEIGHT}rem)`;
            } else {
                mainContent.classList.add('mobile-main-no-banner');
                mainContent.style.top = '5.5rem';
            }
            break;
        case 'fullscreen':
            // Fullscreen模式：使用紧凑布局，主内容从导航栏下方开始
            mainContent.classList.add('no-banner-layout');
            mainContent.style.top = '5.5rem';
            break;
        case 'none':
            // 无壁纸模式：主内容从导航栏下方开始
            mainContent.classList.add('no-banner-layout');
            mainContent.style.top = '5.5rem';
            break;
        default:
            mainContent.style.top = '5.5rem';
            break;
    }
}

// Function to update navbar transparency based on wallpaper mode
function updateNavbarTransparency(mode: WALLPAPER_MODE) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    // 根据当前壁纸模式获取透明模式配置
    const transparentMode = getNavbarTransparentModeForWallpaperMode(mode);
    // 更新导航栏的透明模式属性
    navbar.setAttribute('data-transparent-mode', transparentMode);
    // 重新初始化半透明模式滚动检测（如果需要）
    if (transparentMode === 'semifull' && typeof window.initSemifullScrollDetection === 'function') {
        window.initSemifullScrollDetection();
    }
}

// Function to show banner mode wallpaper
function showBannerMode() {
    // 隐藏全屏壁纸（通过CSS类控制）
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');
    if (fullscreenContainer) {
        fullscreenContainer.classList.add('hidden');
    } else {
        // 如果没找到，可能 DOM 还没加载完，尝试在下一帧重试
        requestAnimationFrame(() => {
            const fc = document.querySelector('[data-fullscreen-wallpaper]');
            fc?.classList.add('hidden');
        });
    }
    // 显示banner壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (bannerWrapper) {
        // 确保banner可见
        bannerWrapper.classList.remove('hidden');
        bannerWrapper.classList.remove('opacity-0');
        bannerWrapper.classList.add('opacity-100');
        bannerWrapper.classList.remove('mobile-hide-banner');
        // 更新主内容位置
        const mainContentWrapper = document.querySelector('.absolute.w-full.z-30') as HTMLElement | null;
        if (mainContentWrapper) {
            mainContentWrapper.classList.remove('mobile-main-no-banner');
            mainContentWrapper.style.top = ''; // 重置top样式
        }
        // 在移动端非首页时隐藏banner
        const isMobile = window.innerWidth < BREAKPOINT_LG;
        const navbar = document.getElementById('navbar');
        const dataIsHome = navbar?.getAttribute('data-is-home');
        const isHome = dataIsHome != null ? dataIsHome === 'true' : (location.pathname === '/' || location.pathname === '');
        if (isMobile && !isHome) {
            bannerWrapper.classList.add('mobile-hide-banner');
            if (mainContentWrapper) {
                mainContentWrapper.classList.add('mobile-main-no-banner');
                mainContentWrapper.style.top = '5.5rem';
            }
        }
        // 重新初始化轮播
        const carousel = document.getElementById('banner-carousel');
        if (carousel) {
            // 重新初始化banner轮播
            if (typeof window.initBannerCarousel === 'function') {
                window.initBannerCarousel();
            } else {
                // 如果全局函数不存在，调用组件内部的初始化
                setTimeout(() => {
                    const banner = document.getElementById('banner');
                    if (banner) {
                        banner.classList.remove('opacity-0', 'scale-105');
                        banner.classList.add('opacity-100');
                    }
                    // 处理轮播初始化
                    const carouselItems = carousel.querySelectorAll('.carousel-item');
                    if (carouselItems.length > 1) {
                        carouselItems.forEach((item, index) => {
                            if (index === 0) {
                                item.classList.add('opacity-100', 'scale-100');
                                item.classList.remove('opacity-0', 'scale-110');
                            } else {
                                item.classList.add('opacity-0', 'scale-110');
                                item.classList.remove('opacity-100', 'scale-100');
                            }
                        });
                    }
                }, 100);
            }
        } else {
            // 处理单图片banner
            setTimeout(() => {
                const banner = document.getElementById('banner');
                if (banner) {
                    banner.classList.remove('opacity-0', 'scale-105');
                    banner.classList.add('opacity-100');
                }
                // 处理移动端单图片
                const mobileBanner = document.querySelector('.block.lg\\:hidden[alt="Mobile banner image of the blog"]');
                if (mobileBanner) {
                    mobileBanner.classList.remove('opacity-0', 'scale-105');
                    mobileBanner.classList.add('opacity-100');
                }
            }, 100);
        }
    } else {
        // 如果没找到，可能 DOM 还没加载完，尝试在下一帧重试
        requestAnimationFrame(showBannerMode);
        return;
    }
    // 调整主内容位置
    adjustMainContentPosition('banner');
    // 调整导航栏透明度
    updateNavbarTransparency(WALLPAPER_BANNER);
}

// Function to show fullscreen mode wallpaper
function showFullscreenMode() {
    // 显示全屏壁纸（通过CSS类控制）
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');
    if (fullscreenContainer) {
        fullscreenContainer.classList.remove('hidden');
        fullscreenContainer.classList.remove('opacity-0');
        fullscreenContainer.classList.add('opacity-100');
    } else {
        // 如果没找到，可能 DOM 还没加载完，尝试在下一帧重试
        requestAnimationFrame(showFullscreenMode);
        return;
    }
    // 隐藏banner壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (bannerWrapper) {
        bannerWrapper.classList.add('hidden');
    } else {
        // 如果没找到，可能 DOM 还没加载完，尝试在下一帧重试
        requestAnimationFrame(() => {
            const bw = document.getElementById('banner-wrapper');
            bw?.classList.add('hidden');
        });
    }
    // 组件现在自动处理轮播初始化
    // 调整主内容透明度
    adjustMainContentTransparency(true);
    // 调整布局为紧凑模式
    adjustMainContentPosition('fullscreen');
}

// Function to hide all wallpapers
function hideAllWallpapers() {
    // 隐藏所有壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');
    if (bannerWrapper) {
        bannerWrapper.classList.add('hidden');
    } else {
        // Try next frame if not found
        requestAnimationFrame(() => {
            const bw = document.getElementById('banner-wrapper');
            bw?.classList.add('hidden');
        });
    }
    if (fullscreenContainer) {
        fullscreenContainer.classList.add('hidden');
    } else {
        // Try next frame if not found
        requestAnimationFrame(() => {
            const fc = document.querySelector('[data-fullscreen-wallpaper]');
            fc?.classList.add('hidden');
        });
    }
    // 调整主内容位置和透明度
    adjustMainContentPosition('none');
    adjustMainContentTransparency(false);
}

// Function to reinitialize components based on wallpaper mode
function reinitializeComponents(mode: WALLPAPER_MODE) {
    // 重新初始化相关组件
    switch (mode) {
        case WALLPAPER_BANNER:
            // 重新初始化banner相关功能
            setTimeout(() => {
                const banner = document.getElementById('banner');
                if (banner) {
                    banner.classList.remove('opacity-0', 'scale-105');
                    banner.classList.add('opacity-100');
                }
            }, 100);
            break;
        case WALLPAPER_FULLSCREEN:
            // 组件现在自动处理轮播初始化
            break;
        case WALLPAPER_NONE:
            // 无需特殊初始化
            break;
    }
}

// Function to apply wallpaper mode to document
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE, force = false) {
    // 获取当前的壁纸模式
    const currentMode = document.documentElement.getAttribute('data-wallpaper-mode') as WALLPAPER_MODE;
    // 如果模式没有变化且不是强制更新，直接返回
    if (!force && currentMode === mode) {
        return;
    }
    // 更新数据属性
    document.documentElement.setAttribute('data-wallpaper-mode', mode);
    // 如果是初始加载或强制更新，我们可能需要立即执行一些逻辑，或者等待 DOM 就绪
    const apply = () => {
        const body = document.body;
        if (!body) {
            // 如果 body 还没准备好，稍后再试
            requestAnimationFrame(apply);
            return;
        }
        // 添加过渡保护类
        document.documentElement.classList.add('is-wallpaper-transitioning');
        // 移除所有壁纸相关的CSS类
        body.classList.remove('enable-banner', 'wallpaper-transparent');
        // 根据模式添加相应的CSS类
        switch (mode) {
            case WALLPAPER_BANNER:
                body.classList.add('enable-banner');
                showBannerMode();
                break;
            case WALLPAPER_FULLSCREEN:
                body.classList.add('wallpaper-transparent');
                showFullscreenMode();
                break;
            case WALLPAPER_NONE:
                hideAllWallpapers();
                break;
            default:
                hideAllWallpapers();
                break;
        }
        // 更新导航栏透明模式
        updateNavbarTransparency(mode);
        // 重新初始化相关组件
        reinitializeComponents(mode);
        // 在下一帧移除过渡保护类
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('is-wallpaper-transitioning');
        });
    };
    // 使用 requestAnimationFrame 确保在下一帧执行，避免闪屏
    requestAnimationFrame(apply);
}

// Function to adjust main content transparency based on wallpaper mode
function adjustMainContentTransparency(enable: boolean) {
    const mainContent = document.querySelector('.absolute.w-full.z-30');
    if (!mainContent) return;
    // Add or remove transparent class based on enable flag
    if (enable) {
        mainContent.classList.add('wallpaper-transparent');
    } else {
        mainContent.classList.remove('wallpaper-transparent');
    }
}

// Function to set wallpaper mode and apply it to document
export function setWallpaperMode(mode: WALLPAPER_MODE): void {
    localStorage.setItem('wallpaperMode', mode);
    applyWallpaperModeToDocument(mode);
}

// Function to get stored wallpaper mode from local storage
export function getStoredWallpaperMode(): WALLPAPER_MODE {
    return (localStorage.getItem('wallpaperMode') as WALLPAPER_MODE) || siteConfig.wallpaper.mode;
}

// Function to initialize wallpaper mode on page load
export function initWallpaperMode(): void {
    const storedMode = getStoredWallpaperMode();
    applyWallpaperModeToDocument(storedMode, true);
}