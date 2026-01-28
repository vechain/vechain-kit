import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Heading,
    useToken,
    ModalFooter,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { WalletCard } from './Components/WalletCard';
import {
    useSwitchWallet,
    useWallet,
    useRefreshBalances,
    useDAppKitWallet,
    useDAppKitWalletModal,
} from '../../../../hooks';
import { useWalletStorage } from '../../../../hooks/api/wallet/useWalletStorage';
import { useAccountModalOptions } from '../../../../hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoredWallet } from '../../../../hooks/api/wallet/useWalletStorage';
import { LuLogOut, LuPlus } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { simpleHash } from '../../../../utils';

const hashWallets = (wallets: StoredWallet[]): string => {
    const addresses = wallets
        .map((w) => w.address.toLowerCase())
        .sort()
        .join('|');
    return simpleHash(addresses);
};

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
    const { account, disconnect } = useWallet();
    const { disconnect: dappKitDisconnect } = useDAppKitWallet();
    const { open: openDappKitModal } = useDAppKitWalletModal();
    const { getStoredWallets, setActiveWallet, removeWallet } =
        useSwitchWallet();
    const { saveWallet } = useWalletStorage();
    const { refresh } = useRefreshBalances();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const [wallets, setWallets] = useState(getStoredWallets());
    const walletsHashRef = useRef(hashWallets(getStoredWallets()));

    // Function to refresh wallets list
    const refreshWallets = useCallback(() => {
        const updatedWallets = getStoredWallets();
        setWallets(updatedWallets);
        walletsHashRef.current = hashWallets(updatedWallets);
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

    // Poll for wallet changes when modal is open to catch new wallets being added
    // This ensures we catch wallets added via dappkit modal even if account doesn't change immediately
    useEffect(() => {
        const interval = setInterval(() => {
            const currentWallets = getStoredWallets();
            const currentHash = hashWallets(currentWallets);

            // If wallet hash changed, refresh
            if (currentHash !== walletsHashRef.current) {
                refreshWallets();
            }
        }, 200); // Check every 200ms

        return () => clearInterval(interval);
    }, [getStoredWallets, refreshWallets]);

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
            // Pass feedback flag through content props
            setCurrentContent({
                type: returnTo,
                props: {
                    switchFeedback: {
                        showFeedback: true,
                    },
                },
            });
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
            const isActiveWallet =
                wallet.address.toLowerCase() ===
                activeWalletAddress?.toLowerCase();
            const remainingWallets = wallets.filter(
                (w) => w.address.toLowerCase() !== wallet.address.toLowerCase(),
            );

            // Navigate to remove wallet confirmation screen
            setCurrentContent({
                type: 'remove-wallet-confirm',
                props: {
                    walletAddress: wallet.address,
                    walletDomain: null, // Domain will be fetched dynamically in RemoveWalletConfirmContent
                    onConfirm: async () => {
                        // If removing the active wallet and there are other wallets, switch to the first one
                        if (isActiveWallet && remainingWallets.length > 0) {
                            const nextActiveWallet = remainingWallets[0];
                            setActiveWallet(nextActiveWallet.address);
                        } else if (
                            isActiveWallet &&
                            remainingWallets.length === 0
                        ) {
                            // If removing the last wallet, disconnect
                            try {
                                await dappKitDisconnect();
                            } catch (error) {
                                console.error('Error disconnecting:', error);
                            }
                        }

                        removeWallet(wallet.address);

                        // Refresh wallets list after removal
                        setTimeout(() => {
                            refreshWallets();
                        }, 50);

                        // If no wallets remain, close the modal
                        if (remainingWallets.length === 0) {
                            if (_onLogoutSuccess) {
                                _onLogoutSuccess();
                            }
                            return;
                        }

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
            activeWalletAddress,
            wallets,
            setActiveWallet,
            dappKitDisconnect,
        ],
    );

    const handleAddNewWallet = useCallback(() => {
        openDappKitModal();
    }, [openDappKitModal]);

    const handleLogout = () => {
        disconnect();
        _onLogoutSuccess?.();
    };

    return (
        <>
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
                                onRemove={() =>
                                    handleRemoveWallet(activeWallet)
                                }
                                showRemove={wallets.length > 1}
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
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <VStack w="full" spacing={2}>
                    <Button
                        w="full"
                        leftIcon={<LuPlus />}
                        variant="vechainKitSecondary"
                        onClick={handleAddNewWallet}
                    >
                        {t('Add New Wallet')}
                    </Button>
                    <Button
                        w="full"
                        leftIcon={<LuLogOut />}
                        variant="vechainKitLogout"
                        onClick={() =>
                            setCurrentContent({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: handleLogout,
                                    onBack: () =>
                                        setCurrentContent({
                                            type: 'select-wallet',
                                            props: {
                                                setCurrentContent,
                                                onClose: () => {},
                                                returnTo: returnTo,
                                                onLogoutSuccess:
                                                    _onLogoutSuccess,
                                            },
                                        }),
                                },
                            })
                        }
                    >
                        {t('Logout')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
