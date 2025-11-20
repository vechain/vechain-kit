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
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.large,
        bg: tokens.colors.primary.base,
        color: 'white',
        border: 'none',
        _hover: {
            bg: tokens.colors.primary.hover,
            _disabled: {
                bg: tokens.colors.primary.disabled,
            },
        },
        transition: 'all 0.2s',
    })),
    vechainKitSecondary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.large,
        backgroundColor: tokens.colors.secondary.base,
        color: tokens.colors.text.primary,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        _hover: {
            backgroundColor: tokens.colors.secondary.hover,
        },
        transition: 'all 0.2s',
    })),
    vechainKitTertiary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.large,
        backgroundColor: tokens.colors.tertiary.base,
        _hover: {
            backgroundColor: tokens.colors.tertiary.hover,
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
        backgroundColor: tokens.colors.error + '1f',
        _hover: {
            backgroundColor: tokens.colors.error + '5e',
            color: tokens.colors.error,
        },
        transition: 'all 0.2s',
        color: tokens.colors.error,
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        backgroundColor: tokens.colors.secondary.base,
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        color: tokens.colors.text.primary,
        border: `1px solid ${tokens.colors.border.button}`,
        _hover: {
            backgroundColor: tokens.colors.secondary.hover,
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
