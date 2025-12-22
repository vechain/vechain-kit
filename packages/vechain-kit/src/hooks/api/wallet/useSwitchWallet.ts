import { useState, useCallback } from 'react';
import { useDAppKitWallet } from '@/hooks';

export type UseSwitchWalletReturnType = {
    switchWallet: () => Promise<void>;
    isSwitching: boolean;
};

/**
 * Hook for switching wallets in VeWorld in-app browser
 * Handles wallet switching logic without UI notifications
 */
export const useSwitchWallet = (): UseSwitchWalletReturnType => {
    const { switchWallet: dappKitSwitchWallet } = useDAppKitWallet();
    const [isSwitching, setIsSwitching] = useState(false);

    const switchWallet = useCallback(async () => {
        if (!dappKitSwitchWallet) {
            return;
        }

        setIsSwitching(true);
        try {
            // Use dapp-kit's switchWallet function
            // The wallet will update automatically via dapp-kit
            await dappKitSwitchWallet();
        } catch {
            // Silently handle errors - wallet state will update automatically on success
            // Errors are handled by dapp-kit internally
        } finally {
            setIsSwitching(false);
        }
    }, [dappKitSwitchWallet]);

    return {
        switchWallet,
        isSwitching,
    };
};
