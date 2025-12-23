import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    VStack,
    HStack,
    Button,
    Icon,
} from '@chakra-ui/react';
import { useSwitchWallet, useWallet, useDAppKitWallet } from '@/hooks';
import { FeatureAnnouncementCard } from '@/components';
import { ProfileCard } from './Components/ProfileCard/ProfileCard';
import {
    StickyHeaderContainer,
    WalletSwitchFeedback,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuArrowLeftRight, LuLogOut, LuWalletCards } from 'react-icons/lu';
import { ModalSettingsButton } from '@/components/common/ModalSettingsButton';
import { isBrowser } from '@/utils';

export type ProfileContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
    switchFeedback?: { showFeedback: boolean };
};

export const ProfileContent = ({
    setCurrentContent,
    onLogoutSuccess,
    switchFeedback,
}: ProfileContentProps) => {
    const { t } = useTranslation();
    const { account, disconnect, connection } = useWallet();
    const { switchWallet, isSwitching, isInAppBrowser } = useSwitchWallet();
    const { isSwitchWalletEnabled } = useDAppKitWallet();

    const handleSwitchWallet = () => {
        if (isInAppBrowser) {
            switchWallet();
        } else {
            // Desktop: navigate to select wallet screen
            setCurrentContent({
                type: 'select-wallet',
                props: {
                    setCurrentContent,
                    onClose: () => {},
                    returnTo: 'profile',
                    onLogoutSuccess,
                },
            });
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Profile')}
                </ModalHeader>

                <ModalSettingsButton
                    onClick={() => {
                        setCurrentContent('settings');
                    }}
                    data-testid="settings-button"
                />

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={6}>
                    <WalletSwitchFeedback
                        showFeedback={switchFeedback?.showFeedback}
                    />
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <ProfileCard
                        onEditClick={() => {
                            setCurrentContent({
                                type: 'account-customization',
                                props: {
                                    setCurrentContent,
                                    initialContentSource: 'profile',
                                },
                            });
                        }}
                        address={account?.address ?? ''}
                        showHeader={false}
                        setCurrentContent={setCurrentContent}
                        onLogout={() => {
                            setCurrentContent?.({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: () => {
                                        disconnect();
                                        onLogoutSuccess?.();
                                    },
                                    onBack: () =>
                                        setCurrentContent?.('profile'),
                                },
                            });
                        }}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <HStack w="full" justify="space-between" spacing={4} mt={4}>
                    <Button
                        size="md"
                        width="full"
                        height="40px"
                        variant="vechainKitSecondary"
                        leftIcon={<Icon as={LuWalletCards} />}
                        onClick={() => setCurrentContent('main')}
                        data-testid="wallet-button"
                    >
                        {t('Wallet')}
                    </Button>

                    {/* In VeWorld mobile we call switchWallet
                    on the desktop we call setCurrentContent to select-wallet
                    otherwise we show logout button
                    */}
                    {connection.isInAppBrowser && isSwitchWalletEnabled ? (
                        <Button
                            size="md"
                            width="full"
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuArrowLeftRight} />}
                            colorScheme="red"
                            onClick={async () => {
                                await switchWallet();
                                // For VeWorld in-app browser, the wallet_switched event will be dispatched
                                // by the dapp-kit when the wallet actually changes
                            }}
                            isLoading={isSwitching}
                            isDisabled={isSwitching}
                            data-testid="switch-wallet-button"
                        >
                            {t('Switch')}
                        </Button>
                    ) : isBrowser() && connection.isConnectedWithDappKit ? (
                        <Button
                            size="md"
                            width="full"
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuArrowLeftRight} />}
                            colorScheme="red"
                            onClick={handleSwitchWallet}
                            data-testid="switch-wallet-button"
                        >
                            {t('Switch')}
                        </Button>
                    ) : (
                        <Button
                            size="md"
                            width="full"
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuLogOut} />}
                            colorScheme="red"
                            onClick={() =>
                                setCurrentContent({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: () => {
                                            disconnect();
                                            onLogoutSuccess?.();
                                        },
                                        onBack: () =>
                                            setCurrentContent?.('profile'),
                                    },
                                })
                            }
                            data-testid="logout-button"
                        >
                            {t('Logout')}
                        </Button>
                    )}
                </HStack>
            </ModalFooter>
        </>
    );
};
