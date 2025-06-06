import { cardAnatomy } from '@chakra-ui/anatomy';
import {
    StyleFunctionProps,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
    vechainKitBase: (props: StyleFunctionProps) =>
        definePartsStyle({
            container: {
                backgroundColor:
                    props.colorMode === 'dark' ? '#1c1c1b' : '#f5f5f5',
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

    featureAnnouncement: (props: StyleFunctionProps) =>
        definePartsStyle({
            body: {
                backgroundColor:
                    props.colorMode === 'dark' ? '#ffffff0a' : 'blackAlpha.50',
                borderRadius: '12px',
                color:
                    props.colorMode === 'dark' ? '#ffffff12' : 'blackAlpha.200',
            },
            container: {
                borderRadius: '12px',
                backgroundColor: 'transparent',
            },
        }),

    newsCard: (props: StyleFunctionProps) =>
        definePartsStyle({
            container: {
                backgroundColor:
                    props.colorMode === 'dark' ? '#ffffff0a' : 'blackAlpha.50',
                borderRadius: '12px',
                boxShadow: 'none',
                _hover: {
                    backgroundColor:
                        props.colorMode === 'dark'
                            ? '#ffffff12'
                            : 'blackAlpha.200',
                },
                transition: 'all 0.2s',
            },
            body: {
                p: 4,
            },
        }),

    vechainKitAppCard: (props: StyleFunctionProps) =>
        definePartsStyle({
            body: {
                height: 'full',
                borderRadius: '12px',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
                border:
                    props.colorMode === 'dark'
                        ? '1px solid #2d2d2d'
                        : '1px solid #eaeaea',
            },
            container: {
                height: '150px',
                borderRadius: '12px',
                backgroundColor: 'transparent',
            },
        }),
};

export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'vechainKitBase', // default is solid
    },
});
