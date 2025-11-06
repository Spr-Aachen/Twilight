<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";
import { siteConfig } from "@/config";
import { getTranslateLanguageFromConfig } from "@/utils/language-utils";
import { getSupportedTranslateLanguages } from "@/i18n/language";

let isOpen = false;
let translatePanel: HTMLElement;
let currentLanguage = "";

// 从统一配置动态获取支持的语言列表
const languages = getSupportedTranslateLanguages();

// 根据配置文件的语言设置获取默认翻译语言
const defaultTranslateLanguage = getTranslateLanguageFromConfig(
	siteConfig.lang,
);

function togglePanel() {
	isOpen = !isOpen;
	if (translatePanel) {
		translatePanel.classList.toggle("float-panel-closed", !isOpen);
	}
}

async function changeLanguage(languageCode: string) {
	try {
		// 如果翻译脚本未加载，先加载
		if (!window.translateScriptLoaded && typeof window.loadTranslateScript === "function") {
			await window.loadTranslateScript();
		}

		if (!window.translate) {
			console.warn("translate.js is not loaded");
			return;
		}

		// 检查是否选择的是本地语言
		const localLang = window.translate.language.getLocal();
		if (languageCode === localLang) {
			// 如果选择本地语言，重置翻译状态
			window.translate.reset();
			// 强制设置允许翻译本地语种（用于下次切换）
			window.translate.language.translateLocal = true;
		} else {
			// 设置目标语言并执行翻译
			window.translate.to = languageCode;
			window.translate.execute();
		}

		// 更新当前语言状态
		currentLanguage = languageCode;
	} catch (error) {
		console.error("Failed to execute translation:", error);
	}

	// 关闭面板
	isOpen = false;
	if (translatePanel) {
		translatePanel.classList.add("float-panel-closed");
	}
}

// 点击外部关闭面板
function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement;

	// 只有在翻译面板打开时才处理点击外部事件
	if (!isOpen || !translatePanel) {
		return;
	}

	// 检查点击是否在翻译相关元素内部
	if (
		!translatePanel.contains(target) &&
		!target.closest("#translate-switch")
	) {
		isOpen = false;
		translatePanel.classList.add("float-panel-closed");
		// 不阻止事件传播，让其他元素的点击事件正常执行
	}
}

// 组件挂载时添加事件监听和初始化默认语言
onMount(() => {
	document.addEventListener("click", handleClickOutside);

	// 初始化当前语言为默认翻译语言
	currentLanguage = defaultTranslateLanguage;

	// 如果翻译功能已加载，设置默认语言
	if (window.translate) {
		window.translate.to = defaultTranslateLanguage;
	}
});

onDestroy(() => {
	document.removeEventListener("click", handleClickOutside);
});
</script>

{#if siteConfig.translate?.enable}
<div class="relative">
    <!-- 翻译按钮 -->
    <button 
        aria-label="Language Translation" 
        class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" 
        id="translate-switch"
        on:click={togglePanel}
    >
        <Icon icon="material-symbols:translate" class="text-[1.25rem] transition" />
    </button>

    <!-- 翻译面板 -->
    <div 
        bind:this={translatePanel}
        id="translate-panel" 
        class="float-panel-closed absolute top-[3.5rem] right-0 z-50 w-64 bg-[var(--float-panel-bg)] rounded-[var(--radius-large)] shadow-lg border border-[var(--line-divider)] p-4"
    >
        <div class="text-sm font-medium text-[var(--primary)] mb-3">
            选择语言 / Select Language
        </div>
        <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {#each languages as lang}
                <button
                    class="btn-plain flex items-center gap-3 p-2 rounded-lg transition-colors w-full"
                    class:current-theme-btn={currentLanguage === lang.code}
                    on:click={() => changeLanguage(lang.code)}
                >
                    <span class="text-lg transition">{lang.icon}</span>
                    <span class="text-sm transition flex-grow text-left">{lang.name}</span>
                    {#if currentLanguage === lang.code}
                        <span class="ml-auto">✓</span>
                    {/if}
                </button>
            {/each}
        </div>
    </div>
</div>
{/if}

<style>
.float-panel-closed {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
    transition: all 0.2s ease-out;
}

#translate-panel:not(.float-panel-closed) {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-bg-hover);
}
</style>