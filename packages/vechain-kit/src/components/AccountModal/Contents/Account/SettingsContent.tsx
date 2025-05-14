import {
    ModalBody,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useUpgradeRequired, useWallet } from '@/hooks';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { ActionButton } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { useEffect, useRef, useState } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import { IoShieldOutline } from 'react-icons/io5';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FaRegAddressCard } from 'react-icons/fa';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { CgProfile } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';

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
    const [showGeneralRedDot, setShowGeneralRedDot] = useState(false);

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

        // Check if the user has visited general settings before
        const hasVisitedGeneral = localStorage.getItem(
            'settings-general-visited',
        );
        setShowGeneralRedDot(!hasVisitedGeneral);
    }, []);

    const handleCustomizeProfile = () => {
        Analytics.customization.started();
        setCurrentContent({
            type: 'account-customization',
            props: {
                setCurrentContent,
                initialContentSource: 'settings',
            },
        });
    };

    const handleNameChange = () => {
        Analytics.nameSelection.started('settings');
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
        Analytics.settings.accessAndSecurityViewed();
    };

    const handleConnectionDetails = () => {
        setCurrentContent('connection-details');
        Analytics.settings.connectionDetailsViewed();
    };

    const handleGeneralSettings = () => {
        // Mark general settings as visited
        localStorage.setItem('settings-general-visited', 'true');
        setShowGeneralRedDot(false);

        setCurrentContent('general-settings');
        Analytics.settings.generalSettingsViewed();
    };

    const handleLogout = () => {
        Analytics.auth.trackAuth('disconnect_initiated');
        disconnect();
        onLogoutSuccess();
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{t('Settings')}</ModalHeader>

                <ModalBackButton onClick={() => setCurrentContent('main')} />
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
                            leftIcon={CgProfile}
                            rightIcon={MdOutlineNavigateNext}
                        />

                        <ActionButton
                            style={{
                                borderTopRadius: '0px',
                            }}
                            title={t('Choose account name')}
                            description={t('Choose a name for your account.')}
                            onClick={handleNameChange}
                            leftIcon={FaRegAddressCard}
                            rightIcon={MdOutlineNavigateNext}
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
                                leftIcon={IoShieldOutline}
                                rightIcon={MdOutlineNavigateNext}
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
                            leftIcon={IoSettingsOutline}
                            rightIcon={MdOutlineNavigateNext}
                            extraContent={
                                showGeneralRedDot && (
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
                            leftIcon={BsQuestionCircle}
                            rightIcon={MdOutlineNavigateNext}
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
                            leftIcon={VscDebugDisconnect}
                            rightIcon={MdOutlineNavigateNext}
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
                            leftIcon={RiLogoutBoxLine}
                        />
                    </VStack>
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </Box>
    );
};
