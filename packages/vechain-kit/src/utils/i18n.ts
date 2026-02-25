import { loadLanguage, supportedLanguages } from '../../i18n';

export const initializeI18n = async (i18nInstance: any) => {
    const currentLang = i18nInstance.language;

    if (currentLang && currentLang !== 'en' && supportedLanguages.includes(currentLang)) {
        await loadLanguage(currentLang);
    }
};
