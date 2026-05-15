import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(['modal']);

// define custom styles for funky variant
const variants = {
    base: definePartsStyle({}),
};

// export variants in the component theme
export const modalTheme = defineMultiStyleConfig({
    variants,
    defaultProps: {
        variant: 'base',
    },
});
