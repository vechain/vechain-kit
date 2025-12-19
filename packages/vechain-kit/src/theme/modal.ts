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
            rounded: tokens.modal.rounded ?? tokens.borders.radius.modal,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            border: tokens.colors.border.modal,
            borderBottomColor: ['transparent', 'inherit'],
        },
        overlay: {
            backgroundColor: tokens.colors.background.overlay,
            backdropFilter: tokens.effects.backdropFilter.overlay,
        },
        closeButton: {
            borderRadius: tokens.borders.radius.full,
            color: tokens.colors.text.primary,
            _hover: {
                ...(tokens.buttons.button.hoverBg
                    ? { bg: tokens.buttons.button.hoverBg }
                    : { opacity: 0.8 }),
            },
            _active: {
                bg: tokens.buttons.button.bg,
                opacity: 0.8,
            },
        },
        header: {
            w: 'full',
            color: tokens.colors.text.primary,
            fontSize: tokens.fonts.sizes.large,
            fontWeight: tokens.fonts.weights.bold,
            textAlign: 'center',
            paddingBottom: 5,
            paddingTop: 5,
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
