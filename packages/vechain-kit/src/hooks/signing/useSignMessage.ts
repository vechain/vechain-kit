'use client';

import { useCallback, useState } from 'react';
// Import from specific provider file to avoid circular dependencies
import { useOptionalPrivyWalletProvider } from '../../providers/PrivyWalletProvider';
import { useWallet } from '../';
import { useOptionalDAppKitWallet } from '../api/dappkit/useOptionalDAppKitWallet';

type UseSignMessageReturnValue = {
    signMessage: (message: string) => Promise<string>;
    isSigningPending: boolean;
    signature: string | null;
    error: Error | null;
    reset: () => void;
};

/**
 * Hook to sign messages using the connected wallet.
 * Supports both Privy and VeChain wallets.
 *
 * @returns {UseSignMessageReturnValue} Object containing the signing function and status
 */
export const useSignMessage = (): UseSignMessageReturnValue => {
    const [isSigningPending, setIsSigningPending] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { connection, account } = useWallet();
    // Use optional DAppKit wallet hook that handles missing provider gracefully
    const { requestCertificate } = useOptionalDAppKitWallet();
    // Use optional provider - returns null when Privy is not configured
    const privyWalletProvider = useOptionalPrivyWalletProvider();

    const signMessage = useCallback(
        async (message: string): Promise<string> => {
            if (!account) throw new Error('Account not found');

            setIsSigningPending(true);
            setError(null);
            setSignature(null);

            try {
                let sig: string | null = null;

                if (connection.isConnectedWithDappKit) {
                    const certResponse = await requestCertificate(
                        {
                            purpose: 'agreement',
                            payload: {
                                type: 'text',
                                content: message,
                            },
                        },
                        {
                            signer: account.address,
                        },
                    );

                    sig = certResponse.signature;
                } else {
                    if (!privyWalletProvider) {
                        throw new Error(
                            'Privy is not configured. Please configure the privy prop in VeChainKitProvider to use this feature.',
                        );
                    }
                    sig = await privyWalletProvider.signMessage(message);
                }

                setSignature(sig);
                return sig;
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error(String(err));
                setError(error);
                throw error;
            } finally {
                setIsSigningPending(false);
            }
        },
        [connection, privyWalletProvider, account?.address],
    );

    const reset = useCallback(() => {
        setIsSigningPending(false);
        setSignature(null);
        setError(null);
    }, []);

    return {
        signMessage,
        isSigningPending,
        signature,
        error,
        reset,
    };
};
