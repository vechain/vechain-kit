import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const getPopoverVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        popper: {
            zIndex: 1000,
        },
        content: {
            borderRadius: tokens.borders.radius.xl,
            border: 'none',
            backgroundColor: tokens.colors.background.modal,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            minWidth: '380px',
        },
        body: {
            padding: '16px',
        },
    }),
});

export const getPopoverTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getPopoverVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
