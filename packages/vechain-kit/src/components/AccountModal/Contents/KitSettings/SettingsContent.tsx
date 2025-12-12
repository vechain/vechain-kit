import {
    ModalBody,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    ModalCloseButton,
    Text,
    useToken,
} from '@chakra-ui/react';
import { useUpgradeRequired, useWallet } from '@/hooks';
import {
    LuChevronRight,
    LuCircleHelp,
    LuShield,
    LuLogOut,
    LuSettings,
    LuDollarSign,
    LuLanguages,
    LuFuel,
    LuLayoutGrid,
} from 'react-icons/lu';
import { ActionButton } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuUnlink } from 'react-icons/lu';
import { useEffect, useRef } from 'react';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';

export type SettingsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
};

export const SettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: SettingsContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const { feeDelegation } = useVeChainKitConfig();

    const { connection, disconnect, smartAccount, connectedWallet } =
        useWallet();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, []);

    const handleAccessAndSecurity = () => {
        setCurrentContent('access-and-security');
    };

    const handleConnectionDetails = () => {
        setCurrentContent('connection-details');
    };

    const handleGeneralSettings = () => {
        setCurrentContent('general-settings');
    };

    const handleLogout = () => {
        disconnect();
        onLogoutSuccess();
    };

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleCurrencyClick = () => {
        setCurrentContent('change-currency');
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{t('Settings')}</ModalHeader>

                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={2}>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        color={textSecondary}
                        textAlign={'left'}
                        w={'full'}
                    >
                        {t('General')}
                    </Text>

                    <ActionButton
                        title={t('Currency')}
                        onClick={handleCurrencyClick}
                        leftIcon={LuDollarSign}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Language')}
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
                                onClick={() => {
                                    setCurrentContent('gas-token-settings');
                                }}
                                leftIcon={LuFuel}
                                rightIcon={LuChevronRight}
                            />
                        )}

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

                <VStack w={'full'} spacing={2} mt={4}>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        color={textSecondary}
                        textAlign={'left'}
                        w={'full'}
                    >
                        {t('Access and security')}
                    </Text>
                    {connection.isConnectedWithPrivy && (
                        <ActionButton
                            title={t('Access and security')}
                            onClick={handleAccessAndSecurity}
                            leftIcon={LuShield}
                            rightIcon={LuChevronRight}
                            extraContent={
                                upgradeRequired && (
                                    <Box
                                        minWidth="8px"
                                        height="8px"
                                        bg="red.500"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    />
                                )
                            }
                        />
                    )}
                    <ActionButton
                        title={t('General')}
                        onClick={handleGeneralSettings}
                        leftIcon={LuSettings}
                        rightIcon={LuChevronRight}
                    />
                </VStack>

                <VStack w={'full'} spacing={2} mt={4}>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        color={textSecondary}
                        textAlign={'left'}
                        w={'full'}
                    >
                        {t('Help')}
                    </Text>

                    <ActionButton
                        title={t('Frequently asked questions')}
                        onClick={() =>
                            setCurrentContent({
                                type: 'faq',
                                props: {
                                    onGoBack: () =>
                                        setCurrentContent('settings'),
                                    showLanguageSelector: false,
                                },
                            })
                        }
                        leftIcon={LuCircleHelp}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Connection details')}
                        onClick={handleConnectionDetails}
                        leftIcon={LuUnlink}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Explore ecosystem')}
                        onClick={() => setCurrentContent('ecosystem')}
                        leftIcon={LuLayoutGrid}
                        rightIcon={LuChevronRight}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <ActionButton
                    title={t('Logout')}
                    onClick={() =>
                        setCurrentContent({
                            type: 'disconnect-confirm',
                            props: {
                                onDisconnect: handleLogout,
                                onBack: () => setCurrentContent('settings'),
                            },
                        })
                    }
                    leftIcon={LuLogOut}
                />
            </ModalFooter>
        </Box>
    );
};
