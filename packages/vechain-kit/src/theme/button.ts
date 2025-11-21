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
        borderRadius: tokens.borders.radius.large,
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
        _dark: {
            color: '#1a1a1a',
            bg: 'white',
        },
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
        _dark: {
            _hover: {
                _disabled: {
                    bg: 'white', // Ensure background stays in dark mode
                },
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: '#1a1a1a', // Explicitly set background
        },
        _dark: {
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
        borderRadius: tokens.borders.radius.large,
        bg: tokens.buttons.primaryButton.bg,
        color: tokens.buttons.primaryButton.color,
        border: tokens.buttons.primaryButton.border,
        _hover: {
            opacity: 0.8,
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
        borderRadius: tokens.borders.radius.large,
        bg: tokens.colors.secondary.base,
        color: tokens.colors.text.primary,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        _hover: {
            bg: tokens.colors.secondary.hover,
            _disabled: {
                bg: tokens.colors.secondary.base, // Override hover bg when disabled
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.colors.secondary.base, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitTertiary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.large,
        bg: tokens.colors.tertiary.base,
        _hover: {
            bg: tokens.colors.tertiary.hover,
            _disabled: {
                bg: tokens.colors.tertiary.base, // Override hover bg when disabled
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.colors.tertiary.base, // Explicitly set background
        },
        border: 'none',
        color: tokens.colors.text.primary,
        transition: 'all 0.2s',
    })),
    vechainKitLogout: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        bg: tokens.colors.error + '1f',
        _hover: {
            bg: tokens.colors.error + '5e',
            color: tokens.colors.error,
        },
        transition: 'all 0.2s',
        color: tokens.colors.error,
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        bg: tokens.colors.secondary.base,
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        color: tokens.colors.text.primary,
        border: `1px solid ${tokens.colors.border.button}`,
        _hover: {
            bg: tokens.colors.secondary.hover,
            _disabled: {
                bg: tokens.colors.secondary.base, // Override hover bg when disabled
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.colors.secondary.base, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    ghost: defineStyle(() => ({
        bg: 'transparent',
        color: tokens.colors.text.primary,
        border: 'none',
        _hover: {
            bg: tokens.colors.secondary.base,
        },
        _active: {
            bg: tokens.colors.secondary.active,
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
