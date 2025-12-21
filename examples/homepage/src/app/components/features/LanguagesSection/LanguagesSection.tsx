'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    Image,
    HStack,
    useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';

interface LanguagesSectionProps {
    bg?: string;
    title: string;
    content: string;
}

// Map language codes to country codes for flag icons
const languageToCountryCode: Record<string, string> = {
    en: 'us',
    de: 'de',
    it: 'it',
    fr: 'fr',
    es: 'es',
    zh: 'cn',
    ja: 'jp',
};

// Generate CDN URL for flag (using flagcdn.com)
const getFlagUrl = (langCode: string): string => {
    const countryCode = languageToCountryCode[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

export function LanguagesSection({
    bg = '#f0e8d8',
    title,
    content,
}: LanguagesSectionProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            px={[0, 20]}
            py={[0, 20]}
            mx={[4, '5%']}
            borderRadius={25}
            bg={bg}
            minH={'550px'}
            justifyContent={'center'}
        >
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
            >
                <VStack spacing={4} align="start" p={10}>
                    <Heading
                        as="h2"
                        fontSize="3xl"
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {title}
                    </Heading>

                    <Text
                        fontSize="lg"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                    >
                        {content}
                    </Text>
                </VStack>

                <HStack
                    spacing={3}
                    wrap="wrap"
                    p={10}
                    justify={['center', 'flex-start']}
                >
                    {supportedLanguages.map((lang) => {
                        const flagUrl = getFlagUrl(lang);
                        const langName =
                            languageNames[lang as keyof typeof languageNames] ||
                            lang;

                        return (
                            <Image
                                key={lang}
                                src={flagUrl}
                                alt={langName}
                                height={6}
                                width="auto"
                                borderRadius="md"
                                border="1px solid"
                                borderColor={
                                    colorMode === 'dark'
                                        ? 'gray.600'
                                        : 'gray.200'
                                }
                            />
                        );
                    })}
                    <Text
                        fontSize="sm"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                        fontStyle="italic"
                    >
                        {t('and more...')}
                    </Text>
                </HStack>
            </Grid>
        </Card>
    );
}



