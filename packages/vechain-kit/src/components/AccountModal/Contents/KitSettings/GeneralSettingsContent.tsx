import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import {
    LuLanguages,
    LuChevronRight,
    LuShield,
    LuFuel,
    LuDollarSign,
} from 'react-icons/lu';

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

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
                            color={textSecondary}
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
                            leftIcon={LuDollarSign}
                            rightIcon={LuChevronRight}
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
                            leftIcon={LuLanguages}
                            rightIcon={LuChevronRight}
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
                                    leftIcon={LuFuel}
                                    rightIcon={LuChevronRight}
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
                        leftIcon={LuShield}
                        rightIcon={LuChevronRight}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
