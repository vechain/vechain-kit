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
    lightTokens?: ThemeTokens,
    darkTokens?: ThemeTokens,
): ThemeConfig => {
    // Use provided light/dark tokens or fall back to current mode tokens
    const lightModeTokens = lightTokens ?? tokens;
    const darkModeTokens = darkTokens ?? tokens;

    return {
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
                // Note: chakra-body-text and chakra-body-bg are intentionally omitted
                // to prevent Chakra UI from applying global body/html styles that would override host apps
                // These are unset globally in VechainKitThemeProvider LayerSetup CSS
                'chakra-border-color': {
                    _dark: darkModeTokens.colors.border.default,
                    _light: lightModeTokens.colors.border.default,
                },
                'chakra-placeholder-color': {
                    _dark: darkModeTokens.colors.text.tertiary,
                    _light: lightModeTokens.colors.text.tertiary,
                },
                // VeChain Kit semantic tokens
                // Main structural background tokens (for component backgrounds)
                // Using mode-specific syntax so Chakra UI updates CSS variables when color mode changes
                'vechain-kit-modal': {
                    _dark: darkModeTokens.colors.background.modal,
                    _light: lightModeTokens.colors.background.modal,
                },
                'vechain-kit-overlay': {
                    _dark: darkModeTokens.colors.background.overlay,
                    _light: lightModeTokens.colors.background.overlay,
                },
                'vechain-kit-card': {
                    _dark: darkModeTokens.colors.background.card,
                    _light: lightModeTokens.colors.background.card,
                },
                'vechain-kit-card-elevated': {
                    _dark: darkModeTokens.colors.background.cardElevated,
                    _light: lightModeTokens.colors.background.cardElevated,
                },
                'vechain-kit-sticky-header': {
                    _dark: darkModeTokens.colors.background.stickyHeader,
                    _light: lightModeTokens.colors.background.stickyHeader,
                },
                'vechain-kit-text-primary': {
                    _dark: darkModeTokens.colors.text.primary,
                    _light: lightModeTokens.colors.text.primary,
                },
                'vechain-kit-text-secondary': {
                    _dark: darkModeTokens.colors.text.secondary,
                    _light: lightModeTokens.colors.text.secondary,
                },
                'vechain-kit-text-tertiary': {
                    _dark: darkModeTokens.colors.text.tertiary,
                    _light: lightModeTokens.colors.text.tertiary,
                },
                'vechain-kit-border': {
                    _dark: darkModeTokens.colors.border.default,
                    _light: lightModeTokens.colors.border.default,
                },
                'vechain-kit-border-hover': {
                    _dark: darkModeTokens.colors.border.hover,
                    _light: lightModeTokens.colors.border.hover,
                },
                'vechain-kit-border-focus': {
                    _dark: darkModeTokens.colors.border.focus,
                    _light: lightModeTokens.colors.border.focus,
                },
                'vechain-kit-success': {
                    _dark: darkModeTokens.colors.success,
                    _light: lightModeTokens.colors.success,
                },
                'vechain-kit-error': {
                    _dark: darkModeTokens.colors.error,
                    _light: lightModeTokens.colors.error,
                },
                'vechain-kit-warning': {
                    _dark: darkModeTokens.colors.warning,
                    _light: lightModeTokens.colors.warning,
                },
            },
            effects: {
                'vechain-kit-backdrop-filter-modal': {
                    _dark: darkModeTokens.effects.backdropFilter.modal,
                    _light: lightModeTokens.effects.backdropFilter.modal,
                },
                'vechain-kit-backdrop-filter-overlay': {
                    _dark: darkModeTokens.effects.backdropFilter.overlay,
                    _light: lightModeTokens.effects.backdropFilter.overlay,
                },
                'vechain-kit-backdrop-filter-sticky-header': {
                    _dark: darkModeTokens.effects.backdropFilter.stickyHeader,
                    _light: lightModeTokens.effects.backdropFilter.stickyHeader,
                },
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
    };
};

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

    // Get tokens for both modes to support mode-specific semantic tokens
    // This ensures CSS variables update correctly when color mode changes
    const lightTokens = getDefaultTokens(false);
    const darkTokens = getDefaultTokens(true);
    const lightCustomTokens = convertThemeConfigToTokens(
        customThemeConfig,
        false,
    );
    const darkCustomTokens = convertThemeConfigToTokens(
        customThemeConfig,
        true,
    );
    const mergedLightTokens = mergeTokens(lightTokens, lightCustomTokens);
    const mergedDarkTokens = mergeTokens(darkTokens, darkCustomTokens);

    // Generate theme config with tokens
    const themeConfig = getThemeConfig(
        darkMode,
        tokens,
        mergedLightTokens,
        mergedDarkTokens,
    );

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
