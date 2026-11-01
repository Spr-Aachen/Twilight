import {
    BREAKPOINT_MD
} from "@constants/breakpoints";
import {
    WALLPAPER_FULLSCREEN,
    WALLPAPER_BANNER,
    WALLPAPER_NONE,
} from "@constants/layout";
import type {
    WALLPAPER_MODE,
} from "@/types/config";
import {
    siteConfig,
} from "@/config";


// 
declare global {
    interface Window {
        initSemifullScrollDetection?: () => void;
        initBannerCarousel?: () => void;
        initFullscreenWallpaperCarousel?: () => void;
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
    // Remove inline styles to let CSS variables take over
    mainContent.style.top = '';
    // Add new position classes based on mode
    switch (mode) {
        case WALLPAPER_BANNER:
        case 'banner':
            // Position is handled by CSS based on .enable-banner class
            break;
        case WALLPAPER_FULLSCREEN:
        case 'fullscreen':
        case WALLPAPER_NONE:
        case 'none':
            mainContent.classList.add('no-banner-layout');
            // Position is handled by CSS
            break;
        default:
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
    const mobileBanner = document.querySelector('.block.md\\:hidden[alt="Mobile banner"]');
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


// ── 壁纸轮播（banner 与 fullscreen 共用） ────────────────────────────────────

/** 仅在容器上没写入 interval 时兜底（两个组件都会写入构建期解析后的值） */
const DEFAULT_CAROUSEL_INTERVAL = 6;

interface CarouselConfig {
    enable: boolean;
    intervalMs: number;
}

interface CarouselState {
    /** 当前绑定的容器，换页后需要重新绑定 */
    container: HTMLElement | null;
    currentIndex: number;
    lastSwitchTime: number;
    timer: ReturnType<typeof setTimeout> | null;
    /** 启动是否已排队（等待首屏可见），用于避免重复排队 */
    startScheduled: boolean;
}

interface SlideController {
    next: () => void;
}

/** 按容器 id 隔离，跨 swup 导航保留当前索引与定时器 */
const states = new Map<string, CarouselState>();

const getState = (key: string): CarouselState => {
    let state = states.get(key);
    if (!state) {
        state = {
            container: null,
            currentIndex: 0,
            lastSwitchTime: 0,
            timer: null,
            startScheduled: false,
        };
        states.set(key, state);
    }
    return state;
};

const runWhenIdle = (callback: () => void): void => {
    if (typeof requestIdleCallback === "function") {
        requestIdleCallback(callback, { timeout: 1000 });
    } else {
        setTimeout(callback, 1);
    }
};

const parseCarouselConfig = (container: HTMLElement): CarouselConfig => {
    const raw = container.getAttribute("data-carousel-config");
    const parsed = raw ? JSON.parse(raw) : {};
    return {
        enable: Boolean(parsed.enable),
        intervalMs: (Number(parsed.interval) || DEFAULT_CAROUSEL_INTERVAL) * 1000,
    };
};


// ── 首屏可见信号 ────────────────────────────────────────────────────────────

const revealCallbacks = new Set<() => void>();
let revealObserver: MutationObserver | null = null;

/** `is-loading` 摘除即代表 loading overlay 已揭开、首屏可见 */
const onFirstScreenVisible = (callback: () => void): void => {
    if (!document.documentElement.classList.contains("is-loading")) {
        runWhenIdle(callback);
        return;
    }
    revealCallbacks.add(callback);
    if (revealObserver) return;
    revealObserver = new MutationObserver(() => {
        if (document.documentElement.classList.contains("is-loading")) return;
        revealObserver?.disconnect();
        revealObserver = null;
        const pending = Array.from(revealCallbacks);
        revealCallbacks.clear();
        pending.forEach(runWhenIdle);
    });
    revealObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
};

const startWhenVisible = (state: CarouselState, begin: () => void): void => {
    if (state.startScheduled) return;
    state.startScheduled = true;
    onFirstScreenVisible(() => {
        state.startScheduled = false;
        begin();
    });
};


// ── 幻灯片 ────────────────────────────────────────────────────────────────

/** 预取当前视口对应那套幻灯片的下一张 */
const prefetchNextSlide = (container: HTMLElement, currentIndex: number): void => {
    // 两套幻灯片靠 `hidden md:block` / `block md:hidden` 互斥，只预取当前可见的那一套
    const selector = window.innerWidth >= BREAKPOINT_MD
        ? ".carousel-item.desktop-item"
        : ".carousel-item.mobile-item";
    const items = container.querySelectorAll<HTMLElement>(selector);
    if (items.length < 2) return;
    const nextImage = items[(currentIndex + 1) % items.length].querySelector<HTMLImageElement>("img");
    if (!nextImage?.src) return;
    runWhenIdle(() => {
        const preloader = new Image();
        preloader.decoding = "async";
        preloader.src = nextImage.src;
        preloader.decode?.().catch(() => {});
    });
};

const setupSlides = (
    items: NodeListOf<HTMLElement>,
    enable: boolean,
    state: CarouselState,
    onSwitch: () => void,
): SlideController | null => {
    if (items.length === 0) return null;

    // 多图但禁用轮播：随机显示一张
    if (items.length > 1 && !enable) {
        items.forEach(item => {
            item.classList.add("opacity-0");
            item.classList.remove("opacity-100");
        });
        const randomItem = items[Math.floor(Math.random() * items.length)];
        randomItem.classList.add("opacity-100");
        randomItem.classList.remove("opacity-0");
        return null;
    }

    if (items.length <= 1) return null;

    // 索引跨页保留，超出长度时回到第一张
    if (state.currentIndex >= items.length) state.currentIndex = 0;
    let currentIndex = state.currentIndex;

    const switchToSlide = (index: number): void => {
        const currentItem = items[currentIndex];
        currentItem.classList.remove("opacity-100");
        currentItem.classList.add("opacity-0");
        currentIndex = index;
        state.currentIndex = index;
        state.lastSwitchTime = Date.now();

        const nextItem = items[currentIndex];
        nextItem.classList.add("opacity-100");
        nextItem.classList.remove("opacity-0");
        // 通过切换 is-animating 类来重置下一张图片的 Ken Burns 动画
        if (nextItem.classList.contains("ken-burns-enabled")) {
            nextItem.classList.remove("is-animating");
            void nextItem.offsetHeight; // 强制重绘
            nextItem.classList.add("is-animating");
        }
        onSwitch();
    };

    // 初始化：按当前索引显示图片
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("opacity-100");
            item.classList.remove("opacity-0");
            if (item.classList.contains("ken-burns-enabled")) {
                item.classList.add("is-animating");
            }
        } else {
            item.classList.add("opacity-0");
            item.classList.remove("opacity-100");
            item.classList.remove("is-animating");
        }
    });

    return { next: () => switchToSlide((currentIndex + 1) % items.length) };
};


