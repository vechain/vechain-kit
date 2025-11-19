import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const getVariants = (tokens: ThemeTokens) => ({
    loginIn: defineStyle(() => ({
        bg: tokens.colors.tertiary.base,
        color: tokens.colors.text.primary,
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        border: `1px solid ${tokens.colors.border.default}`,
        py: 6,
        px: 3,
        borderRadius: tokens.borders.radius.large,
        _hover: {
            bg: tokens.colors.tertiary.hover,
        },
    })),
    loginWithVechain: defineStyle(() => ({
        bg: tokens.colors.primary.base,
        color: tokens.colors.text.primary,
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        py: 6,
        px: 3,
        borderRadius: tokens.borders.radius.large,
        border: `1px solid ${tokens.colors.border.default}`,
        _hover: {
            bg: tokens.colors.primary.hover,
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.xl,
        bg: tokens.colors.primary.base,
        color: 'white',
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
        borderRadius: tokens.borders.radius.xl,
        backgroundColor: tokens.colors.secondary.base,
        _hover: {
            backgroundColor: tokens.colors.secondary.hover,
        },
        border: '1px solid',
        borderColor: tokens.colors.border.default,
        color: tokens.colors.text.primary,
        transition: 'all 0.2s',
    })),
    vechainKitTertiary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: tokens.borders.radius.xl,
        backgroundColor: tokens.colors.tertiary.base,
        _hover: {
            backgroundColor: tokens.colors.tertiary.hover,
        },
        border: '1px solid',
        borderColor: tokens.colors.border.default,
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
    mainContentButton: defineStyle(() => ({
        width: '100%',
        backgroundColor: tokens.colors.secondary.base,
        borderRadius: tokens.borders.radius.xl,
        p: 3,
        cursor: 'pointer',
        _hover: {
            backgroundColor: tokens.colors.secondary.hover,
        },
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        backgroundColor: tokens.colors.secondary.base,
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        _hover: {
            backgroundColor: tokens.colors.secondary.hover,
        },
        transition: 'all 0.2s',
    })),
});

export const getButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
    });
