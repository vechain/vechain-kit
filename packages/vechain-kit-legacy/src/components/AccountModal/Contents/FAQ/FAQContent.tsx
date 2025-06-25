import {
    Button,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Icon,
    Select,
    ModalFooter,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { FAQAccordion } from './FAQAccordion';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type FAQContentProps = {
    onGoBack: () => void;
    showLanguageSelector?: boolean;
};

export const FAQContent = ({
    onGoBack,
    showLanguageSelector = true,
}: FAQContentProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        Analytics.settings.language.changed(e.target.value, i18n.language);
        i18n.changeLanguage(e.target.value);
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Help')}</ModalHeader>
                <ModalBackButton onClick={onGoBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack spacing={6} align="stretch">
                    {showLanguageSelector && (
                        <Select
                            borderRadius={'md'}
                            size="sm"
                            width="auto"
                            value={i18n.language}
                            onChange={handleLanguageChange}
                            bg={isDark ? 'whiteAlpha.200' : 'gray.100'}
                            borderColor={isDark ? 'whiteAlpha.300' : 'gray.200'}
                            _hover={{
                                borderColor: isDark
                                    ? 'whiteAlpha.400'
                                    : 'gray.300',
                            }}
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
                    )}

                    <Button
                        as={Link}
                        href="https://docs.vechainkit.vechain.org/"
                        isExternal
                        variant="vechainKitSecondary"
                        rightIcon={<Icon as={FaExternalLinkAlt} />}
                    >
                        {t('For developers')}
                    </Button>

                    <FAQAccordion />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
