import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import {
    StyleFunctionProps,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

const variants = {
    vechainKitBase: (props: StyleFunctionProps) =>
        definePartsStyle({
            popper: {
                zIndex: 999,
            },
            content: {
                borderRadius: '24px',
                border: 'none',
                backgroundColor:
                    props.colorMode === 'dark' ? '#1f1f1e' : 'white',
                boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
                minWidth: '380px',
            },
            body: {
                padding: '16px',
            },
        }),
};

export const popoverTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'vechainKitBase',
    },
});
