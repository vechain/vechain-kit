import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { tokens } from './brand';

// Force light mode for now. To re-enable system / dark, switch
// initialColorMode back to 'system' and useSystemColorMode to true.
const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
    cssVarPrefix: 'vc',
};

export const vechainTheme = extendTheme({
    config,
    fonts: {
        heading: tokens.fontHeading,
        body: tokens.fontBody,
    },
    semanticTokens: {
        colors: {
            'page-bg': {
                _light: tokens.light.modalBg,
                _dark: tokens.dark.modalBg,
            },
            'card-bg': {
                _light: tokens.light.cardBg,
                _dark: tokens.dark.cardBg,
            },
            'card-elevated-bg': {
                _light: tokens.light.cardElevatedBg,
                _dark: tokens.dark.cardElevatedBg,
            },
            'card-border': {
                _light: 'transparent',
                _dark: tokens.dark.borderDefault,
            },
            'text-strong': {
                _light: tokens.light.textPrimary,
                _dark: tokens.dark.textPrimary,
            },
            'text-muted': {
                _light: tokens.light.textSecondary,
                _dark: tokens.dark.textSecondary,
            },
            'text-subtle': {
                _light: tokens.light.textTertiary,
                _dark: tokens.dark.textTertiary,
            },
            'login-btn-bg': {
                _light: tokens.light.loginBtnBg,
                _dark: tokens.dark.loginBtnBg,
            },
            'login-btn-color': {
                _light: tokens.light.loginBtnColor,
                _dark: tokens.dark.loginBtnColor,
            },
            'login-btn-border': {
                _light: tokens.light.borderButton,
                _dark: tokens.dark.borderButton,
            },
            'login-btn-hover-bg': {
                _light: tokens.light.loginBtnHoverBg,
                _dark: tokens.dark.loginBtnHoverBg,
            },
            'primary-btn-bg': {
                _light: tokens.light.primaryBtnBg,
                _dark: tokens.dark.primaryBtnBg,
            },
            'primary-btn-color': {
                _light: tokens.light.primaryBtnColor,
                _dark: tokens.dark.primaryBtnColor,
            },
            'chip-bg': { _light: tokens.light.chipBg, _dark: tokens.dark.chipBg },
            'chip-text': {
                _light: tokens.light.chipText,
                _dark: tokens.dark.chipText,
            },
            accent: { _light: tokens.light.accent, _dark: tokens.dark.accent },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontFamily: tokens.fontBody,
                fontWeight: 500,
                letterSpacing: '-0.005em',
            },
            variants: {
                // Primary CTA: kit's vechainKitPrimary look -- pill shape,
                // 60px tall, monochrome (dark on light bg / white on dark).
                brand: {
                    bg: 'primary-btn-bg',
                    color: 'primary-btn-color',
                    rounded: tokens.radius.full,
                    h: '60px',
                    px: 4,
                    fontWeight: 500,
                    _hover: { opacity: 0.8 },
                    _disabled: { opacity: 0.5, cursor: 'not-allowed' },
                    transition: 'all 0.2s',
                },
                // Provider row: kit's loginIn look -- 52px tall, large radius,
                // subtle border, label left-aligned.
                row: {
                    bg: 'login-btn-bg',
                    color: 'login-btn-color',
                    border: '1px solid',
                    borderColor: 'login-btn-border',
                    rounded: tokens.radius.lg,
                    h: '52px',
                    px: '18px',
                    w: 'full',
                    justifyContent: 'flex-start',
                    fontWeight: 600,
                    fontSize: '15px',
                    _hover: {
                        bg: 'login-btn-hover-bg',
                        borderColor: 'login-btn-border',
                    },
                    _active: { transform: 'scale(0.99)' },
                    transition: 'all 0.2s',
                },
                // Ghost: pill-shaped outlined button so it reads as a real
                // action at rest, not stray text. Border matches the login
                // row border so they nest visually.
                ghost: {
                    bg: 'transparent',
                    color: 'text-muted',
                    border: '1px solid',
                    borderColor: 'login-btn-border',
                    rounded: tokens.radius.full,
                    h: '48px',
                    px: 6,
                    _hover: {
                        bg: 'login-btn-hover-bg',
                        color: 'text-strong',
                    },
                    _active: { bg: 'login-btn-hover-bg' },
                    _disabled: { opacity: 0.4 },
                    transition: 'all 0.2s',
                },
                // Subtle text link, used for "show more" type affordances.
                link: {
                    bg: 'transparent',
                    color: 'text-muted',
                    fontWeight: 500,
                    fontSize: 'sm',
                    h: 'auto',
                    p: 0,
                    _hover: {
                        color: 'text-strong',
                        textDecoration: 'underline',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'card-bg',
                    borderRadius: tokens.radius.md,
                    border: 'none',
                },
            },
        },
    },
    styles: {
        global: {
            'html, body': {
                bg: 'page-bg',
                color: 'text-strong',
                fontFamily: tokens.fontBody,
            },
        },
    },
});
