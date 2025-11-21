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
    // No global styles - fonts will be applied via component-level styles
    // to ensure they only affect VeChain Kit components, not the host app
    styles: {
        global: () => ({}),
    },

    // semantic tokens derived from ThemeTokens
    semanticTokens: {
        colors: {
            'chakra-body-text': tokens.colors.text.primary,
            'chakra-body-bg': tokens.colors.background.modal,
            'chakra-border-color': tokens.colors.border.default,
            'chakra-placeholder-color': tokens.colors.text.tertiary,
            // VeChain Kit semantic tokens
            // Main structural background tokens (for component backgrounds)
            'vechain-kit-modal': tokens.colors.background.modal,
            'vechain-kit-overlay': tokens.colors.background.overlay,
            'vechain-kit-card': darkMode
                ? 'rgba(0, 0, 0, 0.3)'
                : 'rgba(0, 0, 0, 0.05)', // Darker card with transparency
            'vechain-kit-card-elevated': darkMode
                ? 'rgba(0, 0, 0, 0.4)'
                : 'rgba(0, 0, 0, 0.08)', // Darker elevated card with transparency
            'vechain-kit-sticky-header': tokens.colors.background.stickyHeader,
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

    // Don't modify fonts in theme - Chakra creates global CSS variables from fonts.body/heading
    // Custom fonts are applied via scoped CSS in VechainKitThemeProvider instead
    fonts: baseTheme.fonts,
    fontSizes: {
        ...baseTheme.fontSizes,
        // Add theme font sizes as standard Chakra font sizes
        sm: tokens.fonts.sizes.small,
        md: tokens.fonts.sizes.medium,
        lg: tokens.fonts.sizes.large,
    },
    fontWeights: {
        ...baseTheme.fontWeights,
        normal: tokens.fonts.weights.normal,
        medium: tokens.fonts.weights.medium,
        bold: tokens.fonts.weights.bold,
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

    // CRITICAL: Override any global font CSS variables that Chakra might have created
    // and ensure they don't leak to the host app
    const originalGlobalStyles = theme.styles.global;
    theme.styles.global = (props: any) => {
        const originalStyles =
            typeof originalGlobalStyles === 'function'
                ? originalGlobalStyles(props)
                : originalGlobalStyles || {};
        return {
            ...originalStyles,
            // Don't set any global styles - fonts are handled via scoped CSS in VechainKitThemeProvider
        };
    };

    // Override CSS variables to prevent them from being set globally
    // They will be set only within VeChain Kit containers via LayerSetup
    if (theme.__cssVars) {
        theme.__cssVars.global = () => {
            // Don't set any CSS variables globally - they're scoped in LayerSetup
            return {};
        };
    }

    return theme;
};
