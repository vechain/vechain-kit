'use client';

import { useLayoutEffect, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { resolveLanguage } from './config';

// SSR-safe layout effect — falls back to useEffect on the server (which
// never runs there anyway). `useLayoutEffect` runs synchronously after the
// React commit and before the browser paints, so the language switch
// happens *between* the initial English render and the first frame the
// user actually sees.
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Wraps the app in the i18next React context. i18n is initialised at module
 * load with 'en' so server-rendered HTML matches the client's first render
 * (no hydration warning). The actual language is resolved client-side from
 * URL / localStorage / navigator and applied via `changeLanguage` in a
 * layout effect — synchronous, pre-paint, so users with a non-English
 * locale never see an English flash.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
    useIsomorphicLayoutEffect(() => {
        const detected = resolveLanguage();
        if (detected && i18n.language !== detected) {
            i18n.changeLanguage(detected);
        }
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
