import { useCallback } from 'react';
import { useVeChainKitConfig } from '../../../providers';
import { NETWORK_TYPE } from '../../../config/network';
import {
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    isBrowser,
} from '../../../utils/ssrUtils';

export type StoredWallet = {
    address: string;
    connectedAt: number;
    isActive: boolean;
};

export const useWalletStorage = () => {
    const { network } = useVeChainKitConfig();

    const getStorageKeys = useCallback((networkType: NETWORK_TYPE) => {
        return {
            wallets: `vechain_kit_wallets_${networkType}`,
            activeWallet: `vechain_kit_active_wallet_${networkType}`,
        };
    }, []);

    const getStoredWallets = useCallback((): StoredWallet[] => {
        if (!isBrowser()) return [];

        const keys = getStorageKeys(network.type);
        const cached = getLocalStorageItem(keys.wallets);
        if (!cached) return [];
        return JSON.parse(cached) as StoredWallet[];
    }, [network.type, getStorageKeys]);

    const getActiveWallet = useCallback((): string | null => {
        if (!isBrowser()) return null;

        const keys = getStorageKeys(network.type);
        return getLocalStorageItem(keys.activeWallet);
    }, [network.type, getStorageKeys]);

    const saveWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();
            const existingIndex = wallets.findIndex(
                (w) => w.address.toLowerCase() === address.toLowerCase(),
            );

            const walletToSave: StoredWallet = {
                address: address,
                connectedAt:
                    existingIndex >= 0
                        ? wallets[existingIndex].connectedAt
                        : Date.now(),
                isActive: false,
            };

            if (existingIndex >= 0) {
                wallets[existingIndex] = walletToSave;
            } else {
                wallets.push(walletToSave);
            }

            setLocalStorageItem(keys.wallets, JSON.stringify(wallets));
        },
        [network.type, getStorageKeys, getStoredWallets],
    );

    const setActiveWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();

            // Update all wallets to set isActive
            const updatedWallets = wallets.map((w) => ({
                ...w,
                isActive: w.address.toLowerCase() === address.toLowerCase(),
            }));

            setLocalStorageItem(keys.wallets, JSON.stringify(updatedWallets));
            setLocalStorageItem(keys.activeWallet, address);
        },
        [network.type, getStorageKeys, getStoredWallets],
    );

    const removeWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const keys = getStorageKeys(network.type);
            const wallets = getStoredWallets();
            const updatedWallets = wallets.filter(
                (w) => w.address.toLowerCase() !== address.toLowerCase(),
            );

            setLocalStorageItem(keys.wallets, JSON.stringify(updatedWallets));

            // If removed wallet was active, clear active wallet
            const activeWallet = getActiveWallet();
            if (
                activeWallet &&
                activeWallet.toLowerCase() === address.toLowerCase()
            ) {
                removeLocalStorageItem(keys.activeWallet);
            }

            // Dispatch event to notify that a wallet was removed
            // This prevents useWallet from setting it as active again if it's still connected
            if (isBrowser()) {
                window.dispatchEvent(
                    new CustomEvent('wallet_removed', { detail: { address } }),
                );
            }
        },
        [network.type, getStorageKeys, getStoredWallets, getActiveWallet],
    );

    const initializeCurrentWallet = useCallback(
        (address: string) => {
            if (!isBrowser()) return;

            const wallets = getStoredWallets();
            if (wallets.length === 0) {
                // No wallets stored, save current wallet
                saveWallet(address);
                setActiveWallet(address);
            }
        },
        [getStoredWallets, saveWallet, setActiveWallet],
    );

    return {
        getStoredWallets,
        getActiveWallet,
        saveWallet,
        setActiveWallet,
        removeWallet,
        initializeCurrentWallet,
    };
};
