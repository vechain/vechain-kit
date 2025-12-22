import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

const getCardVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        container: {
            backgroundColor: tokens.colors.background.card,
            borderRadius: tokens.borders.radius.medium,
            width: 'full',
            border: 'none',
        },
        body: {
            p: 5,
            width: 'full',
        },
        header: {
            p: 5,
            width: 'full',
            borderRadius: `${tokens.borders.radius.medium} ${tokens.borders.radius.medium} 0 0`,
        },
        footer: {
            width: 'full',
            borderRadius: `0 0 ${tokens.borders.radius.medium} ${tokens.borders.radius.medium}`,
        },
    }),

    vechainKitWalletCard: definePartsStyle({
        container: {
            backgroundColor: tokens.colors.background.card,
            borderRadius: tokens.borders.radius.medium,
            width: 'full',
            cursor: 'pointer',
            position: 'relative',
        },
    }),

    featureAnnouncement: definePartsStyle({
        body: {
            backgroundColor: tokens.buttons.button.bg,
            borderRadius: tokens.borders.radius.medium,
            color: tokens.colors.text.secondary,
        },
        container: {
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: 'transparent',
        },
    }),

    vechainKitAppCard: definePartsStyle({
        body: {
            height: 'full',
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: tokens.colors.background.cardElevated,
            border: `1px solid ${tokens.colors.border.default}`,
        },
        container: {
            height: '150px',
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: 'transparent',
        },
    }),
});

export const getCardTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getCardVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase', // default is solid
        },
    });
