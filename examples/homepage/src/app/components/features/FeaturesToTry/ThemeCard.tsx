'use client';

import {
    Box,
    VStack,
    Text,
    Icon,
    useColorMode,
    Button,
} from '@chakra-ui/react';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

export function ThemeCard() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Box
            p={4}
            borderRadius="md"
            backdropFilter="blur(10px)"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <Icon
                    as={colorMode === 'light' ? BsSun : BsMoon}
                    boxSize={6}
                    color={colorMode === 'light' ? 'orange.500' : 'purple.300'}
                />
                <Text fontWeight="bold">{t('Theme switcher')}</Text>
                <VStack align="start" spacing={2}>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        {t('Try switching between light and dark mode')}
                    </Text>
                    <Button
                        size="sm"
                        variant="ghost"
                        colorScheme={
                            colorMode === 'light' ? 'orange' : 'purple'
                        }
                        leftIcon={
                            <Icon
                                as={colorMode === 'light' ? BsMoon : BsSun}
                                boxSize={4}
                            />
                        }
                        onClick={toggleColorMode}
                    >
                        {t('Switch to')}{' '}
                        {colorMode === 'light' ? t('dark') : t('light')}{' '}
                        {t('mode')}
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
}
