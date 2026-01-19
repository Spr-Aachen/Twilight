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

// Cache for elements
const getElements = () => {
    if (typeof document === 'undefined') return {
        navbar: null,
        bannerWrapper: null,
        banner: null,
        fullscreenContainer: null,
        mainContent: null,
    };
    return {
        navbar: document.getElementById('navbar'),
        bannerWrapper: document.getElementById('banner-wrapper'),
        banner: document.getElementById('banner'),
        fullscreenContainer: document.querySelector('[data-fullscreen-wallpaper]') as HTMLElement,
        mainContent: document.querySelector('.absolute.w-full.z-30') as HTMLElement,
    };
};

// Helper to safely execute after a delay if mode hasn't changed
function runIfMode(mode: WALLPAPER_MODE, callback: () => void, delay = 600) {
    setTimeout(() => {
        if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-wallpaper-mode') === mode) {
            callback();
        }
    }, delay);
}

// Function to adjust main content position based on wallpaper mode
function adjustMainContentPosition(mode: WALLPAPER_MODE | 'banner' | 'none' | 'fullscreen') {
    const { mainContent } = getElements();
    if (!mainContent) return;
    // Remove existing position classes
    mainContent.classList.remove('no-banner-layout');
    // Add new position classes based on mode
    switch (mode) {
        case WALLPAPER_BANNER:
        case 'banner':
            // 主内容在banner下方
            mainContent.style.top = `calc(${BANNER_HEIGHT}vh - ${MAIN_PANEL_OVERLAPS_BANNER_HEIGHT}rem)`;
            break;
        case WALLPAPER_FULLSCREEN:
        case 'fullscreen':
        case WALLPAPER_NONE:
        case 'none':
            // 主内容从导航栏下方开始
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
    const { navbar } = getElements();
    if (!navbar) return;
    // 根据当前壁纸模式获取透明模式配置
    const transparentMode = getNavbarTransparentModeForWallpaperMode(mode);
    // 更新导航栏的透明模式属性
    navbar.setAttribute('data-transparent-mode', transparentMode);
    // 重新初始化半透明模式滚动检测（如果需要）
    if (transparentMode === 'semifull' && typeof window.initSemifullScrollDetection === 'function') {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => window.initSemifullScrollDetection!());
        } else {
            setTimeout(() => window.initSemifullScrollDetection!(), 0);
        }
    }
}

// Helper to initialize banner elements
function initBannerElements(banner: HTMLElement | null) {
    if (!banner) return;
    banner.classList.remove('opacity-0');
    banner.classList.add('opacity-100');

    // Handle mobile banner
    const mobileBanner = document.querySelector('.block.lg\\:hidden[alt="Mobile banner"]');
    if (mobileBanner) {
        mobileBanner.classList.remove('opacity-0');
        mobileBanner.classList.add('opacity-100');
    }
}

// Function to show banner mode wallpaper
function showBannerMode() {
    const { bannerWrapper, fullscreenContainer, banner } = getElements();
    // 隐藏全屏壁纸（通过CSS类控制）
    if (fullscreenContainer) {
        fullscreenContainer.style.opacity = '0';
        runIfMode(WALLPAPER_BANNER, () => {
            fullscreenContainer.classList.add('hidden');
        });
    }
    // 显示banner
    if (!bannerWrapper) {
        requestAnimationFrame(showBannerMode);
        return;
    }
    const isAlreadyVisible = typeof document !== 'undefined' && !bannerWrapper.classList.contains('hidden') && !document.documentElement.classList.contains('banner-hiding');
    if (!isAlreadyVisible && typeof document !== 'undefined') {
        // 如果正在隐藏中，先移除隐藏类
        document.documentElement.classList.remove('banner-hiding');
        // 添加过渡类到 html
        document.documentElement.classList.add('banner-transitioning');
        // 移除 hidden
        bannerWrapper.classList.remove('hidden');
        // 触发重绘
        void bannerWrapper.offsetHeight;
        // 移除过渡类
        document.documentElement.classList.remove('banner-transitioning');
        // 添加显示动画类
        document.documentElement.classList.add('show-banner-animation');
        setTimeout(() => {
            document.documentElement.classList.remove('show-banner-animation');
        }, 1200);
    }
    // 确保banner可见
    bannerWrapper.classList.remove('opacity-0');
    bannerWrapper.classList.add('opacity-100');
    // Initialize carousel or static banner
    if (typeof window.initBannerCarousel === 'function') {
        window.initBannerCarousel();
    } else {
        setTimeout(() => {
            initBannerElements(banner);
        }, 100);
    }
}

