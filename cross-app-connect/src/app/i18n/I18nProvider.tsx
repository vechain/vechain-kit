'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { resolveLanguage } from './config';

/**
 * Wraps the app in the i18next React context. Why the mounted gate:
 *
 * The browser paints the server-rendered HTML *before* any JavaScript
 * loads. If that HTML contained English copy and the user's language is
 * Italian, the user would see "Reviewing transaction" then a re-paint of
 * "Revisione transazione" once React hydrates — a real visual flash that
 * `useLayoutEffect` can't fix (the effect runs after JS loads, too late).
 *
 * So during SSR and the first client render we return `null` — no
 * translatable text in the initial HTML. Once mounted, we detect the
 * language (URL → localStorage → navigator → 'en') and apply it before
 * showing the children. The user's first painted frame is already in
 * their language; the brief blank moment is hidden behind the spinner
 * shell each page renders during its own loading state.
 *
 * Trade-off: routes are no longer SSR-rendered for translated content.
 * For a one-shot popup this is acceptable — JS loads fast and the popup
 * is too short-lived for SEO or Core Web Vitals to matter.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const detected = resolveLanguage();
        if (detected && i18n.language !== detected) {
            i18n.changeLanguage(detected);
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
