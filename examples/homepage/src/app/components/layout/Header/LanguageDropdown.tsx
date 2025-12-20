'use client';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    HStack,
    Image,
    Text,
    Icon,
} from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import { useCurrentLanguage } from '@vechain/vechain-kit';
import { supportedLanguages, languageNames } from '../../../../../i18n';

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

// Generate CDN URL for circle flag (using flagcdn.com)
const getFlagUrl = (langCode: string): string => {
    const countryCode = languageToCountryCode[langCode] || langCode;
    return `https://flagcdn.com/w40/${countryCode}.png`;
};

export function LanguageDropdown() {
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    const currentFlagUrl = getFlagUrl(currentLanguage);
    const currentLanguageName =
        languageNames[currentLanguage as keyof typeof languageNames] ||
        currentLanguage;

    return (
        <Menu>
            <MenuButton
                as="button"
                px={3}
                py={2}
                borderRadius="full"
                bg="transparent"
                _hover={{
                    bg: 'rgba(243, 243, 243, 0.67)',
                }}
                transition="all 0.2s"
                display="flex"
                alignItems="center"
            >
                <HStack spacing={2}>
                    <Image
                        src={currentFlagUrl}
                        alt={currentLanguageName}
                        width="20px"
                        height="20px"
                        borderRadius="full"
                        objectFit="cover"
                        border="1px solid"
                        borderColor="gray.200"
                    />
                    <Text fontSize="sm" fontWeight="medium" color="gray.900">
                        {currentLanguageName}
                    </Text>
                    <Icon as={LuChevronDown} boxSize={4} color="gray.600" />
                </HStack>
            </MenuButton>
            <MenuList
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="0px 2px 4px 1px rgb(0 0 0 / 10%)"
                minW="180px"
                py={2}
            >
                {supportedLanguages.map((lang) => {
                    const flagUrl = getFlagUrl(lang);
                    const langName =
                        languageNames[lang as keyof typeof languageNames] || lang;
                    const isSelected = lang === currentLanguage;

                    return (
                        <MenuItem
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            bg={isSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent'}
                            _hover={{
                                bg: 'rgba(0, 0, 0, 0.08)',
                            }}
                            py={2}
                            px={3}
                        >
                            <HStack spacing={3} w="full">
                                <Image
                                    src={flagUrl}
                                    alt={langName}
                                    width="20px"
                                    height="20px"
                                    borderRadius="full"
                                    objectFit="cover"
                                    border="1px solid"
                                    borderColor="gray.200"
                                />
                                <Text fontSize="sm" fontWeight={isSelected ? 'semibold' : 'normal'}>
                                    {langName}
                                </Text>
                            </HStack>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}

