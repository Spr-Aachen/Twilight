import { analyticsConfig } from "@/config";


export const ANALYTICS_ATTRS = {
    baseUrl: "data-analytics-base-url",
    apiKey: "data-analytics-api-key",
    websiteId: "data-analytics-website-id",
    pageUrl: "data-page-url",
    i18nViews: "data-i18n-views",
    i18nVisitors: "data-i18n-visitors",
    i18nError: "data-i18n-error",
    processed: "data-processed",
} as const;

export type AnalyticsConfig = {
    enabled: boolean;
    platform: string;
    code?: string;
    websiteId?: string;
    apiKey?: string;
    baseUrl?: string;
};

export const getWebsiteId = (code: string): string => {
    return code.match(/data-website-id="([^"]+)"/)?.[1] || "";
};

export const getAnalyticsConfig = (): AnalyticsConfig => {
    const { enabled, platform } = analyticsConfig;
    if (platform === "umami") {
        return {
            enabled,
            platform,
            code: analyticsConfig.umami.code,
            websiteId: getWebsiteId(analyticsConfig.umami.code),
            apiKey: analyticsConfig.umami.apiKey,
            baseUrl: analyticsConfig.umami.baseUrl,
        };
    }
    return { enabled, platform };
};

export const generateStatsText = (
    pageViews: number,
    visitors: number,
    i18nViews: string,
    i18nVisitors: string
): string => {
    return `${i18nViews} ${pageViews} · ${i18nVisitors} ${visitors}`;
};

export const STATS_LOADING_KEY = "statsLoading";
export const STATS_ERROR_KEY = "statsError";

export interface AnalyticsStats {
    pageviews: number;
    visitors: number;
    visits?: number;
    bounces?: number;
    totaltime?: number;
}

const fetchUmamiStats = async (
    baseUrl: string,
    apiKey: string,
    websiteId: string,
    urlPath?: string
): Promise<AnalyticsStats> => {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const currentTimestamp = Date.now();
    
    let statsUrl: string;
    if (urlPath) {
        statsUrl = `${cleanBaseUrl}/v1/websites/${websiteId}/stats?startAt=0&endAt=${currentTimestamp}&path=${encodeURIComponent(urlPath)}`;
    } else {
        statsUrl = `${cleanBaseUrl}/v1/websites/${websiteId}/stats?startAt=0&endAt=${currentTimestamp}`;
    }

    const res = await fetch(statsUrl, {
        headers: {
            "x-umami-api-key": apiKey,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch analytics stats");
    }

    const stats = await res.json();

    return {
        pageviews: typeof stats.pageviews === "object" ? stats.pageviews.value : (stats.pageviews || 0),
        visitors: typeof stats.visitors === "object" ? stats.visitors.value : (stats.visitors || 0),
        visits: typeof stats.visits === "object" ? stats.visits.value : (stats.visits || 0),
        bounces: typeof stats.bounces === "object" ? stats.bounces.value : (stats.bounces || 0),
        totaltime: typeof stats.totaltime === "object" ? stats.totaltime.value : (stats.totaltime || 0),
    };
};

export const initAnalyticsStats = (
    containerSelector: string,
    displaySelector: string,
    platform: string,
    isPageStats: boolean = false
) => {
    const containers = document.querySelectorAll(containerSelector);

    containers.forEach(async (containerElement) => {
        const container = containerElement as HTMLElement;
        if (container.getAttribute(ANALYTICS_ATTRS.processed)) return;
        container.setAttribute(ANALYTICS_ATTRS.processed, "true");

        const baseUrl = container.getAttribute(ANALYTICS_ATTRS.baseUrl);
        const apiKey = container.getAttribute(ANALYTICS_ATTRS.apiKey);
        const websiteId = container.getAttribute(ANALYTICS_ATTRS.websiteId);
        const i18nViews = container.getAttribute(ANALYTICS_ATTRS.i18nViews);
        const i18nVisitors = container.getAttribute(ANALYTICS_ATTRS.i18nVisitors);
        const i18nError = container.getAttribute(ANALYTICS_ATTRS.i18nError);
        const pageUrl = isPageStats ? container.getAttribute(ANALYTICS_ATTRS.pageUrl) : undefined;

        if (!baseUrl || !apiKey || !websiteId) return;

        try {
            let stats: AnalyticsStats;
            
            if (platform === "umami") {
                stats = await fetchUmamiStats(baseUrl, apiKey, websiteId, pageUrl || undefined);
            } else {
                throw new Error(`Unsupported analytics platform: ${platform}`);
            }
            
            const displayElement = container.querySelector(displaySelector);
            if (displayElement) {
                displayElement.textContent = generateStatsText(
                    stats.pageviews,
                    stats.visitors,
                    i18nViews || "",
                    i18nVisitors || ""
                );
            }
        } catch (error) {
            console.error("Error fetching analytics stats:", error);
            const displayElement = container.querySelector(displaySelector);
            if (displayElement) {
                displayElement.textContent = i18nError || "";
            }
        }
    });
};