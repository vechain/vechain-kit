import { resources } from '../../i18n';

export const initializeI18n = (i18nInstance: any) => {
    // Get all languages from VeChainKit resources
    const languages = Object.keys(resources);

    // Add each language's translations to the existing i18n instance
    languages.forEach((lang) => {
        // Check if the namespace exists to avoid duplicates
        const hasNamespace = i18nInstance.hasResourceBundle(
            lang,
            'translation',
        );

        if (!hasNamespace) {
            i18nInstance.addResourceBundle(
                lang,
                'translation',
                resources[lang as keyof typeof resources].translation,
                true,
                true,
            );
        } else {
            // Merge with existing translations if namespace exists
            i18nInstance.addResourceBundle(
                lang,
                'translation',
                resources[lang as keyof typeof resources].translation,
                true,
                true,
            );
        }
    });
};
