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
};

export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'vechainKitBase', // default is solid
    },
});
