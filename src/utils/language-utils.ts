/**
 * 语言映射工具函数
 * 将配置文件中的语言代码映射到翻译服务的语言代码
 */

// 配置文件语言代码到翻译服务语言代码的映射
export const langToTranslateMap: Record<string, string> = {
	zh_CN: "chinese_simplified",
	zh_TW: "chinese_traditional",
	en: "english",
	ja: "japanese",
	ko: "korean",
	es: "spanish",
	th: "thai",
	vi: "vietnamese",
	tr: "turkish",
	id: "indonesian",
	fr: "french",
	de: "german",
	ru: "russian",
	ar: "arabic",
};

// 翻译服务语言代码到配置文件语言代码的映射
export const translateToLangMap: Record<string, string> = {
	chinese_simplified: "zh_CN",
	chinese_traditional: "zh_TW",
	english: "en",
	japanese: "ja",
	korean: "ko",
	spanish: "es",
	thai: "th",
	vietnamese: "vi",
	turkish: "tr",
	indonesian: "id",
	french: "fr",
	german: "de",
	russian: "ru",
	arabic: "ar",
};

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
	return translateToLangMap[translateLang] || "zh_CN";
}

/**
 * 获取语言的显示名称
 * @param langCode 语言代码（配置文件格式或翻译服务格式）
 * @returns 语言的显示名称
 */
export function getLanguageDisplayName(langCode: string): string {
	const languageNames: Record<string, string> = {
		zh_CN: "简体中文",
		zh_TW: "繁體中文",
		en: "English",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		th: "ไทย",
		vi: "Tiếng Việt",
		tr: "Türkçe",
		id: "Bahasa Indonesia",
		fr: "Français",
		de: "Deutsch",
		ru: "Русский",
		ar: "العربية",
		// 翻译服务格式
		chinese_simplified: "简体中文",
		chinese_traditional: "繁體中文",
		english: "English",
		japanese: "日本語",
		korean: "한국어",
		spanish: "Español",
		thai: "ไทย",
		vietnamese: "Tiếng Việt",
		turkish: "Türkçe",
		indonesian: "Bahasa Indonesia",
		french: "Français",
		german: "Deutsch",
		russian: "Русский",
		arabic: "العربية",
	};

	return languageNames[langCode] || langCode;
}
