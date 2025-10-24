import {
	SYSTEM_MODE,
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
} from "@constants/constants";
import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";

// 声明全局函数类型
declare global {
	interface Window {
		initBannerCarousel?: () => void;
		initFullscreenWallpaperCarousel?: () => void;
	}
}


export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback);
}


export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored) : getDefaultHue();
}


export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}


export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
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

    // 检测是否真的需要主题切换：
    // 1. dark类状态是否改变
    // 2. expressiveCode主题是否需要更新
    const needsThemeChange = currentIsDark !== targetIsDark;
    const targetTheme = targetIsDark ? "github-dark" : "github-light";
    const needsCodeThemeUpdate = currentTheme !== targetTheme;

	// 如果既不需要主题切换也不需要代码主题更新，直接返回
	if (!needsThemeChange && !needsCodeThemeUpdate) {
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


export function setTheme(theme: LIGHT_DARK_MODE): void {
    localStorage.setItem("theme", theme);
    applyThemeToDocument(theme);
}


export function getStoredTheme(): LIGHT_DARK_MODE {
    return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || siteConfig.defaultTheme;
}


export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE) {
	// 获取当前的壁纸模式
	const currentMode = document.documentElement.getAttribute('data-wallpaper-mode') as WALLPAPER_MODE || siteConfig.wallpaper.mode;

	// 如果模式没有变化，直接返回
	if (currentMode === mode) {
		return;
	}

	// 添加过渡保护类
	document.documentElement.classList.add('is-wallpaper-transitioning');

	// 更新数据属性
	document.documentElement.setAttribute('data-wallpaper-mode', mode);

	// 使用 requestAnimationFrame 确保在下一帧执行，避免闪屏
	requestAnimationFrame(() => {
		const body = document.body;

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
	});
}

/**
 * 显示banner壁纸
 */
function showBannerMode() {
	// 隐藏全屏壁纸（通过CSS类控制）
	const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');
	if (fullscreenContainer) {
		fullscreenContainer.classList.add('hidden');
	}

	// 显示banner壁纸（通过CSS类控制）
	const bannerWrapper = document.getElementById('banner-wrapper');
	if (bannerWrapper) {
		bannerWrapper.classList.remove('hidden');
		bannerWrapper.classList.remove('opacity-0');
		bannerWrapper.classList.add('opacity-100');

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
	}

	// 调整主内容位置
	adjustMainContentPosition('banner');

	// 调整导航栏透明度
	const navbar = document.getElementById('navbar');
	if (navbar) {
		// 获取导航栏透明模式配置（banner模式）
		const transparentMode = siteConfig.wallpaper.banner?.navbar?.transparentMode || 'semi';
		navbar.setAttribute('data-transparent-mode', transparentMode);

		// 重新初始化半透明模式滚动检测（如果需要）
		if (transparentMode === 'semifull' && typeof window.initSemifullScrollDetection === 'function') {
			window.initSemifullScrollDetection();
		}
	}
}

/**
 * 显示全屏壁纸
 */
function showFullscreenMode() {
	// 显示全屏壁纸（通过CSS类控制）
	const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');
	if (fullscreenContainer) {
		fullscreenContainer.classList.remove('hidden');
		fullscreenContainer.classList.remove('opacity-0');
		fullscreenContainer.classList.add('opacity-100');
	}

	// 隐藏banner壁纸（通过CSS类控制）
	const bannerWrapper = document.getElementById('banner-wrapper');
	if (bannerWrapper) {
		bannerWrapper.classList.add('hidden');
	}

	// 组件现在自动处理轮播初始化

	// 调整主内容透明度
	adjustMainContentTransparency(true);

	// 调整布局为紧凑模式
	adjustMainContentPosition('fullscreen');
}

function createFullscreenWallpaper() {
	// 动态创建全屏壁纸容器 - 已废弃，现在组件始终在DOM中
	// 保留此函数以防其他代码引用，但不执行任何操作
	console.warn('createFullscreenWallpaper() is deprecated. Fullscreen wallpaper component is now always rendered in DOM.');
}

