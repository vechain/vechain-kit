import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useDAppKitWallet } from '@/hooks';

export type UseSwitchWalletReturnType = {
    switchWallet: () => Promise<void>;
    isSwitching: boolean;
};

/**
 * Hook for switching wallets in VeWorld in-app browser
 * Handles all error cases and shows appropriate toast notifications
 */
export const useSwitchWallet = (): UseSwitchWalletReturnType => {
    const { switchWallet: dappKitSwitchWallet } = useDAppKitWallet();
    const toast = useToast();
    const [isSwitching, setIsSwitching] = useState(false);

    const switchWallet = useCallback(async () => {
        if (!dappKitSwitchWallet) {
            toast({
                title: 'Error',
                description:
                    'Switch wallet function not available. Make sure you are in VeWorld in-app browser.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsSwitching(true);
        try {
            // Use dapp-kit's switchWallet function
            await dappKitSwitchWallet();

            // Show success - the wallet will update automatically via dapp-kit
            toast({
                title: 'Wallet switched',
                description: 'Successfully switched wallet',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error) || 'Failed to switch wallet';

            const fullErrorDetails =
                error instanceof Error
                    ? `Message: ${error.message}\nName: ${
                          error.name
                      }\nStack: ${error.stack?.substring(0, 200)}`
                    : `Error: ${String(error)}`;

            // Check if error is about "remember me" not being enabled
            if (
                errorMessage.toLowerCase().includes('cannot switch wallet') ||
                errorMessage.toLowerCase().includes('remember me') ||
                errorMessage.toLowerCase().includes('kept signed in') ||
                errorMessage.toLowerCase().includes('user cannot switch')
            ) {
                toast({
                    title: 'Cannot switch wallet',
                    description:
                        'Please enable "Remember me" in VeWorld to switch wallets',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error switching wallet',
                    description: `${errorMessage}\n\nFull error:\n${fullErrorDetails}`,
                    status: 'error',
                    duration: 15000,
                    isClosable: true,
                });
            }
        } finally {
            setIsSwitching(false);
        }
    }, [dappKitSwitchWallet, toast]);

    return {
        switchWallet,
        isSwitching,
    };
};

