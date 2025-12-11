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
    // Feature section variants with colored backgrounds
    featurePurple: () =>
        definePartsStyle({
            container: {
                bg: '#F5F3FF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureBlue: () =>
        definePartsStyle({
            container: {
                bg: '#EFF6FF',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureBeige: () =>
        definePartsStyle({
            container: {
                bg: '#FEF9F3',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureGreen: () =>
        definePartsStyle({
            container: {
                bg: '#F0FDF4',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureGrey: () =>
        definePartsStyle({
            container: {
                bg: '#F9FAFB',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    featureDark: () =>
        definePartsStyle({
            container: {
                bg: '#1A1A1A',
                borderWidth: '0px',
                borderColor: 'transparent',
            },
        }),
    // Full-width section variant
    section: () =>
        definePartsStyle({
            container: {
                bg: 'transparent',
                borderWidth: '0px',
                borderColor: 'transparent',
                borderRadius: '0px',
                boxShadow: 'none',
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
