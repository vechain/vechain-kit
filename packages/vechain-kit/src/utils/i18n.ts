import { resources } from '../../i18n';

export const initializeI18n = (i18nInstance: any) => {
    const languages = Object.keys(resources);

    languages.forEach((lang) => {
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
