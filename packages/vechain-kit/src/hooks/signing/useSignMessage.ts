'use client';

import { useCallback, useState } from 'react';
import { usePrivyWalletProvider } from '@/providers';
import { useConnex, useWallet } from '@/hooks';

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

    const { connection } = useWallet();
    const { vendor } = useConnex();
    const privyWalletProvider = usePrivyWalletProvider();

    const signMessage = useCallback(
        async (message: string): Promise<string> => {
            setIsSigningPending(true);
            setError(null);
            setSignature(null);

            try {
                let sig: string;

                if (connection.isConnectedWithDappKit) {
                    sig = (
                        await vendor
                            .sign('cert', {
                                purpose: 'agreement',
                                payload: {
                                    type: 'text',
                                    content: message,
                                },
                            })
                            .request()
                    ).signature;
                } else {
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
        [connection, privyWalletProvider],
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
