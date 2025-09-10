import { ThemeConfig, extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { getModalTheme } from './modal';
import { getCardTheme } from './card';
import { getButtonTheme } from './button';
import { getPopoverTheme } from './popover';

// minimal theme that completely disables global styles
const getThemeConfig = (darkMode: boolean): ThemeConfig => ({
    useSystemColorMode: false,
    disableTransitionOnChange: false,

    // @ts-ignore
    components: {
        Modal: getModalTheme(darkMode),
        Card: getCardTheme(darkMode),
        Button: getButtonTheme(darkMode),
        Popover: getPopoverTheme(darkMode),
    },
    // COMPLETELY disable global styles to prevent any conflicts
    styles: {
        global: () => ({}), // empty object = no global styles injected
    },

    // only defining the semantic tokens we need, scoped to our components
    semanticTokens: {
        colors: {
            'chakra-body-text': darkMode ? '#F7FAFC' : '#1A202C',
            'chakra-body-bg': darkMode ? '#1A202C' : '#FFFFFF',
            'chakra-border-color': darkMode ? '#2D3748' : '#E2E8F0',
            'chakra-placeholder-color': darkMode ? '#718096' : '#A0AEC0',
        },

        config: {
            cssVarPrefix: 'vechain-kit', // consistent naming across all components
        },
    },

    // minimal foundations to prevent global style injection
    fonts: baseTheme.fonts,
    colors: baseTheme.colors,
    space: baseTheme.space,
});

export const getVechainKitTheme = (darkMode: boolean) => {
    const theme = extendTheme(getThemeConfig(darkMode));

    // CRITICAL: Force override of global styles after theme creation
    theme.styles.global = () => ({});

    // also override any other global style fns that might exist
    if (theme.__cssVars) {
        theme.__cssVars.global = () => ({});
    }

    return theme;
};