function initFullscreenCarousel(container: HTMLElement, interval: number) {
	const desktopItems = container.querySelectorAll('.hidden.lg\\:block [data-carousel-item]') as NodeListOf<HTMLElement>;
	const mobileItems = container.querySelectorAll('.block.lg\\:hidden [data-carousel-item]') as NodeListOf<HTMLElement>;

	function startCarousel(items: NodeListOf<HTMLElement>) {
		if (items.length <= 1) return;

		let currentIndex = 0;

		// 初始化：显示第一张，隐藏其他
		items.forEach((item, index) => {
			item.style.opacity = index === 0 ? '1' : '0';
		});

		// 开始轮播
		setInterval(() => {
			// 隐藏当前图片
			items[currentIndex].style.opacity = '0';

			// 切换到下一张
			currentIndex = (currentIndex + 1) % items.length;

			// 显示下一张图片
			items[currentIndex].style.opacity = '1';
		}, interval * 1000);
	}

	// 分别为桌面端和移动端启动轮播
	if (desktopItems.length > 0) {
		startCarousel(desktopItems);
	}
	if (mobileItems.length > 0) {
		startCarousel(mobileItems);
	}
}

/**
 * 隐藏所有壁纸
 */
function hideAllWallpapers() {
	// 隐藏所有壁纸（通过CSS类控制）
	const bannerWrapper = document.getElementById('banner-wrapper');
	const fullscreenContainer = document.querySelector('[data-fullscreen-wallpaper]');

	if (bannerWrapper) {
		bannerWrapper.classList.add('hidden');
	}

	if (fullscreenContainer) {
		fullscreenContainer.classList.add('hidden');
	}

	// 调整主内容位置和透明度
	adjustMainContentPosition('none');
	adjustMainContentTransparency(false);
}

/**
 * 更新导航栏透明模式
 * @param {WALLPAPER_MODE} mode 壁纸模式
 */
function updateNavbarTransparency(mode: WALLPAPER_MODE) {
	const navbar = document.getElementById('navbar');
	if (!navbar) return;

	// 根据当前壁纸模式获取透明模式配置
	let transparentMode;
	if (mode === WALLPAPER_FULLSCREEN) {
		transparentMode = siteConfig.wallpaper.fullscreen?.navbar?.transparentMode || 'semi';
	} else {
		// banner 和 none 模式使用 banner 配置
		transparentMode = siteConfig.wallpaper.banner?.navbar?.transparentMode || 'semi';
	}

	// 更新导航栏的透明模式属性
	navbar.setAttribute('data-transparent-mode', transparentMode);

	// 移除现有的透明模式类（如果有的话）
	navbar.classList.remove('navbar-transparent-semi', 'navbar-transparent-full', 'navbar-transparent-semifull');

	// 重新初始化半透明模式滚动检测（如果需要）
	if (transparentMode === 'semifull' && typeof window.initSemifullScrollDetection === 'function') {
		window.initSemifullScrollDetection();
	}
}

function adjustMainContentPosition(mode: WALLPAPER_MODE | 'banner' | 'none' | 'fullscreen') {
	const mainContent = document.querySelector('.absolute.w-full.z-30') as HTMLElement;
	if (!mainContent) return;

	// 移除现有的位置类
	mainContent.classList.remove('mobile-main-no-banner', 'no-banner-layout');

	switch (mode) {
		case 'banner':
			// Banner模式：主内容在banner下方
			mainContent.style.top = 'calc(var(--banner-height) - 3rem)';
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

function adjustMainContentTransparency(enable: boolean) {
	const mainContent = document.querySelector('.absolute.w-full.z-30');
	if (!mainContent) return;

	if (enable) {
		mainContent.classList.add('wallpaper-transparent');
	} else {
		mainContent.classList.remove('wallpaper-transparent');
	}
}

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


export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	localStorage.setItem('wallpaperMode', mode);
	applyWallpaperModeToDocument(mode);
}


export function initWallpaperMode(): void {
	const storedMode = getStoredWallpaperMode();
	applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	return (localStorage.getItem('wallpaperMode') as WALLPAPER_MODE) || siteConfig.wallpaper.mode;
}