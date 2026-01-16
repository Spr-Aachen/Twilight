import { langToLocaleMap } from "@i18n/language";
import { getDefaultLanguage } from "./language";


export function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().substring(0, 10);
}

// 国际化日期格式化函数
export function formatDateI18n(dateString: string): string {
    const date = new Date(dateString);
    const lang = getDefaultLanguage();

    // 根据语言设置不同的日期格式
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    // 使用统一的语言配置获取 locale
    const locale = langToLocaleMap[lang] || "en-US";
    return date.toLocaleDateString(locale, options);
}