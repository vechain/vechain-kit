import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { brand } from './brand';

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
    cssVarPrefix: 'vc',
};

export const vechainTheme = extendTheme({
    config,
    fonts: {
        heading: brand.fontHeading,
        body: brand.fontBody,
    },
    semanticTokens: {
        colors: {
            'page-bg': { _light: brand.almostWhite, _dark: brand.darkPurple },
            'card-bg': {
                _light: '#FFFFFF',
                _dark: 'rgba(252,252,253,0.04)',
            },
            'card-border': {
                _light: brand.coolGray,
                _dark: 'rgba(252,252,253,0.10)',
            },
            'text-strong': {
                _light: brand.darkPurple,
                _dark: brand.almostWhite,
            },
            'text-muted': {
                _light: 'rgba(12,10,31,0.6)',
                _dark: 'rgba(252,252,253,0.65)',
            },
            'text-subtle': {
                _light: 'rgba(12,10,31,0.45)',
                _dark: 'rgba(252,252,253,0.45)',
            },
            'btn-row-bg': {
                _light: '#FFFFFF',
                _dark: 'rgba(252,252,253,0.04)',
            },
            'btn-row-border': {
                _light: brand.coolGray,
                _dark: 'rgba(252,252,253,0.12)',
            },
            'btn-row-hover-bg': {
                _light: brand.coolGray,
                _dark: 'rgba(252,252,253,0.08)',
            },
            'chip-bg': {
                _light: brand.purpleSoft,
                _dark: 'rgba(114,102,255,0.18)',
            },
            'chip-text': { _light: brand.purple, _dark: '#B9B0FF' },
            'brand-accent': { _light: brand.purple, _dark: brand.purple },
            'brand-accent-hover': {
                _light: brand.purpleDeep,
                _dark: '#8B82FF',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontFamily: brand.fontBody,
                fontWeight: 500,
                borderRadius: brand.radius.button,
            },
            variants: {
                brand: {
                    bg: 'brand-accent',
                    color: 'white',
                    _hover: { bg: 'brand-accent-hover' },
                    _disabled: { opacity: 0.6 },
                },
                row: {
                    bg: 'btn-row-bg',
                    color: 'text-strong',
                    border: '1px solid',
                    borderColor: 'btn-row-border',
                    _hover: { bg: 'btn-row-hover-bg' },
                    justifyContent: 'flex-start',
                    px: 4,
                    h: '52px',
                    w: 'full',
                    fontWeight: 500,
                },
                // Override Chakra's default ghost so it reads against the
                // VeChain dark-purple / almost-white surfaces. The default
                // uses gray.700 / whiteAlpha.700 which all but disappear
                // on our backgrounds.
                ghost: {
                    bg: 'transparent',
                    color: 'text-muted',
                    _hover: {
                        bg: 'btn-row-hover-bg',
                        color: 'text-strong',
                    },
                    _active: { bg: 'btn-row-hover-bg' },
                    _disabled: { opacity: 0.4 },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'card-bg',
                    borderRadius: brand.radius.card,
                    border: '1px solid',
                    borderColor: 'card-border',
                },
            },
        },
    },
    styles: {
        global: {
            'html, body': {
                bg: 'page-bg',
                color: 'text-strong',
                fontFamily: brand.fontBody,
            },
        },
    },
});
