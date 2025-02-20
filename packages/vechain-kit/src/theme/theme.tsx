import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import { modalTheme } from './modal';
import { cardTheme } from './card';
import { buttonTheme } from './button';
import { popoverTheme } from './popover';

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
    cssVarPrefix: 'vechainKit',
};
export const VechainKitTheme = extendTheme(themeConfig);
