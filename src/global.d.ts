declare global {
    interface HTMLElementTagNameMap {
        "table-of-contents": HTMLElement & {
            init?: () => void;
        };
    }

    interface Window {
        // Define swup type directly since @swup/astro doesn't export AstroIntegration
        swup: any;
        semifullScrollHandler: (() => void) | null;
        closeAnnouncement: () => void;
        iconifyLoaded: boolean;
        __iconifyLoader: {
            load: () => Promise<void>;
        };
        pagefind: {
            search: (query: string) => Promise<{
                results: Array<{
                    data: () => Promise<SearchResult>;
                }>;
            }>;
        };
        translate?: {
            service: {
                use: (service: string) => void;
            };
            language: {
                setLocal: (language: string) => void;
            };
            setAutoDiscriminateLocalLanguage: () => void;
            ignore: {
                class: string[];
                tag: string[];
            };
            selectLanguageTag: {
                show: boolean;
            };
            storage: {
                set: () => void;
            };
            listener: {
                start: () => void;
            };
            execute: () => void;
        };
        mobileTOCInit?: () => void;
        loadTranslateScript?: () => Promise<void>;
        getUmamiWebsiteStats?: (baseUrl: string, apiKey: string, websiteId: string) => Promise<any>;
        getUmamiPageStats?: (baseUrl: string, apiKey: string, websiteId: string, urlPath: string, startAt?: number, endAt?: number) => Promise<any>;
    }
}


interface SearchResult {
    url: string;
    meta: {
        title: string;
    };
    excerpt: string;
    content?: string;
    word_count?: number;
    filters?: Record<string, unknown>;
    anchors?: Array<{
        element: string;
        id: string;
        text: string;
        location: number;
    }>;
    weighted_locations?: Array<{
        weight: number;
        balanced_score: number;
        location: number;
    }>;
    locations?: number[];
    raw_content?: string;
    raw_url?: string;
    sub_results?: SearchResult[];
}


export { SearchResult };