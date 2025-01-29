'use client';

import {
    Box,
    VStack,
    Text,
    Icon,
    useColorMode,
    Select,
    Button,
} from '@chakra-ui/react';
import { BsGlobe } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { useAccountModal } from '@vechain/vechain-kit';

export function LanguageCard() {
    const { colorMode } = useColorMode();
    const { t, i18n } = useTranslation();
    const { open: openAccountModal } = useAccountModal();
    return (
        <Box
            p={4}
            borderRadius="md"
            bg={colorMode === 'light' ? 'gray.50' : 'whiteAlpha.50'}
            height="full"
        >
            <VStack spacing={3} align="start">
                <Icon
                    as={BsGlobe}
                    boxSize={6}
                    color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
                />
                <Text fontWeight="bold">Multilanguage support</Text>
                <VStack align="start" spacing={2}>
                    <Text
                        fontSize="sm"
                        color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    >
                        {t('Demo text to be translated')}
                    </Text>
                    <Select
                        borderRadius={'md'}
                        size="sm"
                        width="auto"
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        {supportedLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {
                                    languageNames[
                                        lang as keyof typeof languageNames
                                    ]
                                }
                            </option>
                        ))}
                    </Select>
                    <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openAccountModal()}
                    >
                        {t('Check language in account modal')}
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
}
