import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Heading,
    useToast,
    useToken,
    Text,
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
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoredWallet } from '@/hooks/api/wallet/useWalletStorage';
import { LuPlus } from 'react-icons/lu';

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
    const toast = useToast();
    const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const removedWalletRef = useRef<StoredWallet | null>(null);

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

            // Update the wallet that was previously active to ensure it has latest metadata
            // This ensures "other wallets" show correct data
            // Save the previously active wallet BEFORE switching to preserve its current metadata
            if (activeWallet && account?.address) {
                // If the account matches the currently active wallet, save its metadata
                // This ensures the wallet that becomes "other wallet" has correct avatar
                if (
                    account.address.toLowerCase() ===
                    activeWallet.address.toLowerCase()
                ) {
                    saveWallet({
                        address: activeWallet.address,
                        domain: account.domain ?? undefined,
                        avatar: account.image ?? undefined,
                    });
                }
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
            // Store wallet for potential undo
            removedWalletRef.current = wallet;

            // Remove wallet temporarily
            removeWallet(wallet.address);

            // Refresh wallets list after removal
            setTimeout(() => {
                refreshWallets();
            }, 50);

            // Show toast with undo option
            const toastId = toast({
                title: 'Wallet removed',
                description: 'Wallet has been removed from your list',
                status: 'info',
                duration: 8000,
                isClosable: true,
                position: 'bottom',
                render: ({ onClose: onToastClose }) => (
                    <VStack
                        bg="vechain-kit-card"
                        p={4}
                        borderRadius="md"
                        spacing={2}
                        align="stretch"
                    >
                        <Heading size="sm">Wallet removed</Heading>
                        <Text fontSize="sm" color="vechain-kit-text-secondary">
                            Wallet has been removed from your list
                        </Text>
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={() => {
                                // Restore wallet
                                if (removedWalletRef.current) {
                                    saveWallet({
                                        address:
                                            removedWalletRef.current.address,
                                        domain:
                                            removedWalletRef.current.domain ??
                                            undefined,
                                        avatar:
                                            removedWalletRef.current.avatar ??
                                            undefined,
                                    });
                                    removedWalletRef.current = null;
                                    if (undoTimeoutRef.current) {
                                        clearTimeout(undoTimeoutRef.current);
                                        undoTimeoutRef.current = null;
                                    }
                                    // Refresh wallets list after undo
                                    setTimeout(() => {
                                        refreshWallets();
                                    }, 50);
                                }
                                onToastClose();
                            }}
                        >
                            Undo
                        </Button>
                    </VStack>
                ),
            });

            // Set timeout to permanently remove if not undone
            if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
            }
            undoTimeoutRef.current = setTimeout(() => {
                removedWalletRef.current = null;
                toast.close(toastId);
            }, 8000);
        },
        [removeWallet, toast, t, refreshWallets, saveWallet],
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

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
            }
        };
    }, []);

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
                <ModalHeader>Select Wallet</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={4}>
                    {activeWallet && (
                        <VStack w={'full'} spacing={2} alignItems="flex-start">
                            <Heading size="sm" color={textSecondary}>
                                Active Wallet
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
                                Other Wallets
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
                        Add New Wallet
                    </Button>
                </VStack>
            </ModalBody>
        </ScrollToTopWrapper>
    );
};
