import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

const getCardVariants = (darkMode: boolean) => ({
    vechainKitBase: definePartsStyle({
        container: {
            backgroundColor: darkMode ? '#1c1c1b' : '#f5f5f5',
            borderRadius: '14px',
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
            borderRadius: '14px 14px 0 0',
        },
        footer: {
            width: 'full',
            borderRadius: '0 0 14px 14px',
        },
    }),

    featureAnnouncement: definePartsStyle({
        body: {
            backgroundColor: darkMode ? '#ffffff0a' : 'blackAlpha.50',
            borderRadius: '12px',
            color: darkMode ? '#ffffff12' : 'blackAlpha.200',
        },
        container: {
            borderRadius: '12px',
            backgroundColor: 'transparent',
        },
    }),

    vechainKitAppCard: definePartsStyle({
        body: {
            height: 'full',
            borderRadius: '12px',
            backgroundColor: darkMode ? '#1f1f1e' : 'white',
            border: darkMode ? '1px solid #2d2d2d' : '1px solid #eaeaea',
        },
        container: {
            height: '150px',
            borderRadius: '12px',
            backgroundColor: 'transparent',
        },
    }),
});

export const getCardTheme = (darkMode: boolean) =>
    defineMultiStyleConfig({
        variants: getCardVariants(darkMode),
        defaultProps: {
            variant: 'vechainKitBase', // default is solid
        },
    });
