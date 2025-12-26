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
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { FAQAccordion } from './FAQAccordion';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { VECHAIN_KIT_DOCS_URL } from '@/utils/urls';

export type FAQContentProps = {
    onGoBack: () => void;
    showLanguageSelector?: boolean;
};

export const FAQContent = ({
    onGoBack,
    showLanguageSelector = true,
}: FAQContentProps) => {
    const { i18n, t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    // Use semantic tokens for colors
    const selectBg = useToken('colors', 'vechain-kit-card');
    const selectBorder = useToken('colors', 'vechain-kit-border');
    const selectBorderHover = useToken('colors', 'vechain-kit-border-hover');

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Help')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={onGoBack} />}
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
                            bg={selectBg}
                            borderColor={selectBorder}
                            _hover={{
                                borderColor: selectBorderHover,
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
                        href={VECHAIN_KIT_DOCS_URL}
                        isExternal
                        variant="vechainKitSecondary"
                        rightIcon={<Icon as={LuExternalLink} />}
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
