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
            },
        }),

    featureAnnouncement: (props: StyleFunctionProps) =>
        definePartsStyle({
            body: {
                backgroundColor:
                    props.colorMode === 'dark'
                        ? 'whiteAlpha.100'
                        : 'blackAlpha.50',
                borderRadius: '12px',
                border:
                    props.colorMode === 'dark'
                        ? '1px solid #2d2d2d'
                        : '1px solid #eaeaea',
                color:
                    props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
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
