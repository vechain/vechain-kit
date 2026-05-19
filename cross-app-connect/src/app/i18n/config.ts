'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import de from './locales/de.json';
import it from './locales/it.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';
import vi from './locales/vi.json';
import nl from './locales/nl.json';
import ko from './locales/ko.json';
import sv from './locales/sv.json';
import tw from './locales/tw.json';
import tr from './locales/tr.json';
import hi from './locales/hi.json';
import pt from './locales/pt.json';

/**
 * Languages we ship, matching the vechain-kit's set. Order is irrelevant;
 * the value is a string-set lookup used by `normalizeBrowserTag`.
 */
export const SUPPORTED_LANGUAGES = [
    'en', 'de', 'it', 'fr', 'es', 'zh', 'ja', 'ru', 'ro',
    'vi', 'nl', 'ko', 'sv', 'tw', 'tr', 'hi', 'pt',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SUPPORTED = new Set<string>(SUPPORTED_LANGUAGES);

const resources = {
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
    fr: { translation: fr },
    es: { translation: es },
    zh: { translation: zh },
    ja: { translation: ja },
    ru: { translation: ru },
    ro: { translation: ro },
    vi: { translation: vi },
    nl: { translation: nl },
    ko: { translation: ko },
    sv: { translation: sv },
    tw: { translation: tw },
    tr: { translation: tr },
    hi: { translation: hi },
    pt: { translation: pt },
};

/**
 * Map a BCP-47 tag from `navigator.language` (`en-US`, `zh-TW`, `pt-BR`,
 * `de-AT`, …) to the closest tag we ship. Variants of Chinese get special
 * treatment: Traditional → `tw`, everything else → `zh`.
 */
function normalizeBrowserTag(raw: string | undefined): SupportedLanguage | null {
    if (!raw) return null;
    const lower = raw.toLowerCase();
    if (lower.startsWith('zh')) {
        if (
            lower === 'zh-tw' ||
            lower === 'zh-hk' ||
            lower === 'zh-mo' ||
            lower.includes('hant')
        ) {
            return 'tw';
        }
        return 'zh';
    }
    const base = lower.split('-')[0];
    return SUPPORTED.has(base) ? (base as SupportedLanguage) : null;
}

/**
 * Always use the device's language; fall back to English when the browser
 * locale isn't one we ship. No URL override, no localStorage stash — the
 * popup mirrors the OS / browser setting every time it opens.
 */
export function resolveLanguage(): SupportedLanguage {
    if (typeof navigator === 'undefined') return 'en';
    return normalizeBrowserTag(navigator.language) ?? 'en';
}

// Initialise once at module load with 'en' so server-rendered HTML and the
// client's first React render produce *identical* strings — that's what
// avoids React's hydration-mismatch warning. The actual language is applied
// in `<I18nProvider>` after the SSR/first-render gate.
i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes
    },
    returnNull: false,
});

export default i18n;
