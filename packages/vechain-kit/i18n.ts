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

// Define supported languages
export const supportedLanguages = ['en', 'de', 'it', 'fr', 'es', 'zh', 'ja'];

export const resources = {
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
    ja: { translation: ja },
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
