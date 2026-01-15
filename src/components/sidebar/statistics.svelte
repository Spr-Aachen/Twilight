<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from "@iconify/svelte";
    import dayjs from 'dayjs';
    import { i18n } from "@i18n/translation";
    import I18nKey from "@i18n/i18nKey";

    export let posts: any[] = [];
    export let categories: any[] = [];
    export let tags: any[] = [];
    let className: string = "";
    export { className as class };
    export let style: string = "";

    const labels = {
        year: i18n(I18nKey.year),
        month: i18n(I18nKey.month),
        day: i18n(I18nKey.day),
        posts: i18n(I18nKey.posts),
        activities: "Activities",
        categories: i18n(I18nKey.categories),
        tags: i18n(I18nKey.tags),
        statistics: i18n(I18nKey.statistics),
    };

    let container: HTMLDivElement;
    let heatmapContainer: HTMLDivElement;
    let categoriesContainer: HTMLDivElement;
    let tagsContainer: HTMLDivElement;
    let echarts: any;
    let heatmapChart: any;
    let categoriesChart: any;
    let tagsChart: any;

    let timeScale: 'year' | 'month' | 'day' = 'year';
    let isDark = false;

    const getThemeColors = () => {
        const isDarkNow = document.documentElement.classList.contains('dark');
        return {
            text: isDarkNow ? '#e5e7eb' : '#374151',
            primary: isDarkNow ? '#60a5fa' : '#3b82f6', // Use standard hex for primary to avoid oklch issues in ECharts
            grid: isDarkNow ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            areaStart: isDarkNow ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)',
            areaEnd: isDarkNow ? 'rgba(96, 165, 250, 0)' : 'rgba(59, 130, 246, 0)',
        };
    };

    const loadECharts = async () => {
        if (typeof window === 'undefined') return;
        isDark = document.documentElement.classList.contains('dark');
        if (window.echarts) {
            echarts = window.echarts;
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
            script.async = true;
            document.head.appendChild(script);
            await new Promise((resolve) => {
                script.onload = resolve;
            });
            echarts = window.echarts;
        }
    };

    let isInitialized = false;

    const initCharts = () => {
        if (isInitialized) return;
        initActivityChart();
        initRadarCharts();
        isInitialized = true;
    };

    const initActivityChart = (isUpdate = false) => {
        if (!heatmapContainer || !echarts) return;
        
        // 尝试获取现有实例以支持 Swup 持久化
        const existingChart = echarts.getInstanceByDom(heatmapContainer);
        const isNew = !existingChart;
        if (existingChart) {
            heatmapChart = existingChart;
        } else {
            heatmapChart = echarts.init(heatmapContainer, isDark ? 'dark' : null, { renderer: 'svg' });
        }

        const colors = getThemeColors();

        const now = dayjs();
        let data: any[] = [];
        let xAxisData: string[] = [];

        if (timeScale === 'year') {
            // Show from the oldest post's year to current year, at least 5 years
            const oldestYear = posts.length > 0
                ? Math.min(...posts.map(p => dayjs(p.data.published).year()))
                : now.year();
            const currentYear = now.year();
            const startYear = Math.min(oldestYear, currentYear - 4);

            for (let year = startYear; year <= currentYear; year++) {
                const yearStr = year.toString();
                xAxisData.push(yearStr);
                const count = posts.filter(p => dayjs(p.data.published).year() === year).length;
                data.push(count);
            }
        } else if (timeScale === 'month') {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const month = now.subtract(i, 'month');
                const monthStr = month.format('YYYY-MM');
                xAxisData.push(month.format('MMM'));
                const count = posts.filter(p => dayjs(p.data.published).format('YYYY-MM') === monthStr).length;
                data.push(count);
            }
        } else {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const day = now.subtract(i, 'day');
                const dayStr = day.format('YYYY-MM-DD');
                xAxisData.push(day.format('DD'));
                const count = posts.filter(p => dayjs(p.data.published).format('YYYY-MM-DD') === dayStr).length;
                data.push(count);
            }
        }

        const option = {
            backgroundColor: 'transparent',
            animation: isNew || isUpdate,
            animationDuration: isNew ? 2000 : 500,
            animationEasing: 'cubicOut',
            title: {
                text: labels.activities,
                left: 'left',
                textStyle: { fontSize: 14, color: colors.text, fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                confine: true,
                formatter: (params: any) => `${params[0].name}: ${params[0].value} ${labels.posts}`
            },
            grid: { left: '10%', right: '5%', bottom: '15%', top: '25%', containLabel: true },
            xAxis: {
                type: 'category',
                data: xAxisData,
                axisLine: { lineStyle: { color: colors.grid } },
                axisLabel: { color: colors.text, fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                axisLine: { show: false },
                axisLabel: { color: colors.text, fontSize: 10 },
                splitLine: { lineStyle: { color: colors.grid, type: 'dashed' } }
            },
            series: [{
                data: data,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: { color: colors.primary },
                lineStyle: { width: 3, color: colors.primary },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors.areaStart },
                        { offset: 1, color: colors.areaEnd }
                    ])
                }
            }]
        };

        heatmapChart.setOption(option);
    };

    const initRadarCharts = () => {
        if (!echarts) return;
        const colors = getThemeColors();

        // Categories Radar
        if (categoriesContainer) {
            const existingCategoriesChart = echarts.getInstanceByDom(categoriesContainer);
            if (existingCategoriesChart) {
                categoriesChart = existingCategoriesChart;
            } else {
                categoriesChart = echarts.init(categoriesContainer, isDark ? 'dark' : null, { renderer: 'svg' });
            }

            const indicator = categories.map(c => ({ name: c.name, max: Math.max(...categories.map(x => x.count), 5) }));
            const data = categories.map(c => c.count);

            categoriesChart.setOption({
                backgroundColor: 'transparent',
                animation: true,
                animationDuration: 2000,
                animationEasing: 'exponentialOut',
                tooltip: {
                    show: true,
                    trigger: 'item',
                    confine: true
                },
                title: {
                    text: labels.categories,
                    left: 'left',
                    textStyle: { fontSize: 14, color: colors.text, fontWeight: 'bold' }
                },
                radar: {
                    indicator: indicator,
                    radius: '60%',
                    center: ['50%', '60%'],
                    axisName: { color: colors.text, fontSize: 10 },
                    splitLine: { lineStyle: { color: colors.grid } },
                    splitArea: { show: false }
                },
                series: [{
                    type: 'radar',
                    data: [{ value: data, name: labels.categories }],
                    areaStyle: { color: 'rgba(255, 123, 0, 0.6)' },
                    lineStyle: { color: 'rgba(255, 123, 0, 0.9)' },
                    itemStyle: { color: 'rgba(255, 123, 0, 0.9)' },
                    emphasis: {
                        areaStyle: { color: 'rgba(255, 123, 0, 0.9)' }
                    }
                }]
            });
        }

        // Tags Radar
        if (tagsContainer) {
            const existingTagsChart = echarts.getInstanceByDom(tagsContainer);
            if (existingTagsChart) {
                tagsChart = existingTagsChart;
            } else {
                tagsChart = echarts.init(tagsContainer, isDark ? 'dark' : null, { renderer: 'svg' });
            }

            const sortedTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 8);
            const indicator = sortedTags.map(t => ({ name: t.name, max: Math.max(...sortedTags.map(x => x.count), 5) }));
            const data = sortedTags.map(t => t.count);

            tagsChart.setOption({
                backgroundColor: 'transparent',
                animation: true,
                animationDuration: 2000,
                animationEasing: 'exponentialOut',
                tooltip: {
                    show: true,
                    trigger: 'item',
                    confine: true
                },
                title: {
                    text: labels.tags,
                    left: 'left',
                    textStyle: { fontSize: 14, color: colors.text, fontWeight: 'bold' }
                },
                radar: {
                    indicator: indicator,
                    radius: '60%',
                    center: ['50%', '60%'],
                    axisName: { color: colors.text, fontSize: 10 },
                    splitLine: { lineStyle: { color: colors.grid } },
                    splitArea: { show: false }
                },
                series: [{
                    type: 'radar',
                    data: [{ value: data, name: labels.tags }],
                    areaStyle: { color: 'rgba(16, 185, 129, 0.6)' },
                    lineStyle: { color: 'rgba(16, 185, 129, 0.9)' },
                    itemStyle: { color: 'rgba(16, 185, 129, 0.9)' },
                    emphasis: {
                        areaStyle: { color: 'rgba(16, 185, 129, 0.9)' }
                    }
                }]
            });
        }
    };

    onMount(async () => {
        await loadECharts();
        
        // 检查是否处于初始加载动画阶段
        const hasInitialAnimation = document.documentElement.classList.contains('show-initial-animation') || 
                                   document.documentElement.classList.contains('is-loading');
        
        if (hasInitialAnimation) {
            // 查找带有动画类的侧边栏容器
            const sidebar = container?.closest('.onload-animation-up');
            if (sidebar) {
                // 监听动画结束事件
                sidebar.addEventListener('animationend', (e) => {
                    if ((e as AnimationEvent).animationName === 'fade-in-up') {
                        initCharts();
                    }
                }, { once: true });
                
                // 保底机制：如果动画事件没触发，1.5秒后强制加载
                setTimeout(() => {
                    if (!heatmapChart) initCharts();
                }, 1500);
            } else {
                // 如果找不到侧边栏，延迟 1 秒加载
                setTimeout(initCharts, 1000);
            }
        } else {
            // 无动画状态，直接加载
            initCharts();
        }

        const handleResize = () => {
            heatmapChart?.resize();
            categoriesChart?.resize();
            tagsChart?.resize();
        };

        const observer = new MutationObserver(() => {
            const newIsDark = document.documentElement.classList.contains('dark');
            if (newIsDark !== isDark) {
                isDark = newIsDark;
                if (isInitialized) {
                    initActivityChart(true);
                    initRadarCharts();
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    });

    $: if (timeScale && echarts && isInitialized) {
        initActivityChart(true);
    }
</script>

<div id="statistics" bind:this={container} data-swup-persist="statistics" class={"pb-4 card-base " + className} {style}>
    <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:left-[-16px] before:top-[5.5px]">{labels.statistics}</div>
    <div class="collapse-wrapper px-4 overflow-hidden">
        <div class="stats-charts">
            <div class="chart-section heatmap-section">
                <div class="section-header">
                    <div class="dropdown-wrapper">
                        <button class="time-scale-select flex items-center gap-1">
                            {labels[timeScale]}
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" class="dropdown-icon" />
                        </button>
                        <div class="dropdown-menu-custom">
                            <button class="dropdown-item-custom" class:active={timeScale === 'year'} on:click={() => timeScale = 'year'}>{labels.year}</button>
                            <button class="dropdown-item-custom" class:active={timeScale === 'month'} on:click={() => timeScale = 'month'}>{labels.month}</button>
                            <button class="dropdown-item-custom" class:active={timeScale === 'day'} on:click={() => timeScale = 'day'}>{labels.day}</button>
                        </div>
                    </div>
                </div>
                <div bind:this={heatmapContainer} class="heatmap-container"></div>
            </div>

            <div class="chart-section radar-section">
                <div bind:this={categoriesContainer} class="radar-container"></div>
            </div>

            <div class="chart-section radar-section">
                <div bind:this={tagsContainer} class="radar-container"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .stats-charts {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
    }
    .chart-section {
        width: 100%;
        position: relative;
    }
    .heatmap-section {
        position: relative;
    }
    .section-header {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
    }
    .time-scale-select {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        border: 1px solid var(--line-color);
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.2s;
        outline: none;
    }
    .time-scale-select:hover {
        opacity: 1;
        border-color: var(--primary);
    }
    .dropdown-wrapper {
        position: relative;
        display: inline-block;
    }
    .dropdown-wrapper:hover .dropdown-menu-custom {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    .dropdown-menu-custom {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background: var(--card-bg);
        border: 1px solid var(--line-color);
        border-radius: 4px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s;
        z-index: 50;
        min-width: 80px;
        overflow: hidden;
    }
    .dropdown-item-custom {
        width: 100%;
        text-align: left;
        padding: 6px 12px;
        font-size: 0.7rem;
        color: var(--btn-content);
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }
    .dropdown-item-custom:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
    }
    .dropdown-item-custom.active {
        color: var(--primary);
        font-weight: bold;
        background: var(--btn-plain-bg-hover);
    }
    .dropdown-icon {
        font-size: 0.9rem;
        transition: transform 0.2s;
    }
    .dropdown-wrapper:hover .dropdown-icon {
        transform: rotate(180deg);
    }
    .heatmap-container {
        height: 180px;
        width: 100%;
    }
    .radar-container {
        height: 250px;
        width: 100%;
    }
</style>