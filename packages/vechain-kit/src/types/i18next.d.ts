// Type definitions for i18next with dynamic loading
// Resources are loaded at runtime, not bundled
import type { TFunction } from 'i18next';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: Record<string, string>;
        };
        // Force t() to always return string type
        returnNull: false;
        returnEmptyString: false;
        returnObjects: false;
        // Ensure keys are strings
        allowObjectInHTMLChildren: false;
    }
}

declare module 'react-i18next' {
    export function useTranslation(): {
        t: (key: any, options?: any) => string;
        i18n: any;
        ready: boolean;
    };
}
