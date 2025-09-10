import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const getModalVariants = (darkMode: boolean) => ({
    vechainKitBase: definePartsStyle({
        dialog: {
            scrollbarWidth: 'none',
            overflow: 'scroll',
            overflowX: 'hidden',
            maxHeight: '550px',
            borderRadius: '24px',
            backgroundColor: darkMode ? '#1f1f1e' : 'white',
        },
        closeButton: {
            borderRadius: '50%',
        },
        header: {
            w: 'full',
            color: darkMode ? '#dfdfdd' : '#2e2e2e',
            fontSize: 'md',
            fontWeight: '700',
            textAlign: 'center',
        },
    }),
});

export const getModalTheme = (darkMode: boolean) =>
    defineMultiStyleConfig({
        variants: getModalVariants(darkMode),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
