import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonStyle: ComponentStyleConfig = {
    // style object for base or default style
    baseStyle: {},
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
        primarySubtle: {
            bg: 'rgba(224, 233, 254, 1)',
            color: 'primary.500',
            _hover: {
                bg: 'rgba(224, 233, 254, 0.8)',
            },
        },
        testVariant: {
            bg: 'primary.300',
            color: 'white',
        },
        homepagePrimary: {
            columnGap: '.825rem',
            rowGap: '.825rem',
            bg: '#000',
            color: '#fff',
            borderRadius: '9999px',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            _hover: {
                bg: '#000',
                textDecoration: 'none',
            },
        },
        homepageSecondary: {
            columnGap: '8px',
            rowGap: '8px',
            bg: '#fff',
            border: '1px solid #000',
            borderRadius: '9999px',
            justifyContent: 'center',
            alignItems: 'center',
            px: '12px',
            py: '6px',
            display: 'flex',
            position: 'relative',
            _hover: {
                textDecoration: 'none',
            },
        },
    },
    // default values for 'size', 'variant' and 'colorScheme'
    defaultProps: {
        size: 'md',
        rounded: 'full',
        variant: 'solid',
    },
};
