import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const variants = {
    loginIn: defineStyle(() => ({
        bg: 'white',
        color: '#1a1a1a',
        fontSize: '14px',
        fontWeight: '400',
        border: '1px solid #ebebeb',
        py: 6,
        px: 3,
        borderRadius: 16,
        _hover: {
            bg: '#eaeaea',
        },
        _dark: {
            bg: 'transparent',
            color: 'white',
            _hover: {
                bg: '#2a2a2a',
            },
            border: '1px solid #ffffff1a',
        },
    })),
    loginWithVechain: defineStyle(() => ({
        bg: '#1a1a1a',
        color: 'white',
        fontSize: '14px',
        fontWeight: '400',
        py: 6,
        px: 3,
        borderRadius: 16,
        border: '1px solid #5e5e5e',
        _hover: {
            bg: '#2a2a2a',
        },
        _dark: {
            bg: 'white',
            color: '#1a1a1a',
            _hover: {
                bg: '#eaeaea',
            },
            border: '1px solid #ffffff1a',
        },
        transition: 'all 0.2s',
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
        fontSize: 'md',
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
    vechainKitSecondary: defineStyle(({ colorMode }) => ({
        fontSize: 'md',
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: 'xl',
        backgroundColor: colorMode === 'dark' ? '#ffffff0a' : 'blackAlpha.50',
        _hover: {
            backgroundColor:
                colorMode === 'dark' ? '#ffffff12' : 'blackAlpha.200',
        },
        border: '1px solid',
        borderColor: 'gray.200',
        color: 'blackAlpha.900',
        _dark: {
            borderColor: 'whiteAlpha.200',
            color: 'whiteAlpha.900',
        },
        transition: 'all 0.2s',
    })),
    vechainKitLogout: defineStyle(({ colorMode }) => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        borderRadius: 'xl',
        p: 0,
        backgroundColor:
            colorMode === 'dark' ? 'rgba(254, 178, 178, 0.12)' : 'red.50',
        _hover: {
            backgroundColor:
                colorMode === 'dark' ? 'rgba(254, 178, 178, 0.37)' : 'red.200',
            color: colorMode === 'dark' ? 'red.50' : 'red.900',
        },
        transition: 'all 0.2s',
        color: colorMode === 'dark' ? 'red.200' : 'red.900',
    })),
    mainContentButton: defineStyle(({ colorMode }) => ({
        width: '100%',
        backgroundColor: colorMode === 'dark' ? '#ffffff0a' : 'blackAlpha.50',
        borderRadius: 'xl',
        p: 3,
        cursor: 'pointer',
        _hover: {
            backgroundColor:
                colorMode === 'dark' ? '#ffffff12' : 'blackAlpha.200',
        },
    })),
    actionButton: defineStyle(({ colorMode }) => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        backgroundColor: colorMode === 'dark' ? '#ffffff0a' : 'blackAlpha.50',
        borderRadius: 'xl',
        p: 0,
        _hover: {
            backgroundColor:
                colorMode === 'dark' ? '#ffffff12' : 'blackAlpha.200',
        },
        transition: 'all 0.2s',
    })),
};

export const buttonTheme = defineStyleConfig({
    baseStyle,
    variants,
});