// ── 轮播对外接口 ───────────────────────────────────────────────────────────

/** 初始化（或重新绑定）一个壁纸轮播容器 */
export function initWallpaperCarousel(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = getState(containerId);
    // 同一个容器且轮播已运行或已排队时不再重建，避免重复初始化导致动画重置
    if (state.container === container && (state.timer !== null || state.startScheduled)) return;
    if (state.timer !== null) {
        clearTimeout(state.timer);
        state.timer = null;
    }
    state.container = container;

    const { enable, intervalMs } = parseCarouselConfig(container);
    const onSwitch = (): void => prefetchNextSlide(container, state.currentIndex);
    const controllers = [
        setupSlides(container.querySelectorAll<HTMLElement>(".carousel-item.desktop-item"), enable, state, onSwitch),
        setupSlides(container.querySelectorAll<HTMLElement>(".carousel-item.mobile-item"), enable, state, onSwitch),
    ];

    if (!enable || !controllers.some(Boolean)) return;

    const runLoop = (): void => {
        const elapsed = Date.now() - state.lastSwitchTime;
        state.timer = setTimeout(() => {
            state.timer = null;
            controllers.forEach(controller => controller?.next());
            runLoop();
        }, Math.max(0, intervalMs - elapsed));
    };

    startWhenVisible(state, () => {
        // 首屏可见这一刻起算一个完整间隔
        if (state.lastSwitchTime === 0) state.lastSwitchTime = Date.now();
        runLoop();
        prefetchNextSlide(container, state.currentIndex);
    });
}

/** 首次加载与 swup 换页后各触发一次 */
export function onPageViewReady(callback: () => void): void {
    document.addEventListener("astro:after-swap", callback);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
        callback();
    }
}