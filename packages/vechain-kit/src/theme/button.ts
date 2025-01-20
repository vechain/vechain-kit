import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const variants = {
    loginIn: defineStyle(() => ({
        bg: '#f2f2f2',
        color: '#2a2a2a',
        _hover: {
            bg: '#eaeaea',
        },
        _dark: {
            bg: '#1f1f1e',
            color: '#ffffff',
            _hover: {
                bg: '#3c3c39',
            },
            // border: '1px solid #5e5e5e',
        },
    })),
    vechainKitSelector: defineStyle(({ colorMode }) => ({
        bg: 'transparent',
        border: `1px solid ${colorMode === 'dark' ? '#ffffff29' : '#ebebeb'}`,
        _hover: {
            borderColor: colorMode === 'dark' ? '#ffffff50' : '#dedede',
            bg: colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50',
        },
        _active: {
            transform: 'scale(0.98)',
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: 'sm',
        fontWeight: '400',
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: 'xl',
        bg: '#2B6CB0',
        color: 'white',
        _hover: {
            bg: '#2C5282',
            _disabled: {
                bg: '#2B6CB0',
            },
        },
        _dark: {
            bg: '#3182CE',
            _hover: {
                bg: '#2B6CB0',
            },
        },
        transition: 'all 0.2s',
    })),
    vechainKitSecondary: defineStyle(() => ({
        fontSize: 'sm',
        fontWeight: '400',
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: 'xl',
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'gray.200',
        color: 'gray.700',
        _hover: {
            bg: 'gray.50',
            _disabled: {
                bg: 'transparent',
            },
        },
        _dark: {
            borderColor: 'whiteAlpha.200',
            color: 'whiteAlpha.900',
            _hover: {
                bg: 'whiteAlpha.50',
            },
        },
        transition: 'all 0.2s',
    })),
};

export const buttonTheme = defineStyleConfig({
    baseStyle,
    variants,
});
