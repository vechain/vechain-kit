import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import {
    StyleFunctionProps,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const variants = {
    vechainKitBase: (props: StyleFunctionProps) =>
        definePartsStyle({
            body: {
                borderRadius: '12px',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
                border:
                    props.colorMode === 'dark'
                        ? '1px solid #2d2d2d'
                        : '1px solid #eaeaea',
                p: 5,
            },
            footer: {
                p: 5,
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
