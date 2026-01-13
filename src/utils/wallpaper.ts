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
        bannerCarouselState?: {
            currentIndex: number;
            lastSwitchTime: number;
        };
        fullscreenWallpaperState?: {
            currentIndex: number;
            lastSwitchTime: number;
        };
        bannerCarouselTimer?: any;
        fullscreenWallpaperTimer?: any;
        currentBannerCarousel?: HTMLElement | null;
        currentFullscreenWallpaperCarousel?: HTMLElement | null;
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
    mainContent.classList.remove('no-banner-layout');
    // Add new position classes based on mode
    switch (mode) {
        case 'banner':
            // Banner模式：主内容在banner下方
            mainContent.style.top = `calc(${BANNER_HEIGHT}vh - ${MAIN_PANEL_OVERLAPS_BANNER_HEIGHT}rem)`;
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
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]') as HTMLElement;
    if (fullscreenContainer) {
        // 先淡出
        fullscreenContainer.style.opacity = '0';
        // 等待过渡完成后隐藏
        setTimeout(() => {
            if (document.documentElement.getAttribute('data-wallpaper-mode') !== WALLPAPER_FULLSCREEN) {
                fullscreenContainer.classList.add('hidden');
            }
        }, 600);
    }
    // 更新 body 类
    document.body.classList.add('enable-banner');
    // 显示banner壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (bannerWrapper) {
        // 如果 banner 已经是可见的（可能只是重复调用），则不触发过渡动画
        const isAlreadyVisible = !bannerWrapper.classList.contains('hidden') && !document.documentElement.classList.contains('banner-hiding');
        if (!isAlreadyVisible) {
            // 如果正在隐藏中，先移除隐藏类
            document.documentElement.classList.remove('banner-hiding');
            // 添加过渡类到 html，将高度设为 0
            document.documentElement.classList.add('banner-transitioning');
            // 移除 hidden，使其进入布局但高度为 0
            bannerWrapper.classList.remove('hidden');
            // 强制重绘
            void bannerWrapper.offsetHeight;
            // 移除过渡类，开始高度增长动画
            document.documentElement.classList.remove('banner-transitioning');
            // 触发标题动画（仅针对 banner 标题，避免触发全局淡入）
            document.documentElement.classList.add('show-banner-animation');
            setTimeout(() => {
                document.documentElement.classList.remove('show-banner-animation');
            }, 1200);
        }
        // 确保banner可见
        bannerWrapper.classList.remove('opacity-0');
        bannerWrapper.classList.add('opacity-100');
        // 更新主内容位置
        adjustMainContentPosition('banner');
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
                        banner.classList.remove('opacity-0');
                        banner.classList.add('opacity-100');
                    }
                    // 处理轮播初始化
                    const carouselItems = carousel.querySelectorAll('.carousel-item');
                    if (carouselItems.length > 1) {
                        const currentIndex = window.bannerCarouselState?.currentIndex || 0;
                        carouselItems.forEach((item, index) => {
                            if (index === currentIndex) {
                                item.classList.add('opacity-100');
                                item.classList.remove('opacity-0');
                            } else {
                                item.classList.add('opacity-0');
                                item.classList.remove('opacity-100');
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
                    banner.classList.remove('opacity-0');
                    banner.classList.add('opacity-100');
                }
                // 处理移动端单图片
                const mobileBanner = document.querySelector('.block.lg\\:hidden[alt="Mobile banner image of the blog"]');
                if (mobileBanner) {
                    mobileBanner.classList.remove('opacity-0');
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
    // 隐藏 banner
    document.body.classList.remove('enable-banner');
    // 显示全屏壁纸（通过CSS类控制）
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]') as HTMLElement;
    if (fullscreenContainer) {
        fullscreenContainer.classList.remove('hidden');
        // 强制重绘以触发过渡
        void fullscreenContainer.offsetHeight;
        // 获取配置中的透明度，如果没有则使用默认值 0.8
        const targetOpacity = siteConfig.wallpaper.fullscreen?.opacity?.toString() || '0.8';
        fullscreenContainer.style.opacity = targetOpacity;
    } else {
        // 如果没找到，可能 DOM 还没加载完，尝试在下一帧重试
        requestAnimationFrame(showFullscreenMode);
        return;
    }
    // 隐藏banner壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    if (bannerWrapper) {
        // 等待过渡完成（如果正在进行）或立即隐藏
        if (document.documentElement.classList.contains('banner-hiding')) {
            setTimeout(() => {
                if (document.documentElement.getAttribute('data-wallpaper-mode') === WALLPAPER_FULLSCREEN) {
                    bannerWrapper.classList.add('hidden');
                }
            }, 600);
        } else {
            bannerWrapper.classList.add('hidden');
        }
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

// Function to show none mode wallpaper
function showNoneMode() {
    // 隐藏 banner
    document.body.classList.remove('enable-banner');
    // 隐藏所有壁纸（通过CSS类控制）
    const bannerWrapper = document.getElementById('banner-wrapper');
    const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]') as HTMLElement;
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
        // 淡出
        fullscreenContainer.style.opacity = '0';
        setTimeout(() => {
            if (document.documentElement.getAttribute('data-wallpaper-mode') === WALLPAPER_NONE) {
                fullscreenContainer.classList.add('hidden');
            }
        }, 600);
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
                    banner.classList.remove('opacity-0');
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
    // 处理从 Banner 模式退出的过渡动画
    if (currentMode === WALLPAPER_BANNER && mode !== WALLPAPER_BANNER) {
        document.documentElement.classList.add('banner-hiding');
        // 主内容区域开始向上滑动
        adjustMainContentPosition(mode);
        // 导航栏也立即更新透明度
        updateNavbarTransparency(mode);
        // 等待过渡动画完成后再执行实际的模式切换
        setTimeout(() => {
            document.documentElement.classList.remove('banner-hiding');
            executeApply();
        }, 600);
        return;
    }

    // 如果是初始加载或强制更新，我们可能需要立即执行一些逻辑，或者等待 DOM 就绪
    const apply = () => {
        executeApply();
    };

    function executeApply() {
        const body = document.body;
        if (!body) {
            // 如果 body 还没准备好，稍后再试
            requestAnimationFrame(executeApply);
            return;
        }
        // 添加过渡保护类
        document.documentElement.classList.add('is-wallpaper-transitioning');
        // 只有当新模式不需要透明效果时，才移除 wallpaper-transparent
        const nextRequiresTransparency = mode === WALLPAPER_BANNER || mode === WALLPAPER_FULLSCREEN;
        if (!nextRequiresTransparency) {
            // 延迟移除以配合背景过渡动画
            setTimeout(() => {
                if (!document.documentElement.classList.contains('is-wallpaper-transitioning') ||
                    (document.documentElement.getAttribute('data-wallpaper-mode') !== WALLPAPER_BANNER &&
                        document.documentElement.getAttribute('data-wallpaper-mode') !== WALLPAPER_FULLSCREEN)) {
                    body.classList.remove('wallpaper-transparent');
                }
            }, 300);
        } else {
            body.classList.add('wallpaper-transparent');
        }
        // 移除 enable-banner，由 showBannerMode 重新添加（如果是切换到 Banner 模式）
        // 如果是从 Banner 切换走，则在 executeApply 中移除
        if (mode !== WALLPAPER_BANNER) {
            body.classList.remove('enable-banner');
        }
        // 根据模式添加相应的CSS类
        switch (mode) {
            case WALLPAPER_BANNER:
                // showBannerMode 会处理 enable-banner 和透明度
                showBannerMode();
                break;
            case WALLPAPER_FULLSCREEN:
                body.classList.add('wallpaper-transparent');
                showFullscreenMode();
                break;
            case WALLPAPER_NONE:
                showNoneMode();
                break;
            default:
                showNoneMode();
                break;
        }
        // 更新导航栏透明模式
        updateNavbarTransparency(mode);
        // 重新初始化相关组件
        reinitializeComponents(mode);
        // 等待过渡动画完成后移除过渡保护类
        setTimeout(() => {
            document.documentElement.classList.remove('is-wallpaper-transitioning');
        }, 600);
    }
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