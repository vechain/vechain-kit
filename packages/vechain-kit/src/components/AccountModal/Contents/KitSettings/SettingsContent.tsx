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
import {
    useMfaEnrollment,
    usePrivy,
    useUpgradeRequired,
    useWallet,
} from '../../../../hooks';
import {
    LuChevronRight,
    LuCircleHelp,
    LuShield,
    LuLogOut,
    LuDollarSign,
    LuLanguages,
    LuFuel,
    LuLayoutGrid,
    LuUserCog,
    LuKey,
    LuShieldCheck,
    LuSettings2,
    LuFingerprint,
} from 'react-icons/lu';
import { ActionButton } from '../../Components';
import { ModalBackButton, StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuUnlink } from 'react-icons/lu';
import { useAccountModalOptions } from '../../../../hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '../../../../providers';

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
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const { exportWallet, linkPasskey } = usePrivy();
    const { showMfaEnrollmentModal } = useMfaEnrollment();

    const { feeDelegation } = useVeChainKitConfig();

    const { connection, disconnect, smartAccount, connectedWallet } =
        useWallet();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    const handleUpgradeSmartAccountClick = () => {
        setCurrentContent({
            type: 'upgrade-smart-account',
            props: {
                setCurrentContent,
                initialContent: 'settings',
            },
        });
    };

    const handleConnectionDetails = () => {
        setCurrentContent('connection-details');
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
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Settings')}</ModalHeader>

                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('profile')}
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
                </VStack>

                {upgradeRequired && (
                    <VStack w={'full'} spacing={2} mt={4}>
                        <ActionButton
                            title={t('Upgrade Smart Account to V3')}
                            description={t(
                                'A new version is available for your account',
                            )}
                            onClick={handleUpgradeSmartAccountClick}
                            leftIcon={LuSettings2}
                            extraContent={
                                <Box
                                    minWidth="8px"
                                    height="8px"
                                    bg="red.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml={2}
                                />
                            }
                        />
                    </VStack>
                )}

                {connection.isConnectedWithSocialLogin && (
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
                        <ActionButton
                            title={t('Passkey')}
                            onClick={() => linkPasskey()}
                            leftIcon={LuFingerprint}
                        />

                        <ActionButton
                            title={t('Backup')}
                            onClick={() => {
                                exportWallet();
                            }}
                            leftIcon={LuKey}
                        />

                        <ActionButton
                            title={t('Manage MFA')}
                            onClick={() => {
                                showMfaEnrollmentModal();
                            }}
                            leftIcon={LuShieldCheck}
                        />

                        <ActionButton
                            title={t('Login methods')}
                            onClick={() => {
                                setCurrentContent('privy-linked-accounts');
                            }}
                            leftIcon={LuUserCog}
                            rightIcon={LuChevronRight}
                        />
                    </VStack>
                )}

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
                </VStack>
            </ModalBody>
            <ModalFooter p={0} />
        </>
    );
};
