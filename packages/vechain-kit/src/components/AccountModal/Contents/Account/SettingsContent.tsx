import {
    ModalBody,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useUpgradeRequired, useWallet } from '@/hooks';
import {
    LuChevronRight,
    LuCircleHelp,
    LuShield,
    LuLogOut,
    LuCreditCard,
    LuUser,
    LuSettings,
} from 'react-icons/lu';
import { ActionButton } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuUnlink } from 'react-icons/lu';
import { useEffect, useRef } from 'react';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

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

    const { connection, disconnect, smartAccount, connectedWallet, account } =
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

    const handleCustomizeProfile = () => {
        setCurrentContent({
            type: 'account-customization',
            props: {
                setCurrentContent,
                initialContentSource: 'settings',
            },
        });
    };

    const handleNameChange = () => {
        if (account?.domain) {
            setCurrentContent({
                type: 'choose-name-search',
                props: {
                    name: '',
                    setCurrentContent,
                    initialContentSource: 'settings',
                },
            });
        } else {
            setCurrentContent({
                type: 'choose-name',
                props: {
                    setCurrentContent,
                    initialContentSource: 'settings',
                    onBack: () => setCurrentContent('settings'),
                },
            });
        }
    };

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
                <VStack w={'full'} spacing={4}>
                    <VStack w={'full'} spacing={0}>
                        <ActionButton
                            style={{
                                marginTop: '10px',
                                borderBottomRadius: '0px',
                            }}
                            title={t('Customize profile')}
                            onClick={handleCustomizeProfile}
                            leftIcon={LuUser}
                            rightIcon={LuChevronRight}
                        />

                        <ActionButton
                            style={{
                                borderTopRadius: '0px',
                            }}
                            title={t('Choose account name')}
                            description={t('Choose a name for your account.')}
                            onClick={handleNameChange}
                            leftIcon={LuCreditCard}
                            rightIcon={LuChevronRight}
                        />
                    </VStack>

                    <VStack w={'full'} spacing={0}>
                        {connection.isConnectedWithPrivy && (
                            <ActionButton
                                style={{
                                    borderBottomRadius: '0px',
                                }}
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
                            style={
                                connection.isConnectedWithPrivy
                                    ? {
                                          borderTopRadius: '0px',
                                          borderBottomRadius: '0px',
                                      }
                                    : {
                                          borderTopRadius: '12px',
                                          borderBottomRadius: '0px',
                                      }
                            }
                            title={t('General')}
                            onClick={handleGeneralSettings}
                            leftIcon={LuSettings}
                            rightIcon={LuChevronRight}
                        />
                        <ActionButton
                            title={t('Help')}
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
                            style={{
                                borderTopRadius: '0px',
                            }}
                        />
                    </VStack>
                    <VStack w={'full'} spacing={0}>
                        <ActionButton
                            style={{
                                borderBottomRadius: '0px',
                            }}
                            title={t('Connection details')}
                            onClick={handleConnectionDetails}
                            leftIcon={LuUnlink}
                            rightIcon={LuChevronRight}
                        />
                        <ActionButton
                            variant="vechainKitLogout"
                            style={{
                                borderTopRadius: '0px',
                            }}
                            title={t('Logout')}
                            onClick={() =>
                                setCurrentContent({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: handleLogout,
                                        onBack: () =>
                                            setCurrentContent('settings'),
                                    },
                                })
                            }
                            leftIcon={LuLogOut}
                        />
                    </VStack>
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </Box>
    );
};
