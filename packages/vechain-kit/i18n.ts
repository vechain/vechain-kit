import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import en from './src/languages/en.json';

export const supportedLanguages = [
    'en', 'de', 'it', 'fr', 'es', 'zh', 'ja', 'ru', 'ro',
    'vi', 'nl', 'ko', 'sv', 'tw', 'tr', 'hi', 'pt',
];

export const languageNames: Record<string, string> = {
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    ja: '日本語',
    ru: 'Русский',
    ro: 'Română',
    vi: 'Tiếng Việt',
    nl: 'Nederlands',
    ko: '한국어',
    sv: 'Svenska',
    tw: '繁體中文',
    tr: 'Türkçe',
    hi: 'हिन्दी',
    pt: 'Português',
};

export const bcp47LanguageCodes: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    it: 'it-IT',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ru: 'ru-RU',
    ro: 'ro-RO',
    vi: 'vi-VN',
    nl: 'nl-NL',
    ko: 'ko-KR',
    sv: 'sv-SE',
    tw: 'zh-TW',
    tr: 'tr-TR',
    hi: 'hi-IN',
    pt: 'pt-BR',
};

const languageImportMap: Record<string, () => Promise<{ default: Record<string, string> }>> = {
    de: () => import('./src/languages/de.json'),
    it: () => import('./src/languages/it.json'),
    fr: () => import('./src/languages/fr.json'),
    es: () => import('./src/languages/es.json'),
    zh: () => import('./src/languages/zh.json'),
    ja: () => import('./src/languages/ja.json'),
    ru: () => import('./src/languages/ru.json'),
    ro: () => import('./src/languages/ro.json'),
    tw: () => import('./src/languages/tw.json'),
    vi: () => import('./src/languages/vi.json'),
    nl: () => import('./src/languages/nl.json'),
    ko: () => import('./src/languages/ko.json'),
    sv: () => import('./src/languages/sv.json'),
    tr: () => import('./src/languages/tr.json'),
    hi: () => import('./src/languages/hi.json'),
    pt: () => import('./src/languages/pt.json'),
};

/**
 * Loads a non-English language bundle into i18n.
 * Returns immediately if already loaded or language is English.
 */
export const loadLanguage = async (lng: string): Promise<void> => {
    if (lng === 'en' || i18n.hasResourceBundle(lng, 'translation')) return;

    const importFn = languageImportMap[lng];
    if (!importFn) return;

    const module = await importFn();
    i18n.addResourceBundle(lng, 'translation', module.default, true, true);
};

const customLanguageDetector = {
    name: 'customDetector',
    lookup: (options?: { languages?: string[] } | undefined) => {
        if (typeof window !== 'undefined') {
            const storedLanguage = localStorage.getItem('i18nextLng');
            if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
                return storedLanguage;
            }
        }

        const propLanguage = options?.languages?.[0];
        if (propLanguage && supportedLanguages.includes(propLanguage)) {
            return propLanguage;
        }

        if (typeof window !== 'undefined') {
            const fullLang = navigator.language;

            const matchedKey = Object.entries(bcp47LanguageCodes).find(
                ([, bcp47]) =>
                    bcp47.toLowerCase() === fullLang.toLowerCase(),
            )?.[0];
            if (matchedKey && supportedLanguages.includes(matchedKey)) {
                return matchedKey;
            }

            const browserLang = fullLang.split('-')[0];
            if (browserLang && supportedLanguages.includes(browserLang)) {
                return browserLang;
            }
        }

        return 'en';
    },
    cacheUserLanguage: (lng: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('i18nextLng', lng);
        }
    },
};

i18n.use({
    type: 'languageDetector',
    async: false,
    init: () => {},
    detect: customLanguageDetector.lookup,
    cacheUserLanguage: customLanguageDetector.cacheUserLanguage,
})
    .use(
        resourcesToBackend((language: string) => {
            if (language === 'en') return;
            const importFn = languageImportMap[language];
            if (importFn) return importFn();
        }),
    )
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
