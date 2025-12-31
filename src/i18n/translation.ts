import { getResolvedSiteLang } from "@/utils/language";
import { en } from "./languages/en";
import { ja } from "./languages/ja";
import { zh } from "./languages/zh";
import type I18nKey from "./i18nKey";


export type Translation = {
    [K in I18nKey]: string;
};

const defaultTranslation = en;

const map: { [key: string]: Translation } = {
    en: en,
    en_us: en,
    en_gb: en,
    en_au: en,
    zh: zh,
    zh_cn: zh,
    ja: ja,
    ja_jp: ja,
};

export function getTranslation(lang: string): Translation {
    return map[lang.toLowerCase()] || defaultTranslation;
}

export function i18n(key: I18nKey): string {
    const lang = getResolvedSiteLang();
    return getTranslation(lang)[key];
}