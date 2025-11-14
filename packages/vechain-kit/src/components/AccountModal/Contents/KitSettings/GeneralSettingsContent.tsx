import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from 'react-icons/io5';
import {
    MdCurrencyExchange,
    MdOutlineNavigateNext,
    MdPrivacyTip,
    MdLocalGasStation,
} from 'react-icons/md';

import { ActionButton } from '../../Components';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const GeneralSettingsContent = ({ setCurrentContent }: Props) => {
    const { connection } = useWallet();
    const { t } = useTranslation();
    const { feeDelegation } = useVeChainKitConfig();

    const handleCurrencyClick = () => {
        setCurrentContent('change-currency');
    };

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
                            onClick={handleCurrencyClick}
                            leftIcon={MdCurrencyExchange}
                            rightIcon={MdOutlineNavigateNext}
                        />

                        <ActionButton
                            title={t('Language')}
                            style={{
                                borderTopRadius: '0px',
                                ...(connection.isConnectedWithPrivy
                                    ? { borderBottomRadius: '0px' } // middle item when gas token is shown
                                    : {}),
                            }}
                            onClick={() => {
                                setCurrentContent('change-language');
                            }}
                            leftIcon={IoLanguage}
                            rightIcon={MdOutlineNavigateNext}
                        />

                        {connection.isConnectedWithPrivy &&
                            !feeDelegation?.delegatorUrl && (
                                <ActionButton
                                    title={t('Gas Token Preferences')}
                                    style={{
                                        borderTopRadius: '0px', // last item in the group
                                    }}
                                    onClick={() => {
                                        setCurrentContent('gas-token-settings');
                                    }}
                                    leftIcon={MdLocalGasStation}
                                    rightIcon={MdOutlineNavigateNext}
                                />
                            )}
                    </VStack>
                    <ActionButton
                        title={t('Terms and Policies')}
                        onClick={() => {
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
