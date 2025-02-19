'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';

export function LanguageSelector() {
    const { t, i18n } = useTranslation();

    return (
        <Box
            p={6}
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.100"
            _hover={{ borderColor: 'blue.500', cursor: 'pointer' }}
            transition="all 0.2s"
        >
            <Heading size={'md'}>
                <b>Multilanguage</b>
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    {t('Demo text to be translated')} - (language should change
                    also in modal and toast)
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                >
                    {supportedLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {languageNames[lang as keyof typeof languageNames]}
                        </option>
                    ))}
                </Select>
            </VStack>
        </Box>
    );
}
