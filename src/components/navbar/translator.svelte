<script lang="ts">
import { onDestroy, onMount } from "svelte";
import Icon from "@iconify/svelte";

import { siteConfig } from "@/config";
import { getTranslateLanguageFromConfig, getSiteLanguage, setStoredLanguage, getDefaultLanguage } from "@/utils/language";
import { getSupportedTranslateLanguages } from "@/i18n/language";
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";


let isOpen = $state(false);
let translatePanel: HTMLElement | undefined = $state();
let currentLanguage = $state("");

// 从统一配置动态获取支持的语言列表
const languages = getSupportedTranslateLanguages();

// 根据配置文件的语言设置获取源语言
const sourceLanguage = getTranslateLanguageFromConfig(
    getDefaultLanguage(),
);

function togglePanel() {
    isOpen = !isOpen;
}

async function changeLanguage(languageCode: string) {
    try {
        // 如果翻译脚本未加载，先加载
        if (!(window as any).translateScriptLoaded && typeof (window as any).loadTranslateScript === "function") {
            await (window as any).loadTranslateScript();
        }
        // 确认翻译脚本已加载
        if (!(window as any).translate) {
            console.warn("translate.js is not loaded");
            return;
        }
        // 获取翻译实例
        const translate = (window as any).translate;
        // 检查是否切换回源语言
        const localLang = translate.language.getLocal();
        // 统一使用 changeLanguage 方法
        translate.changeLanguage(languageCode);
        // 如果是切换回源语言，额外执行一次 reset 以确保在不刷新的情况下也能还原
        if (languageCode === localLang) {
            translate.reset();
        }
        // 同步保存到我们的缓存中
        setStoredLanguage(languageCode);
        // 更新当前 UI 状态
        currentLanguage = languageCode;
    } catch (error) {
        console.error("Failed to execute translation:", error);
    }
    // 关闭面板
    isOpen = false;
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
        // 不阻止事件传播，让其他元素的点击事件正常执行
    }
}

// 组件挂载时添加事件监听和初始化默认语言
onMount(() => {
    document.addEventListener("click", handleClickOutside);
    // 初始化当前语言为站点语言（优先缓存）
    currentLanguage = getSiteLanguage();
});

onDestroy(() => {
    if (typeof document !== "undefined") {
        document.removeEventListener("click", handleClickOutside);
    }
});
</script>

{#if siteConfig.translate?.enable}
<div class="relative">
    <!-- 翻译按钮 -->
    <button
        aria-label="Language Translation"
        class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
        id="translate-switch"
        onclick={togglePanel}
    >
        <Icon icon="material-symbols:translate" class="text-[1.25rem] transition" />
    </button>
    <!-- 翻译面板 -->
    <DropdownPanel
        element={translatePanel}
        id="translate-panel"
        class="z-50 p-4 transition-all duration-200 fixed top-[4.5rem] right-4 w-[calc(100vw-2rem)] max-w-64 md:absolute md:top-[3.75rem] md:right-0 md:w-64 {isOpen ? '' : 'float-panel-closed'}"
    >
        <div class="text-sm font-medium text-[var(--primary)] mb-3 px-1">
            选择语言 / Select Language
        </div>
        <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {#each languages as lang}
                <DropdownItem
                    isActive={currentLanguage === lang.code}
                    onclick={() => changeLanguage(lang.code)}
                    class="gap-3 !p-2 !h-auto"
                    isLast={false}
                >
                    <span class="text-lg transition">{lang.icon}</span>
                    <span class="text-sm transition flex-grow text-left">{lang.name}</span>
                    {#if currentLanguage === lang.code}
                        <span class="ml-auto text-[var(--primary)]">✓</span>
                    {/if}
                </DropdownItem>
            {/each}
        </div>
    </DropdownPanel>
</div>
{/if}

<style>
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