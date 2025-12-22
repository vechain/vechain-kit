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
    useColorMode,
    IconButton,
} from '@chakra-ui/react';
import { useCurrentLanguage } from '@vechain/vechain-kit';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { LuChevronDown } from 'react-icons/lu';

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
    const { colorMode } = useColorMode();
    const { currentLanguage, setLanguage } = useCurrentLanguage();

    const currentFlagUrl = getFlagUrl(currentLanguage);
    const currentLanguageName =
        languageNames[currentLanguage as keyof typeof languageNames] ||
        currentLanguage;

    const isDarkMode = colorMode === 'dark';

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                borderRadius="xl"
                aria-label="Select language"
                p={2}
                icon={
                    <HStack spacing={2}>
                        <Image
                            src={currentFlagUrl}
                            alt={currentLanguageName}
                            width="20px"
                            height="20px"
                            borderRadius="full"
                            objectFit="cover"
                            border="1px solid"
                            borderColor={
                                isDarkMode
                                    ? 'rgba(255, 255, 255, 0.2)'
                                    : 'gray.200'
                            }
                        />
                        <Icon as={LuChevronDown} boxSize={4} />
                    </HStack>
                }
            />
            <MenuList
                borderRadius="lg"
                border="1px solid"
                borderColor={
                    isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'gray.200'
                }
                bg={isDarkMode ? 'rgba(21, 21, 21)' : 'white'}
                boxShadow={
                    isDarkMode
                        ? '0px 2px 4px 1px rgb(0 0 0 / 40%)'
                        : '0px 2px 4px 1px rgb(0 0 0 / 10%)'
                }
                minW="180px"
                py={2}
            >
                {supportedLanguages.map((lang) => {
                    const flagUrl = getFlagUrl(lang);
                    const langName =
                        languageNames[lang as keyof typeof languageNames] ||
                        lang;
                    const isSelected = lang === currentLanguage;

                    return (
                        <MenuItem
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            bg={
                                isSelected
                                    ? isDarkMode
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(0, 0, 0, 0.05)'
                                    : 'transparent'
                            }
                            _hover={{
                                bg: isDarkMode
                                    ? 'rgba(255, 255, 255, 0.15)'
                                    : 'rgba(0, 0, 0, 0.08)',
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
                                    borderColor={
                                        isDarkMode
                                            ? 'rgba(255, 255, 255, 0.2)'
                                            : 'gray.200'
                                    }
                                />
                                <Text
                                    fontSize="sm"
                                    fontWeight={
                                        isSelected ? 'semibold' : 'normal'
                                    }
                                    color={isDarkMode ? 'white' : 'gray.900'}
                                >
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
