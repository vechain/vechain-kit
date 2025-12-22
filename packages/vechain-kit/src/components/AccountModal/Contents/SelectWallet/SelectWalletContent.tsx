import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Heading,
    useToken,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    ModalBackButton,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { WalletCard } from './Components/WalletCard';
import {
    useSwitchWallet,
    useWallet,
    useRefreshBalances,
    useDAppKitWallet,
} from '@/hooks';
import { useWalletStorage } from '@/hooks/api/wallet/useWalletStorage';
import { useModal } from '@/providers/ModalProvider';
import { useAccountModalOptions } from '@/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoredWallet } from '@/hooks/api/wallet/useWalletStorage';
import { LuPlus } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    returnTo?: 'main' | 'profile';
    onLogoutSuccess?: () => void;
};

export const SelectWalletContent = ({
    setCurrentContent,
    returnTo = 'main',
    onLogoutSuccess: _onLogoutSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const { account, connection } = useWallet();
    const { disconnect: dappKitDisconnect } = useDAppKitWallet();
    const { getStoredWallets, setActiveWallet, removeWallet } =
        useSwitchWallet();
    const { saveWallet } = useWalletStorage();
    const { openConnectModal } = useModal();
    const { refresh } = useRefreshBalances();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const [wallets, setWallets] = useState(getStoredWallets());

    // Function to refresh wallets list
    const refreshWallets = useCallback(() => {
        const updatedWallets = getStoredWallets();
        setWallets(updatedWallets);
    }, [getStoredWallets]);

    // Refresh wallets list when account changes (new wallet connected) or when wallets are updated
    useEffect(() => {
        refreshWallets();
    }, [refreshWallets, account?.address]);

    // Listen for wallet switch events to refresh the list
    useEffect(() => {
        const handleWalletSwitch = () => {
            // Small delay to ensure storage is updated
            setTimeout(() => {
                refreshWallets();
            }, 100);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('wallet_switched', handleWalletSwitch);
            return () => {
                window.removeEventListener(
                    'wallet_switched',
                    handleWalletSwitch,
                );
            };
        }
    }, [refreshWallets]);

    // Always use the stored active wallet from cache
    // This is the wallet the user has selected as active
    const activeWalletAddress = useMemo(() => {
        const storedActive = wallets.find((w) => w.isActive);
        // Use stored active wallet if it exists
        if (storedActive) {
            return storedActive.address;
        }
        // Fallback to account address if no stored active wallet (new connection)
        return account?.address ?? null;
    }, [wallets, account?.address]);

    const activeWallet = useMemo(() => {
        return wallets.find(
            (w) =>
                w.address.toLowerCase() === activeWalletAddress?.toLowerCase(),
        );
    }, [wallets, activeWalletAddress]);

    const otherWallets = useMemo(() => {
        return wallets.filter(
            (w) =>
                w.address.toLowerCase() !== activeWalletAddress?.toLowerCase(),
        );
    }, [wallets, activeWalletAddress]);

    const handleWalletSelect = useCallback(
        (address: string) => {
            if (address.toLowerCase() === activeWalletAddress?.toLowerCase()) {
                return;
            }

            // Ensure the wallet that was previously active is saved
            // Metadata will be fetched dynamically when needed
            if (activeWallet) {
                saveWallet(activeWallet.address);
            }

            setActiveWallet(address);
            // Refresh wallets list immediately after switch
            setTimeout(() => {
                refreshWallets();
            }, 50);
            // Refresh balances after switching
            refresh();
            // Close modal and go back to the screen we came from
            setCurrentContent(returnTo);
        },
        [
            activeWalletAddress,
            activeWallet,
            account,
            setActiveWallet,
            refresh,
            setCurrentContent,
            refreshWallets,
            saveWallet,
        ],
    );

    const handleRemoveWallet = useCallback(
        (wallet: StoredWallet) => {
            // Navigate to remove wallet confirmation screen
            setCurrentContent({
                type: 'remove-wallet-confirm',
                props: {
                    walletAddress: wallet.address,
                    walletDomain: null, // Domain will be fetched dynamically in RemoveWalletConfirmContent
                    onConfirm: () => {
                        removeWallet(wallet.address);
                        // Refresh wallets list after removal
                        setTimeout(() => {
                            refreshWallets();
                        }, 50);
                        // Go back to select wallet screen
                        setCurrentContent({
                            type: 'select-wallet',
                            props: {
                                setCurrentContent,
                                onClose: () => {},
                                returnTo,
                                onLogoutSuccess: _onLogoutSuccess,
                            },
                        });
                    },
                    onBack: () => {
                        setCurrentContent({
                            type: 'select-wallet',
                            props: {
                                setCurrentContent,
                                onClose: () => {},
                                returnTo,
                                onLogoutSuccess: _onLogoutSuccess,
                            },
                        });
                    },
                },
            });
        },
        [
            removeWallet,
            refreshWallets,
            setCurrentContent,
            returnTo,
            _onLogoutSuccess,
        ],
    );

    const handleAddNewWallet = useCallback(async () => {
        // Disconnect from dappkit first if connected
        if (connection.isConnectedWithDappKit && !connection.isInAppBrowser) {
            try {
                dappKitDisconnect();
            } catch (error) {
                console.error('Error disconnecting from dappkit:', error);
            }
        }

        // Small delay to ensure disconnect is processed
        setTimeout(() => {
            // Open ConnectModal without preventAutoClose so it closes automatically
            // when a new wallet is connected after disconnect
            openConnectModal('main', false);
        }, 100);
    }, [
        openConnectModal,
        connection.isConnectedWithDappKit,
        connection.isInAppBrowser,
        dappKitDisconnect,
    ]);

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => {
                            setCurrentContent(returnTo);
                        }}
                    />
                )}
                <ModalHeader>{t('Select Wallet')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={4}>
                    {activeWallet && (
                        <VStack w={'full'} spacing={2} alignItems="flex-start">
                            <Heading size="sm" color={textSecondary}>
                                {t('Active Wallet')}
                            </Heading>
                            <WalletCard
                                wallet={activeWallet}
                                isActive={true}
                                onSelect={() => {}}
                                onRemove={() => {}}
                                showRemove={false}
                            />
                        </VStack>
                    )}

                    {otherWallets.length > 0 && (
                        <VStack w={'full'} spacing={2} alignItems="flex-start">
                            <Heading size="sm" color={textSecondary}>
                                {t('Other Wallets')}
                            </Heading>
                            {otherWallets.map((wallet) => (
                                <WalletCard
                                    key={wallet.address}
                                    wallet={wallet}
                                    isActive={false}
                                    onSelect={() =>
                                        handleWalletSelect(wallet.address)
                                    }
                                    onRemove={() => handleRemoveWallet(wallet)}
                                    showRemove={true}
                                />
                            ))}
                        </VStack>
                    )}

                    <Button
                        w="full"
                        leftIcon={<LuPlus />}
                        variant="vechainKitSecondary"
                        onClick={handleAddNewWallet}
                        mt={4}
                    >
                        {t('Add New Wallet')}
                    </Button>
                </VStack>
            </ModalBody>
        </ScrollToTopWrapper>
    );
};
