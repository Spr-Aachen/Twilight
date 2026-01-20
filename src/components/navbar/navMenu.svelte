<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

import type { NavBarLink } from "@/types/config";
import { url } from "@utils/url";


interface Props {
    links: NavBarLink[];
}

let { links }: Props = $props();
let isOpen = $state(false);

function togglePanel() {
    isOpen = !isOpen;
}

// 点击外部关闭面板
function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!isOpen) return;
    
    const panel = document.getElementById("nav-menu-panel");
    const button = document.getElementById("nav-menu-switch");
    
    if (panel && !panel.contains(target) && button && !button.contains(target)) {
        isOpen = false;
    }
}

onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
});
</script>

<div class="relative md:hidden">
    <button aria-label="Menu" name="Nav Menu" class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90" 
        id="nav-menu-switch"
        onclick={togglePanel}
    >
        <Icon icon="material-symbols:menu-rounded" class="text-[1.25rem]"></Icon>
    </button>
    <div id="nav-menu-panel" 
        class="float-panel fixed transition-all right-4 px-2 py-2 max-h-[80vh] overflow-y-auto"
        class:float-panel-closed={!isOpen}
    >
        {#each links as link}
            <div class="mobile-menu-item">
                <a href={link.external ? link.url : url(link.url)} 
                    class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition"
                    target={link.external ? "_blank" : null}
                >
                    <div class="flex items-center transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                        {#if link.icon}
                            <Icon icon={link.icon} class="text-[1.1rem] mr-2" />
                        {/if}
                        {link.name}
                    </div>
                    {#if !link.external}
                        <Icon icon="material-symbols:chevron-right-rounded" class="transition text-[1.25rem] text-[var(--primary)]" />
                    {:else}
                        <Icon icon="fa6-solid:arrow-up-right-from-square" class="transition text-[0.75rem] text-black/25 dark:text-white/25 -translate-x-1" />
                    {/if}
                </a>
            </div>
        {/each}
    </div>
</div>