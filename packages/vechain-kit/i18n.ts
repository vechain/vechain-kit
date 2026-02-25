import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all language JSON files
import en from './src/languages/en.json';
import de from './src/languages/de.json';
import it from './src/languages/it.json';
import fr from './src/languages/fr.json';
import es from './src/languages/es.json';
import zh from './src/languages/zh.json';
import ja from './src/languages/ja.json';
import ru from './src/languages/ru.json';
import ro from './src/languages/ro.json';
import tw from './src/languages/tw.json';
import vi from './src/languages/vi.json';
import nl from './src/languages/nl.json';
import ko from './src/languages/ko.json';
import sv from './src/languages/sv.json';
import tr from './src/languages/tr.json';
import hi from './src/languages/hi.json';
import pt from './src/languages/pt.json';

// Define supported languages
export const supportedLanguages = [
    'en', 'de', 'it', 'fr', 'es', 'zh', 'ja', 'ru', 'ro',
    'vi', 'nl', 'ko', 'sv', 'tw', 'tr', 'hi', 'pt',
];

export const resources = {
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
    ja: { translation: ja },
    ru: { translation: ru },
    ro: { translation: ro },
    tw: { translation: tw },
    vi: { translation: vi },
    nl: { translation: nl },
    ko: { translation: ko },
    sv: { translation: sv },
    tr: { translation: tr },
    hi: { translation: hi },
    pt: { translation: pt },
};

// Language names mapping
export const languageNames = {
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

// Custom language detector that checks localStorage first, then prop, then browser
const customLanguageDetector = {
    name: 'customDetector',
    lookup: (options?: { languages?: string[] } | undefined) => {
        // Check localStorage first (for persistence across page refreshes)
        if (typeof window !== 'undefined') {
            const storedLanguage = localStorage.getItem('i18nextLng');
            if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
                return storedLanguage;
            }
        }

        // Get language from VechainKitProvider prop
        const propLanguage = options?.languages?.[0];

        if (propLanguage && supportedLanguages.includes(propLanguage)) {
            return propLanguage;
        }

        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // Get browser language
            const browserLang = navigator.language.split('-')[0];
            if (browserLang && supportedLanguages.includes(browserLang)) {
                return browserLang;
            }
        }

        return 'en'; // fallback
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
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
