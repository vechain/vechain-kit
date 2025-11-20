import { ThemeConfig, extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { getModalTheme } from './modal';
import { getCardTheme } from './card';
import { getButtonTheme } from './button';
import { getPopoverTheme } from './popover';
import {
    VechainKitThemeConfig,
    ThemeTokens,
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from './tokens';

// minimal theme that completely disables global styles
const getThemeConfig = (
    darkMode: boolean,
    tokens: ThemeTokens,
): ThemeConfig => ({
    useSystemColorMode: false,
    disableTransitionOnChange: false,

    // @ts-ignore
    components: {
        Modal: getModalTheme(tokens),
        Card: getCardTheme(tokens),
        Button: getButtonTheme(tokens),
        Popover: getPopoverTheme(tokens),
    },
    // COMPLETELY disable global styles to prevent any conflicts
    styles: {
        global: () => ({}), // empty object = no global styles injected
    },

    // semantic tokens derived from ThemeTokens
    semanticTokens: {
        colors: {
            'chakra-body-text': tokens.colors.text.primary,
            'chakra-body-bg': tokens.colors.background.modal,
            'chakra-border-color': tokens.colors.border.default,
            'chakra-placeholder-color': tokens.colors.text.tertiary,
            // VeChain Kit semantic tokens
            'vechain-kit-modal': tokens.colors.background.modal,
            'vechain-kit-overlay': darkMode
                ? 'rgba(0, 0, 0, 0.6)'
                : 'rgba(0, 0, 0, 0.4)', // Darker overlay with transparency
            'vechain-kit-card': darkMode
                ? 'rgba(0, 0, 0, 0.3)'
                : 'rgba(0, 0, 0, 0.05)', // Darker card with transparency
            'vechain-kit-card-elevated': darkMode
                ? 'rgba(0, 0, 0, 0.4)'
                : 'rgba(0, 0, 0, 0.08)', // Darker elevated card with transparency
            'vechain-kit-sticky-header': tokens.colors.background.stickyHeader,
            'vechain-kit-primary': tokens.colors.primary.base,
            'vechain-kit-primary-hover': tokens.colors.primary.hover,
            'vechain-kit-primary-active': tokens.colors.primary.active,
            'vechain-kit-secondary': tokens.colors.secondary.base,
            'vechain-kit-secondary-hover': tokens.colors.secondary.hover,
            'vechain-kit-tertiary': tokens.colors.tertiary.base,
            'vechain-kit-text-primary': tokens.colors.text.primary,
            'vechain-kit-text-secondary': tokens.colors.text.secondary,
            'vechain-kit-text-tertiary': tokens.colors.text.tertiary,
            'vechain-kit-border': tokens.colors.border.default,
            'vechain-kit-border-hover': tokens.colors.border.hover,
            'vechain-kit-border-focus': tokens.colors.border.focus,
            'vechain-kit-success': tokens.colors.success,
            'vechain-kit-error': tokens.colors.error,
            'vechain-kit-warning': tokens.colors.warning,
        },
        effects: {
            'vechain-kit-backdrop-filter-modal':
                tokens.effects.backdropFilter.modal,
            'vechain-kit-backdrop-filter-overlay':
                tokens.effects.backdropFilter.overlay,
            'vechain-kit-backdrop-filter-sticky-header':
                tokens.effects.backdropFilter.stickyHeader,
        },

        config: {
            cssVarPrefix: 'vechain-kit', // consistent naming across all components
        },
    },

    // minimal foundations to prevent global style injection
    fonts: {
        ...baseTheme.fonts,
        body: tokens.fonts.family,
        heading: tokens.fonts.family,
    },
    colors: baseTheme.colors,
    space: baseTheme.space,
});

export const getVechainKitTheme = (
    darkMode: boolean,
    customThemeConfig?: VechainKitThemeConfig,
): ReturnType<typeof extendTheme> => {
    // Get default tokens for the mode
    const defaultTokens = getDefaultTokens(darkMode);

    // Convert custom config to partial tokens
    const customTokens = convertThemeConfigToTokens(
        customThemeConfig,
        darkMode,
    );

    // Merge custom tokens with defaults
    const tokens = mergeTokens(defaultTokens, customTokens);

    // Generate theme config with tokens
    const themeConfig = getThemeConfig(darkMode, tokens);

    const theme = extendTheme(themeConfig);

    // CRITICAL: Force override of global styles after theme creation
    theme.styles.global = () => ({});

    // also override any other global style fns that might exist
    if (theme.__cssVars) {
        theme.__cssVars.global = () => ({});
    }

    return theme;
};
