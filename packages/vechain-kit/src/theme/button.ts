import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const getVariants = (darkMode: boolean) => ({
    loginIn: defineStyle(() => ({
        bg: darkMode ? 'transparent' : 'white',
        color: darkMode ? 'white' : '#1a1a1a',
        fontSize: '14px',
        fontWeight: '400',
        border: darkMode ? '1px solid #ffffff1a' : '1px solid #ebebeb',
        py: 6,
        px: 3,
        borderRadius: 16,
        _hover: {
            bg: darkMode ? '#2a2a2a' : '#eaeaea',
        },
    })),
    loginWithVechain: defineStyle(() => ({
        bg: darkMode ? 'white' : '#1a1a1a',
        color: darkMode ? '#1a1a1a' : 'white',
        fontSize: '14px',
        fontWeight: '400',
        py: 6,
        px: 3,
        borderRadius: 16,
        border: darkMode ? '1px solid #ffffff1a' : '1px solid #5e5e5e',
        _hover: {
            bg: darkMode ? '#eaeaea' : '#2a2a2a',
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: 'md',
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: 'xl',
        bg: darkMode ? '#3182CE' : '#2B6CB0',
        color: 'white',
        _hover: {
            bg: darkMode ? '#2B6CB0' : '#2C5282',
            _disabled: {
                bg: '#2B6CB0',
            },
        },
        transition: 'all 0.2s',
    })),
    vechainKitSecondary: defineStyle(() => ({
        fontSize: 'md',
        px: 4,
        width: 'full',
        height: '60px',
        borderRadius: 'xl',
        backgroundColor: darkMode ? '#ffffff0a' : 'blackAlpha.50',
        _hover: {
            backgroundColor: darkMode ? '#ffffff12' : 'blackAlpha.200',
        },
        border: '1px solid',
        borderColor: darkMode ? 'whiteAlpha.200' : 'gray.200',
        color: darkMode ? 'whiteAlpha.900' : 'blackAlpha.900',
        transition: 'all 0.2s',
    })),
    vechainKitLogout: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        borderRadius: 'xl',
        p: 0,
        backgroundColor: darkMode ? 'rgba(254, 178, 178, 0.12)' : 'red.50',
        _hover: {
            backgroundColor: darkMode ? 'rgba(254, 178, 178, 0.37)' : 'red.200',
            color: darkMode ? 'red.50' : 'red.900',
        },
        transition: 'all 0.2s',
        color: darkMode ? 'red.200' : 'red.900',
    })),
    mainContentButton: defineStyle(() => ({
        width: '100%',
        backgroundColor: darkMode ? '#ffffff0a' : 'blackAlpha.50',
        borderRadius: 'xl',
        p: 3,
        cursor: 'pointer',
        _hover: {
            backgroundColor: darkMode ? '#ffffff12' : 'blackAlpha.200',
        },
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        backgroundColor: darkMode ? '#ffffff0a' : 'blackAlpha.50',
        borderRadius: 'xl',
        p: 0,
        _hover: {
            backgroundColor: darkMode ? '#ffffff12' : 'blackAlpha.200',
        },
        transition: 'all 0.2s',
    })),
});

export const getButtonTheme = (darkMode: boolean) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(darkMode),
    });