// Function to show fullscreen mode wallpaper
function showFullscreenMode() {
    const { bannerWrapper, fullscreenContainer } = getElements();
    // 显示全屏
    if (!fullscreenContainer) {
        requestAnimationFrame(showFullscreenMode);
        return;
    }
    fullscreenContainer.classList.remove('hidden');
    void fullscreenContainer.offsetHeight;
    fullscreenContainer.style.opacity = siteConfig.wallpaper.fullscreen?.opacity?.toString() || '0.8';
    // 隐藏banner
    if (bannerWrapper) {
        if (typeof document !== 'undefined' && document.documentElement.classList.contains('banner-hiding')) {
            runIfMode(WALLPAPER_FULLSCREEN, () => {
                bannerWrapper.classList.add('hidden');
            });
        } else {
            bannerWrapper.classList.add('hidden');
        }
    }
}

// Function to show none mode wallpaper
function showNoneMode() {
    const { bannerWrapper, fullscreenContainer } = getElements();
    // 隐藏banner
    if (bannerWrapper) {
        bannerWrapper.classList.add('hidden');
    }
    // 隐藏全屏
    if (fullscreenContainer) {
        fullscreenContainer.style.opacity = '0';
        runIfMode(WALLPAPER_NONE, () => {
            fullscreenContainer.classList.add('hidden');
        });
    }
}

// Function to reinitialize components based on wallpaper mode
function reinitializeComponents(mode: WALLPAPER_MODE) {
    if (mode === WALLPAPER_BANNER) {
        setTimeout(() => {
            initBannerElements(getElements().banner);
        }, 100);
    }
}

// Function to apply wallpaper mode to document
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE, force = false) {
    if (typeof document === 'undefined') return;
    // 获取当前的壁纸模式
    const currentMode = document.documentElement.getAttribute('data-wallpaper-mode') as WALLPAPER_MODE;
    // 如果模式没有变化且不是强制更新，直接返回
    if (!force && currentMode === mode) {
        return;
    }
    // 更新数据属性
    document.documentElement.setAttribute('data-wallpaper-mode', mode);
    // Handle Banner exit transition
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
                const isStillTransitioning = document.documentElement.classList.contains('is-wallpaper-transitioning');
                const currentDataMode = document.documentElement.getAttribute('data-wallpaper-mode');
                const isNowTransparentMode = currentDataMode === WALLPAPER_BANNER || currentDataMode === WALLPAPER_FULLSCREEN;
                if (!isStillTransitioning || !isNowTransparentMode) {
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
        } else {
            body.classList.add('enable-banner');
        }
        // 根据模式添加相应的CSS类
        switch (mode) {
            case WALLPAPER_BANNER:
                showBannerMode();
                break;
            case WALLPAPER_FULLSCREEN:
                showFullscreenMode();
                adjustMainContentTransparency(true);
                break;
            case WALLPAPER_NONE:
                showNoneMode();
                adjustMainContentTransparency(false);
                break;
        }
        // 调整主内容位置
        adjustMainContentPosition(mode);
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
    const { mainContent } = getElements();
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
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wallpaperMode', mode);
    }
    applyWallpaperModeToDocument(mode);
}

// Function to get default wallpaper mode from config-carrier
export function getDefaultWallpaperMode(): WALLPAPER_MODE {
    const fallback = siteConfig.wallpaper.mode;
    if (typeof document !== 'undefined') {
        const configCarrier = document.getElementById('config-carrier');
        return (configCarrier?.dataset.wallpaperMode as WALLPAPER_MODE) || fallback;
    }
    return fallback;
}

// Function to get stored wallpaper mode from local storage
export function getStoredWallpaperMode(): WALLPAPER_MODE {
    if (typeof localStorage !== 'undefined') {
        return (localStorage.getItem('wallpaperMode') as WALLPAPER_MODE) || getDefaultWallpaperMode();
    }
    return getDefaultWallpaperMode();
}

// Function to initialize wallpaper mode on page load
export function initWallpaperMode(): void {
    const storedMode = getStoredWallpaperMode();
    applyWallpaperModeToDocument(storedMode, true);
}