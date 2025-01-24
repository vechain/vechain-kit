import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys);

// define custom styles for funky variant
const variants = {
    base: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    filled: () =>
        definePartsStyle({
            container: {
                bg: '#FAFAFA',
            },
        }),
    baseWithBorder: () =>
        definePartsStyle({
            container: {
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    secondaryBoxShadow: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
                bg: '#FFF',
                borderWidth: '1px',
                borderColor: 'gray.100',
            },
        }),
    articles: () =>
        definePartsStyle({
            container: {
                boxShadow: '0px 0px 1px 1px #00000017',
            },
        }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base', // default is solid
    },
});
