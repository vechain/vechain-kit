import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Button,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages, loadLanguage } from '../../../../../i18n';
import { LuCheck } from 'react-icons/lu';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const LanguageSettingsContent = ({ setCurrentContent }: Props) => {
    const { t, i18n } = useTranslation();
    const languageRequestIdRef = useRef(0);
    const selectedBg = useColorModeValue(
        'rgba(0, 0, 0, 0.1)',
        'rgba(255, 255, 255, 0.05)',
    );

    const handleLanguageChange = async (lang: string) => {
        const requestId = ++languageRequestIdRef.current;
        try {
            await loadLanguage(lang);
            if (requestId !== languageRequestIdRef.current) return;
            i18n.changeLanguage(lang);
        } catch (error) {
            console.error(`[VeChainKit] Failed to switch language to "${lang}":`, error);
        }
    };

    const renderLanguageButton = (lang: string) => {
        const isSelected = i18n.language === lang;
        return (
            <Button
                key={lang}
                w="full"
                variant="ghost"
                justifyContent="space-between"
                onClick={() => handleLanguageChange(lang)}
                py={6}
                px={4}
                bg={isSelected ? selectedBg : undefined}
            >
                <Text>{languageNames[lang as keyof typeof languageNames]}</Text>
                {isSelected && (
                    <Icon as={LuCheck} boxSize={5} color="blue.500" />
                )}
            </Button>
        );
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select language')}</ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={3}
                    align="flex-start"
                    w={'full'}
                >
                    {supportedLanguages.map((lang: string) =>
                        renderLanguageButton(lang),
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
