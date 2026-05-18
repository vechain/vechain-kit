'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from './config';

/**
 * Wraps the app in the i18next React context so every component can call
 * `useTranslation()`. The i18n instance is initialised once at module
 * load (see `./config.ts`) with the resolved language baked in.
 */
export function I18nProvider({ children }: { children: React.ReactNode }) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
