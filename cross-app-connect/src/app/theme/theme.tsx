import { extendTheme } from '@chakra-ui/react';
import { cardTheme } from './card';
import { ButtonStyle } from './button';
import { modalTheme } from './modal';
import { themeColors } from './colors';

const exampleTheme = {
    components: {
        Card: cardTheme,
        Button: ButtonStyle,
        Modal: modalTheme,
    },

    semanticTokens: {
        colors: {
            'chakra-body-text': {
                _dark: '#7F7FAC', // Added dark mode text color
                _light: '#1A202C',
            },
            'chakra-body-bg': {
                _dark: '#1A202C', // Added dark mode background color
                _light: '#FFFFFF',
            },
        },
    },
    borderRadius: {
        card: '16px',
        button: '24px',
    },
    shadows: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    },
    //@ts-ignore
    fonts: {
        heading: `"Instrument Sans Variable", sans-serif`,
        body: `"Inter Variable", sans-serif`,
    },
};

export const darkTheme = extendTheme({
    ...exampleTheme,
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
        cssVarPrefix: 'example',
    },

    colors: themeColors,
});
