import { alertAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(alertAnatomy.keys);

const baseStyle = definePartsStyle({
    container: {
        // Base container styles
    },
    title: {
        // Title styles
    },
    description: {
        lineHeight: 1.5, // Adjust line height for better readability
        display: 'block', // Ensure description takes full width
    },
    icon: {
        // Icon styles
    },
});

export const alertTheme = defineMultiStyleConfig({
    baseStyle,
});
