import { umamiConfig } from "@/config";


export const UMAMI_ATTRS = {
    baseUrl: "data-umami-base-url",
    apiKey: "data-umami-api-key",
    websiteId: "data-umami-website-id",
    pageUrl: "data-page-url",
    i18nViews: "data-i18n-views",
    i18nVisitors: "data-i18n-visitors",
    i18nError: "data-i18n-error",
    processed: "data-processed",
} as const;

export const getUmamiConfig = () => {
    return {
        enabled: umamiConfig.enabled || false,
        websiteId: umamiConfig.code.match(/data-website-id="([^"]+)"/)?.[1] || "",
        apiKey: umamiConfig.apiKey || "",
        baseUrl: umamiConfig.baseUrl || "",
    };
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

export interface UmamiStats {
    pageviews: number;
    visitors: number;
    visits?: number;
    bounces?: number;
    totaltime?: number;
}

export const fetchUmamiStats = async (
    baseUrl: string,
    apiKey: string,
    websiteId: string,
    urlPath?: string
): Promise<UmamiStats> => {
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
        throw new Error("Failed to fetch Umami stats");
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

export const initUmamiStats = (
    containerSelector: string,
    displaySelector: string,
    isPageStats: boolean = false
) => {
    const containers = document.querySelectorAll(containerSelector);

    containers.forEach(async (containerElement) => {
        const container = containerElement as HTMLElement;
        if (container.getAttribute(UMAMI_ATTRS.processed)) return;
        container.setAttribute(UMAMI_ATTRS.processed, "true");

        const baseUrl = container.getAttribute(UMAMI_ATTRS.baseUrl);
        const apiKey = container.getAttribute(UMAMI_ATTRS.apiKey);
        const websiteId = container.getAttribute(UMAMI_ATTRS.websiteId);
        const i18nViews = container.getAttribute(UMAMI_ATTRS.i18nViews);
        const i18nVisitors = container.getAttribute(UMAMI_ATTRS.i18nVisitors);
        const i18nError = container.getAttribute(UMAMI_ATTRS.i18nError);
        const pageUrl = isPageStats ? container.getAttribute(UMAMI_ATTRS.pageUrl) : undefined;

        if (!baseUrl || !apiKey || !websiteId) return;

        try {
            const stats = await fetchUmamiStats(baseUrl, apiKey, websiteId, pageUrl || undefined);
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
            console.error("Error fetching Umami stats:", error);
            const displayElement = container.querySelector(displaySelector);
            if (displayElement) {
                displayElement.textContent = i18nError || "";
            }
        }
    });
};