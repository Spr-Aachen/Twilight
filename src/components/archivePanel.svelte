<script lang="ts">
import { onMount } from "svelte";

import { getPostUrl } from "@utils/url";
import { getCategoryPathLabel, getCategoryPathParts } from "@utils/category";
import { parseTags } from "@utils/tag";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";


interface Post {
    id: string;
    data: {
        title: string;
        tags: string[];
        category?: string | string[] | null;
        published: Date | string;
        routeName?: string;
    };
}

interface Group {
    year: number;
    posts: Post[];
}

interface Props {
    sortedPosts?: Post[];
}

let { sortedPosts = [] }: Props = $props();

let tags = $state<string[]>([]);
let categories = $state<string[]>([]);
let uncategorized = $state<string | null>(null);

onMount(() => {
    const params = new URLSearchParams(window.location.search);
    tags = params.has("tag") ? params.getAll("tag") : [];
    categories = params.has("category") ? params.getAll("category") : [];
    uncategorized = params.get("uncategorized");
});

function formatDate(date: Date | string) {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
    return tagList.map((t) => `#${t}`).join(" ");
}

function isCategoryMatch(category: string | string[] | null | undefined, targets: string[]) {
    const postParts = getCategoryPathParts(category);
    if (!postParts || postParts.length === 0) return false;
    return targets.some((target) => {
        const targetParts = target
            .split(" / ")
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
        if (targetParts.length === 0) return false;
        if (targetParts.length > postParts.length) return false;
        return targetParts.every((part, index) => part === postParts[index]);
    });
}

let groups = $derived.by(() => {
    let filteredPosts = sortedPosts.map((post) => ({
        ...post,
        data: {
            ...post.data,
            published: new Date(post.data.published),
        },
    }));

    if (tags.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) =>
            {
                const postTags = parseTags(post.data.tags);
                return postTags.some((tag) => tags.includes(tag));
            }
        );
    }

    if (categories.length > 0) {
        filteredPosts = filteredPosts.filter(
            (post) => isCategoryMatch(post.data.category, categories),
        );
    }

    if (uncategorized !== null) {
        filteredPosts = filteredPosts.filter((post) => !getCategoryPathLabel(post.data.category));
    }

    // 按发布时间倒序排序，确保不受置顶影响
    filteredPosts = filteredPosts.slice().sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

    const grouped = filteredPosts.reduce(
        (acc, post) => {
            const year = post.data.published.getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        },
        {} as Record<number, Post[]>,
    );

    const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
        year: Number.parseInt(yearStr, 10),
        posts: grouped[Number.parseInt(yearStr, 10)],
    }));

    groupedPostsArray.sort((a, b) => b.year - a.year);

    return groupedPostsArray;
});
</script>

<div>
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-15">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div class="h-3 w-3 bg-none rounded-full outline-solid outline-(--primary) mx-auto outline-offset-2 z-50 outline-3"></div>
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                </div>
            </div>
            {#each group.posts as post}
                <a href={getPostUrl(post)}
                    aria-label={post.data.title}
                    class="group btn-plain block! h-10 w-full rounded-lg hover:text-[initial]"
                >
                    <div class="flex flex-row justify-start items-center h-full">
                        <!-- date -->
                        <div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
                            {formatDate(post.data.published)}
                        </div>
                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                                bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-(--primary)
                                outline-4 z-50
                                outline-(--card-bg)
                                group-hover:outline-(--btn-plain-bg-hover)
                                group-active:outline-(--btn-plain-bg-active)"
                            ></div>
                        </div>
                        <!-- post title -->
                        <div class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
                            group-hover:translate-x-1 transition-all group-hover:text-(--primary)
                            text-75 pr-8 whitespace-nowrap text-ellipsis overflow-hidden"
                        >
                            {post.data.title}
                        </div>
                        <!-- tag list -->
                        <div class="hidden md:block md:w-[15%] text-left text-sm transition whitespace-nowrap text-ellipsis overflow-hidden text-30"
                        >
                            {formatTag(post.data.tags)}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>