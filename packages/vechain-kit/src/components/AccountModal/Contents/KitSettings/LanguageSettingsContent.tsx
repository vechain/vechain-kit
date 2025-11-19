import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Button,
    Icon,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { LuCheck } from 'react-icons/lu';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const LanguageSettingsContent = ({ setCurrentContent }: Props) => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const renderLanguageButton = (lang: string) => (
        <Button
            key={lang}
            w="full"
            variant="ghost"
            justifyContent="space-between"
            onClick={() => handleLanguageChange(lang)}
            py={6}
            px={4}
        >
            <Text>{languageNames[lang as keyof typeof languageNames]}</Text>
            {i18n.language === lang && (
                <Icon as={LuCheck} boxSize={5} color="blue.500" />
            )}
        </Button>
    );

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select language')}</ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('general-settings')}
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
