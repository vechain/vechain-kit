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

    borderRadius: {
        card: '16px',
        button: '24px',
    },
    shadows: {
        card: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    },
    //@ts-ignore
    fonts: {
        heading: `"Satoshi", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        body: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
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
