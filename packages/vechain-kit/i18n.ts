import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const instance = i18next.createInstance();
// Define supported languages
export const supportedLanguages = ['en', 'de', 'it', 'fr', 'es', 'zh', 'ja'];

// Empty resources - will be loaded dynamically
export const resources = {};

// Language names mapping
export const languageNames = {
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    ja: '日本語',
};

export const bcp47LanguageCodes: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    it: 'it-IT',
    fr: 'fr-FR',
    es: 'es-ES',
    zh: 'zh-CN',
    ja: 'ja-JP',
};

// Custom language detector that checks prop first, then browser
const customLanguageDetector = {
    name: 'customDetector',
    lookup: (options?: { languages?: string[] } | undefined) => {
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

instance
    .use(HttpBackend)
    .use({
        type: 'languageDetector',
        async: false,
        init: () => {},
        detect: customLanguageDetector.lookup,
        cacheUserLanguage: customLanguageDetector.cacheUserLanguage,
    })
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: supportedLanguages,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            // Load from the locales directory in the published package
            loadPath: '/locales/{{lng}}.json',
            // For npm packages, we need to handle the path resolution
            requestOptions: {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'default',
            },
        },
        // Don't load resources immediately - they'll be loaded on demand
        initImmediate: false,
        // Only load the current language
        load: 'currentOnly',
        // Preload only the fallback language
        preload: ['en'],
    });

export default instance;
