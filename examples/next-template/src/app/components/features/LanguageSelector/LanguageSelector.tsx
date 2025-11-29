'use client';

import { Box, Heading, VStack, Text, Select } from '@chakra-ui/react';
import { useTranslation } from '../../../../../node_modules/react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { useCurrentLanguage } from '@vechain/vechain-kit';

export function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    return (
        <Box>
            <Heading size={'md'}>
                <b>Multilanguage</b> (Bidirectional Sync)
            </Heading>
            <VStack mt={4} spacing={4} alignItems="flex-start">
                <Text>
                    {t('Demo text to be translated')} - (language should change
                    also in modal and toast)
                </Text>
                <Text fontSize="sm" color="gray.500">
                    Current language: {currentLanguage}. Change language here and it will sync to VeChainKit settings.
                    Changes in VeChainKit settings will also sync here.
                </Text>
                <Select
                    borderRadius={'md'}
                    size="sm"
                    width="auto"
                    value={currentLanguage}
                    onChange={(e) => setLanguage(e.target.value)}
                    data-testid="select-language"
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
