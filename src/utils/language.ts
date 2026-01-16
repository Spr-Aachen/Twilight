import {
    type SupportedLanguage,
    SUPPORTED_LANGUAGES,
    langToTranslateMap,
    translateToLangMap,
    LANGUAGE_CONFIG,
} from "@i18n/language";
import {
    siteConfig,
} from "@/config";


// 重新导出以保持向后兼容
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };


// 语言存储键
const LANG_STORAGE_KEY = "selected-language";

// 存储语言设置
export function setStoredLanguage(lang: string): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
}

// 获取存储的语言设置
export function getStoredLanguage(): string | null {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem(LANG_STORAGE_KEY);
    }
    return null;
}

// 获取默认语言配置
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }
    return fallback;
}

// 将配置文件的语言代码转换为翻译服务的语言代码
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "chinese_simplified";
}

// 获取解析后的站点语言代码
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage() as any;
    if (SUPPORTED_LANGUAGES.includes(configLang)) {
        return configLang as SupportedLanguage;
    }
    // 如果 siteConfig.lang 不合规，则使用浏览器检测到的语言
    return detectBrowserLanguage();
}

// 将翻译服务的语言代码转换为配置文件的语言代码
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "zh";
}

// 获取语言的显示名称
export function getLanguageDisplayName(langCode: string): string {
    // 先尝试作为配置语言代码查找
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // 尝试作为翻译服务代码查找
    const configLang = translateToLangMap[langCode];
    if (configLang && configLang in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[configLang as SupportedLanguage].displayName;
    }
    // 如果都找不到，返回原始代码
    return langCode;
}

// 检测浏览器语言并返回支持的语言代码
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // 服务端渲染时返回备用语言
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // 获取浏览器语言列表
    const browserLangs = navigator.languages || [navigator.language];
    // 遍历浏览器语言列表，找到第一个支持的语言
    for (const browserLang of browserLangs) {
        // 提取主语言代码（例如：'zh-CN' -> 'zh', 'en-US' -> 'en'）
        const langCode = browserLang.toLowerCase().split("-")[0];
        // 检查是否在支持的语言列表中
        if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
            return langCode as SupportedLanguage;
        }
    }
    // 如果没有找到支持的语言，返回备用语言
    return fallbackLang;
}

// 获取当前站点语言（优先使用缓存，其次是配置语言，最后是浏览器检测）
export function getSiteLanguage(configLang?: string): string {
    // 优先从缓存读取
    const storedLang = getStoredLanguage();
    if (storedLang) return storedLang;
    // 其次使用传入的配置语言或从 carrier 获取的默认语言
    const defaultLang = configLang || getDefaultLanguage();
    if (SUPPORTED_LANGUAGES.includes(defaultLang as SupportedLanguage)) {
        return langToTranslateMap[defaultLang];
    }
    // 最后自动检测浏览器语言并转换为翻译服务代码
    const browserLang = detectBrowserLanguage();
    return langToTranslateMap[browserLang];
}

// 初始化翻译功能
export function initTranslateService(): void {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    // 检查 translate.js 是否已加载
    const translate = (window as any).translate;
    if (!translate || (window as any).translateInitialized) return;
    // 配置 translate.js
    if (siteConfig.translate.service) {
        translate.service.use(siteConfig.translate.service);
    }
    // 设置源语言（始终是网站渲染的语言）
    const resolvedLang = getResolvedSiteLang();
    const sourceLang = getTranslateLanguageFromConfig(resolvedLang);
    translate.language.setLocal(sourceLang);
    // 获取目标语言（缓存 -> 配置 -> 浏览器）
    const targetLang = getSiteLanguage(resolvedLang);
    // 如果目标语言不同于源语言，则设置目标语言
    if (targetLang && targetLang !== sourceLang) {
        translate.to = targetLang;
    }
    // 自动识别语言
    if (siteConfig.translate.autoDiscriminate) {
        translate.setAutoDiscriminateLocalLanguage();
    }
    // 设置忽略项
    if (siteConfig.translate.ignoreClasses) {
        siteConfig.translate.ignoreClasses.forEach((className: string) => {
            translate.ignore.class.push(className);
        });
    }
    if (siteConfig.translate.ignoreTags) {
        siteConfig.translate.ignoreTags.forEach((tagName: string) => {
            translate.ignore.tag.push(tagName);
        });
    }
    // UI 配置
    if (siteConfig.translate.showSelectTag === false) {
        translate.selectLanguageTag.show = false;
    }
    // 接管存储逻辑：使用自定义缓存并同步到 translate.js
    translate.storage.set = function (key: string, value: string) {
        if (key === "to") { // translate.js 使用 "to" 存储目标语言
            setStoredLanguage(value);
        } else {
            localStorage.setItem(key, value);
        }
    };
    translate.storage.get = function (key: string) {
        if (key === "to") {
            return getStoredLanguage();
        }
        return localStorage.getItem(key);
    };
    // 启动翻译监听
    translate.listener.start();
    (window as any).translateInitialized = true;
    // 如果目标语言存在且不是源语言，执行翻译
    // 强制执行一次 execute 以确保初始化时应用翻译
    if (translate.to && translate.to !== translate.language.getLocal()) {
        // 延迟一小段时间执行，确保 DOM 完全就绪
        setTimeout(() => {
            translate.execute();
        }, 10);
    } else if (translate.to === translate.language.getLocal()) {
        // 如果目标语言就是源语言，确保处于未翻译状态
        // 有时插件可能会残留之前的翻译状态
        translate.reset();
    }
}

// 加载并初始化翻译功能
export async function loadAndInitTranslate(): Promise<void> {
    if (typeof window === "undefined" || !siteConfig.translate?.enable) return;
    try {
        // 检查是否已经加载
        if (!(window as any).translate) {
            // 使用动态导入，Vite 会自动处理代码分割
            await import("@/plugins/translate");
            (window as any).translateScriptLoaded = true;
        }
        // 初始化服务
        initTranslateService();
    } catch (error) {
        console.error('Failed to load or init translate.js:', error);
    }
}

// 切换语言
export function toggleLanguage(langCode: string): void {
    const translate = (window as any).translate;
    if (!translate) return;
    // 切换语言
    translate.changeLanguage(langCode);
    setStoredLanguage(langCode);
}