/**
 * 语言映射工具函数
 * 将配置文件中的语言代码映射到翻译服务的语言代码
 */

import {
    langToTranslateMap,
    translateToLangMap,
    LANGUAGE_CONFIG,
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from "../i18n/language";


// 重新导出以保持向后兼容
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };

/**
 * 将配置文件的语言代码转换为翻译服务的语言代码
 * @param configLang 配置文件中的语言代码
 * @returns 翻译服务的语言代码
 */
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "chinese_simplified";
}

/**
 * 将翻译服务的语言代码转换为配置文件的语言代码
 * @param translateLang 翻译服务的语言代码
 * @returns 配置文件中的语言代码
 */
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "zh";
}

/**
 * 获取语言的显示名称
 * @param langCode 语言代码（配置文件格式或翻译服务格式）
 * @returns 语言的显示名称
 */
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

/**
 * 检测浏览器语言并返回支持的语言代码
 * @param fallbackLang 备用语言，默认为 'en'
 * @returns 支持的语言代码
 */
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

/**
 * 获取当前站点语言（优先使用浏览器检测）
 * @param configLang 配置的语言（可选）
 * @returns 当前站点语言
 */
export function getSiteLanguage(configLang?: string): SupportedLanguage {
    // 如果配置了语言且在支持列表中，使用配置的语言
    if (configLang && SUPPORTED_LANGUAGES.includes(configLang as SupportedLanguage)) {
        return configLang as SupportedLanguage;
    }
    // 否则自动检测浏览器语言
    return detectBrowserLanguage();
}