import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import { getModalTheme } from './modal';
import { getCardTheme } from './card';
import { buttonTheme } from './button';
import { getPopoverTheme } from './popover';

const getThemeConfig = (darkMode: boolean): ThemeConfig => ({
    useSystemColorMode: false,
    disableTransitionOnChange: false,

    // @ts-ignore
    components: {
        Modal: getModalTheme(darkMode),
        Card: getCardTheme(darkMode),
        Button: buttonTheme,
        Popover: getPopoverTheme(darkMode),
    },
    cssVarPrefix: 'vechainKit',
});

export const getVechainKitTheme = (darkMode: boolean) =>
    extendTheme(getThemeConfig(darkMode));
