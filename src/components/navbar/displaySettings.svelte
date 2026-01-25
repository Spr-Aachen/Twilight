<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { getDefaultHue, getHue, setHue } from "@utils/hue";
import { onClickOutside } from "@utils/widget";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";


let hue = $state(getDefaultHue());
const defaultHue = getDefaultHue();
let isOpen = $state(false);

function resetHue() {
    hue = getDefaultHue();
}

function togglePanel() {
    isOpen = !isOpen;
}

function openPanel() {
    isOpen = true;
}

function closePanel() {
    isOpen = false;
}

// 点击外部关闭面板
function handleClickOutside(event: MouseEvent) {
    if (!isOpen) return;
    onClickOutside(event, "display-setting", "display-settings-switch", () => {
        isOpen = false;
    });
}

onMount(() => {
    hue = getHue();
    document.addEventListener("click", handleClickOutside);
    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
});

$effect(() => {
    if (hue || hue === 0) {
        setHue(hue);
    }
});
</script>

<div class="relative z-50" onmouseleave={closePanel}>
    <button aria-label="Display Settings" class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center" 
        id="display-settings-switch"
        onclick={() => { if (window.innerWidth < BREAKPOINT_LG) { openPanel(); } else { togglePanel(); } }}
        onmouseenter={openPanel}
    >
        <Icon icon="material-symbols:palette-outline" class="text-[1.25rem]"></Icon>
    </button>
    <div id="display-setting-wrapper" class="fixed top-[3.625rem] pt-5 right-4 w-[calc(100vw-2rem)] max-w-80 md:absolute md:top-11 md:right-0 md:w-80 md:pt-5 transition-all z-50" class:float-panel-closed={!isOpen}>
        <div id="display-setting" class="card-base float-panel px-4 py-4 w-full">
            <div class="flex flex-row gap-2 mb-3 items-center justify-between">
                <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
                    before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
                    before:absolute before:-left-3 before:top-[0.33rem]"
                >
                    {i18n(I18nKey.themeColor)}
                    <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                            class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                        <div class="text-[var(--btn-content)]">
                            <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                        </div>
                    </button>
                </div>
                <div class="flex gap-1">
                    <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
                    font-bold text-sm items-center text-[var(--btn-content)]">
                        {hue}
                    </div>
                </div>
            </div>
            <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
                <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
                    class="slider" id="colorSlider" step="5" style="width: 100%">
            </div>
        </div>
    </div>
</div>


<style lang="stylus">
    #display-setting
        input[type="range"]
            -webkit-appearance none
            height 1.5rem
            background-image var(--color-selection-bar)
            transition background-image 0.15s ease-in-out

            /* Input Thumb */
            &::-webkit-slider-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                background rgba(255, 255, 255, 0.7)
                box-shadow none
                &:hover
                    background rgba(255, 255, 255, 0.8)
                &:active
                    background rgba(255, 255, 255, 0.6)

            &::-moz-range-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                border-width 0
                background rgba(255, 255, 255, 0.7)
                box-shadow none
                &:hover
                    background rgba(255, 255, 255, 0.8)
                &:active
                    background rgba(255, 255, 255, 0.6)

            &::-ms-thumb
                -webkit-appearance none
                height 1rem
                width 0.5rem
                border-radius 0.125rem
                background rgba(255, 255, 255, 0.7)
                box-shadow none
                &:hover
                    background rgba(255, 255, 255, 0.8)
                &:active
                    background rgba(255, 255, 255, 0.6)
</style>