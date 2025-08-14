import { ThemeConfig, extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { modalTheme } from './modal';
import { cardTheme } from './card';
import { buttonTheme } from './button';
import { popoverTheme } from './popover';

// minimal theme that completely disables global styles
const themeConfig: ThemeConfig = {
    useSystemColorMode: false,
    disableTransitionOnChange: false,

    // @ts-ignore
    components: {
        Modal: modalTheme,
        Card: cardTheme,
        Button: buttonTheme,
        Popover: popoverTheme,
    },
    config: {
        cssVarPrefix: 'vechain-kit', // consistent naming across all components
    },

    // COMPLETELY disable global styles to prevent any conflicts
    styles: {
        global: () => ({}), // empty object = no global styles injected
    },

    // minimal foundations to prevent global style injection
    fonts: baseTheme.fonts,
    colors: baseTheme.colors,
    space: baseTheme.space,
};

export const VechainKitTheme = extendTheme(themeConfig);

// CRITICAL: Force override of global styles after theme creation
VechainKitTheme.styles.global = () => ({});

// also override any other global style fns that might exist
if (VechainKitTheme.__cssVars) {
    VechainKitTheme.__cssVars.global = () => ({});
}
