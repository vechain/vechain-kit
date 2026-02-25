import { loadLanguage, supportedLanguages } from '../../i18n';

export const initializeI18n = async (i18nInstance: any) => {
    const currentLang: string | undefined = i18nInstance.language;
    if (!currentLang || currentLang === 'en') return;

    const resolved = supportedLanguages.includes(currentLang)
        ? currentLang
        : supportedLanguages.includes(currentLang.split('-')[0])
            ? currentLang.split('-')[0]
            : null;

    if (resolved) {
        await loadLanguage(resolved);
    }
};
