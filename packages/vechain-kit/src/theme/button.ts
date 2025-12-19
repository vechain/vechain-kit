import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const getVariants = (tokens: ThemeTokens) => ({
    // Login variants - maintained for backward compatibility
    // These should eventually be replaced with vechainKitTertiary and vechainKitPrimary
    loginIn: defineStyle(() => ({
        bg: tokens.buttons.loginButton.bg,
        color: tokens.buttons.loginButton.color,
        border: tokens.buttons.loginButton.border,
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        py: 6,
        px: 3,
        rounded:
            tokens.buttons.loginButton.rounded ?? tokens.borders.radius.large,
        backdropFilter: tokens.buttons.loginButton.backdropFilter,
        _hover: {
            opacity: 0.5,
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.loginButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.loginButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    loginWithVechain: defineStyle(() => ({
        color: 'white', // Note: Different from vechainKitPrimary which uses 'white'
        bg: '#1a1a1a',
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        py: 6,
        px: 3,
        borderRadius: tokens.borders.radius.large,
        border: `1px solid ${tokens.colors.border.button}`,
        _hover: {
            opacity: 0.5,
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: '#1a1a1a', // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: '#1a1a1a', // Explicitly set background
        },
        _dark: {
            color: '#1a1a1a',
            bg: 'white',
            _hover: {
                _disabled: {
                    bg: 'white', // Ensure background stays in dark mode
                },
            },
            _disabled: {
                bg: 'white', // Explicitly set background in dark mode
            },
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded:
            tokens.buttons.primaryButton.rounded ?? tokens.borders.radius.large,
        bg: tokens.buttons.primaryButton.bg,
        color: tokens.buttons.primaryButton.color,
        border: tokens.buttons.primaryButton.border,
        backdropFilter: tokens.buttons.primaryButton.backdropFilter,
        _hover: {
            ...(tokens.buttons.primaryButton.hoverBg
                ? { bg: tokens.buttons.primaryButton.hoverBg }
                : { opacity: 0.8 }),
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.primaryButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.primaryButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitSecondary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded: tokens.buttons.button.rounded ?? tokens.borders.radius.large,
        bg: tokens.buttons.button.bg,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            ...(tokens.buttons.button.hoverBg
                ? { bg: tokens.buttons.button.hoverBg }
                : { opacity: 0.8 }), // Derive hover from bg with opacity if hoverBg not provided
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitTertiary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded:
            tokens.buttons.tertiaryButton.rounded ??
            tokens.borders.radius.large,
        bg: tokens.buttons.tertiaryButton.bg,
        color: tokens.buttons.tertiaryButton.color,
        border:
            tokens.buttons.tertiaryButton.border === 'none'
                ? 'none'
                : tokens.buttons.tertiaryButton.border,
        backdropFilter: tokens.buttons.tertiaryButton.backdropFilter,
        _hover: {
            opacity: 0.8, // Derive hover from bg with opacity
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.tertiaryButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.tertiaryButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitLogout: defineStyle(() => ({
        px: 4,
        width: 'full',
        height: '60px',
        rounded: tokens.buttons.button.rounded ?? tokens.borders.radius.large,
        bg: tokens.colors.error + '1f',
        color: tokens.colors.error,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            opacity: 0.8,
            _disabled: {
                opacity: 0.5,
                bg: tokens.colors.error + '1f',
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
        transition: 'all 0.2s',
    })),
    vechainKitHeaderIconButtons: defineStyle(() => ({
        bg: tokens.buttons.button.bg,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            ...(tokens.buttons.button.hoverBg
                ? { bg: tokens.buttons.button.hoverBg }
                : { opacity: 0.8 }), // Derive hover from bg with opacity if hoverBg not provided
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
        rounded: 'full',
        mt: '8px',
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        bg: tokens.buttons.button.bg,
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? `1px solid ${tokens.colors.border.button}`
                : tokens.buttons.button.border,
        _hover: {
            opacity: 0.8, // Derive hover from bg with opacity
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    ghost: defineStyle(() => ({
        bg: 'transparent',
        color: tokens.colors.text.primary,
        border: 'none',
        _hover: {
            bg: tokens.buttons.button.bg,
        },
        _active: {
            bg: tokens.buttons.button.bg,
            opacity: 0.8, // Use opacity for active state
        },
        transition: 'all 0.2s',
    })),
    link: defineStyle(() => ({
        color: tokens.colors.text.primary,
        _hover: {
            color: tokens.colors.text.secondary,
            textDecoration: 'underline',
        },
        _active: {
            color: tokens.colors.text.primary,
        },
        transition: 'all 0.2s',
    })),
});

export const getButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
    });

export const getIconButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
    });

export const getCloseButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
        defaultProps: {
            variant: 'vechainKitHeaderIconButtons',
        },
    });
