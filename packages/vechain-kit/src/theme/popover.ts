import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const getPopoverVariants = (darkMode: boolean) => ({
    vechainKitBase: definePartsStyle({
        popper: {
            zIndex: 1000,
        },
        content: {
            borderRadius: '24px',
            border: 'none',
            backgroundColor: darkMode ? '#1f1f1e' : 'white',
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            minWidth: '380px',
        },
        body: {
            padding: '16px',
        },
    }),
});

export const getPopoverTheme = (darkMode: boolean) =>
    defineMultiStyleConfig({
        variants: getPopoverVariants(darkMode),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
