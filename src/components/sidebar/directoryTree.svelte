<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";

    import type { DirectoryNode } from "@utils/directory";


    let { tree, currentPath } = $props<{
        tree: DirectoryNode[];
        currentPath: string;
    }>();

    let expandedFolders = $state<Record<string, boolean>>({});

    function isPathActive(nodeUrl?: string): boolean {
        if (!nodeUrl || !currentPath) return false;
        const normalizedCurrent = currentPath.replace(/\/$/, "");
        const normalizedNode = nodeUrl.replace(/\/$/, "");
        return normalizedCurrent === normalizedNode;
    }

    function toggleFolder(folderPath: string, event: Event) {
        event.stopPropagation();
        expandedFolders[folderPath] = !expandedFolders[folderPath];
    }

    function autoExpand(nodes: DirectoryNode[], parentPath: string): boolean {
        let hasActiveChild = false;
        for (const node of nodes) {
            const nodePath = parentPath ? `${parentPath}/${node.name}` : node.name;
            if (node.type === "file") {
                if (isPathActive(node.url)) {
                    hasActiveChild = true;
                }
            } else if (node.type === "folder" && node.children) {
                const childActive = autoExpand(node.children, nodePath);
                if (childActive) {
                    expandedFolders[nodePath] = true;
                    hasActiveChild = true;
                }
            }
        }
        return hasActiveChild;
    }

    onMount(() => {
        autoExpand(tree, "");
    });
</script>

{#snippet renderNode(node: DirectoryNode, path: string, depth: number)}
    {@const currentPathStr = path ? `${path}/${node.name}` : node.name}
    <div class="flex flex-col">
        {#if node.type === "folder"}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
                class="flex items-center px-2 py-1.5 my-0.5 rounded-md cursor-pointer transition-colors duration-300 hover:text-(--primary) hover:bg-(--btn-plain-bg-hover) {expandedFolders[currentPathStr] ? 'font-medium text-90' : 'font-medium text-75'}" 
                onclick={(e) => toggleFolder(currentPathStr, e)}
            >
                <svg class="w-4 h-4 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
                </svg>
                <span class="overflow-hidden text-ellipsis whitespace-nowrap flex-1">{node.name}</span>
                <div class="flex items-center justify-center ml-1.5 w-4 h-4 transition-transform duration-300 {expandedFolders[currentPathStr] ? 'rotate-90' : ''}">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </div>
            
            {#if expandedFolders[currentPathStr] && node.children}
                <div class="flex flex-col pl-3 ml-2 border-l border-(--line-divider)" transition:slide={{ duration: 300 }}>
                    {#each node.children as child}
                        {@render renderNode(child, currentPathStr, depth + 1)}
                    {/each}
                </div>
            {/if}
        {:else}
            <a href={node.url} class="flex items-center px-2 py-1.5 my-0.5 rounded-md cursor-pointer transition-colors duration-300 hover:text-(--primary) hover:bg-(--btn-plain-bg-hover) {isPathActive(node.url) ? 'text-(--primary) bg-(--btn-plain-bg-hover) font-medium' : 'text-75'}">
                <svg class="w-4 h-4 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                <span class="overflow-hidden text-ellipsis whitespace-nowrap flex-1">{node.name}</span>
            </a>
        {/if}
    </div>
{/snippet}

<div class="select-none pb-2">
    {#each tree as node}
        {@render renderNode(node, "", 0)}
    {/each}
</div>