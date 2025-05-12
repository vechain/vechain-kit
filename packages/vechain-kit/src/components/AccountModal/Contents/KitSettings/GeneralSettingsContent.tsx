import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { Analytics } from '@/utils/mixpanelClientInstance';
import {
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from 'react-icons/io5';
import {
    MdCurrencyExchange,
    MdOutlineNavigateNext,
    MdPrivacyTip,
} from 'react-icons/md';

import { ActionButton } from '../../Components';
import { AccountModalContentTypes } from '../../Types';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const GeneralSettingsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('General')}</ModalHeader>

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
                    <VStack w="full" justifyContent="center" spacing={3} mb={3}>
                        <Text
                            fontSize={'sm'}
                            opacity={0.5}
                            textAlign={'center'}
                        >
                            {t(
                                'Manage your preferences for currency, language, and appearance.',
                            )}
                        </Text>
                    </VStack>

                    <VStack w="full" justifyContent="center" spacing={0}>
                        <ActionButton
                            title={t('Currency')}
                            style={{
                                borderBottomRadius: '0px',
                            }}
                            onClick={() => {
                                Analytics.settings.currencySettingsViewed();
                                setCurrentContent('change-currency');
                            }}
                            leftIcon={MdCurrencyExchange}
                            rightIcon={MdOutlineNavigateNext}
                        />

                        <ActionButton
                            title={t('Language')}
                            style={{
                                borderTopRadius: '0px',
                            }}
                            onClick={() => {
                                Analytics.settings.languageSettingsViewed();
                                setCurrentContent('change-language');
                            }}
                            leftIcon={IoLanguage}
                            rightIcon={MdOutlineNavigateNext}
                        />
                    </VStack>
                    <ActionButton
                        title={t('Terms and Privacy')}
                        onClick={() => {
                            Analytics.settings.termsAndPrivacyViewed();
                            setCurrentContent({
                                type: 'terms-and-privacy',
                                props: {
                                    onGoBack: () =>
                                        setCurrentContent('settings'),
                                },
                            });
                        }}
                        leftIcon={MdPrivacyTip}
                        rightIcon={MdOutlineNavigateNext}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
