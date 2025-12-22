import { useState, useCallback } from 'react';
import { useDAppKitWallet, useWallet } from '@/hooks';
import { useWalletStorage, StoredWallet } from './useWalletStorage';
import { isBrowser } from '@/utils/ssrUtils';

export type UseSwitchWalletReturnType = {
    switchWallet: () => Promise<void>;
    isSwitching: boolean;
    getStoredWallets: () => StoredWallet[];
    setActiveWallet: (address: string) => void;
    removeWallet: (address: string) => void;
    isInAppBrowser: boolean;
};

/**
 * Hook for switching wallets
 * - In VeWorld in-app browser: Uses dapp-kit's switchWallet function
 * - On desktop: Provides wallet storage functions for UI-based switching
 */
export const useSwitchWallet = (): UseSwitchWalletReturnType => {
    const { switchWallet: dappKitSwitchWallet } = useDAppKitWallet();
    const { connection } = useWallet();
    const [isSwitching, setIsSwitching] = useState(false);
    const {
        getStoredWallets: getStoredWalletsStorage,
        setActiveWallet: setActiveWalletStorage,
        removeWallet: removeWalletStorage,
    } = useWalletStorage();

    const isInAppBrowser = connection.isInAppBrowser;

    const switchWallet = useCallback(async () => {
        if (isInAppBrowser) {
            // In-app browser: use dapp-kit's switchWallet
            if (!dappKitSwitchWallet) {
                return;
            }

            setIsSwitching(true);
            try {
                await dappKitSwitchWallet();
            } catch {
                // Silently handle errors - wallet state will update automatically on success
            } finally {
                setIsSwitching(false);
            }
        } else {
            // Desktop: wallet switching is handled via UI (SelectWalletContent)
            // This function is called but navigation is handled by components
            return Promise.resolve();
        }
    }, [dappKitSwitchWallet, isInAppBrowser]);

    const setActiveWallet = useCallback(
        (address: string) => {
            setActiveWalletStorage(address);
            // Dispatch event to trigger wallet change
            if (isBrowser()) {
                window.dispatchEvent(
                    new CustomEvent('wallet_switched', { detail: { address } }),
                );
            }
        },
        [setActiveWalletStorage],
    );

    return {
        switchWallet,
        isSwitching,
        getStoredWallets: getStoredWalletsStorage,
        setActiveWallet,
        removeWallet: removeWalletStorage,
        isInAppBrowser,
    };
};
