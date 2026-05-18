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

const STORAGE_KEY = 'vk-cross-app-connect:lng';

/**
 * Languages we ship, matching the vechain-kit's set. Order is irrelevant;
 * the value is a string-set lookup used by `resolveLanguage`.
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
 * Resolution chain at boot, evaluated once on the client:
 *   1. URL `?lng=` (set by the kit-using app when it triggers the popup).
 *   2. localStorage `vk-cross-app-connect:lng` (stashed by a prior visit).
 *   3. `navigator.language` mapped to a supported tag.
 *   4. 'en' fallback.
 *
 * Persists the resolved language back to localStorage so the transact
 * popup -- which Privy's SDK builds without our URL params -- picks up
 * what the connect popup learned.
 */
export function resolveLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') return 'en';

    // 1. URL param
    try {
        const url = new URL(window.location.href);
        const fromUrl = url.searchParams.get('lng');
        if (fromUrl) {
            const normalized = normalizeBrowserTag(fromUrl);
            if (normalized) {
                persistLanguage(normalized);
                return normalized;
            }
        }
    } catch {
        /* malformed URL — ignore */
    }

    // 2. Local storage from a prior visit
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.has(stored)) {
            return stored as SupportedLanguage;
        }
    } catch {
        /* private mode / disabled storage — ignore */
    }

    // 3. Browser preference
    const fromBrowser = normalizeBrowserTag(
        typeof navigator !== 'undefined' ? navigator.language : undefined,
    );
    if (fromBrowser) {
        persistLanguage(fromBrowser);
        return fromBrowser;
    }

    return 'en';
}

function persistLanguage(lng: SupportedLanguage) {
    try {
        window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {
        /* ignore storage errors */
    }
}

// Initialise once at module load. Subsequent `useTranslation()` calls hit
// this same instance. `resolveLanguage()` is safe to call on the server
// (returns 'en'); SSR renders English, then the client hydrates with the
// detected language without a re-render storm because i18next's React
// integration is reactive.
i18n.use(initReactI18next).init({
    resources,
    lng: resolveLanguage(),
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes
    },
    returnNull: false,
});

export default i18n;
