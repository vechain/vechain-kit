import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const getModalVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        dialog: {
            scrollbarWidth: 'none',
            overflow: 'scroll',
            overflowX: 'hidden',
            maxHeight: '550px',
            borderRadius: tokens.borders.radius.xl,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            border:
                tokens.colors.border.modal === 'none'
                    ? 'none'
                    : tokens.colors.border.modal,
        },
        overlay: {
            backgroundColor: tokens.colors.background.overlay,
            backdropFilter: tokens.effects.backdropFilter.overlay,
        },
        closeButton: {
            borderRadius: tokens.borders.radius.full,
            color: tokens.colors.text.primary,
            _hover: {
                bg: tokens.buttons.button.bg,
            },
            _active: {
                bg: tokens.buttons.button.bg,
                opacity: 0.8,
            },
        },
        header: {
            w: 'full',
            color: tokens.colors.text.primary,
            fontSize: tokens.fonts.sizes.medium,
            fontWeight: tokens.fonts.weights.bold,
            textAlign: 'center',
        },
    }),
});

export const getModalTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getModalVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
