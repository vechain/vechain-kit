'use client';

import { useCallback, useState } from 'react';
import { SignTypedDataParams } from '@privy-io/react-auth';
import { usePrivyWalletProvider } from '@/providers';
import { useWallet, useDAppKitWallet } from '@/hooks';

type UseSignTypedDataReturnValue = {
    signTypedData: (data: SignTypedDataParams) => Promise<string>;
    isSigningPending: boolean;
    signature: string | null;
    error: Error | null;
    reset: () => void;
};

/**
 * Hook to sign typed data using the connected wallet.
 * Supports both Privy and VeChain wallets.
 *
 * @returns {UseSignTypedDataReturnValue} Object containing the signing function and status
 */
export const useSignTypedData = (): UseSignTypedDataReturnValue => {
    const [isSigningPending, setIsSigningPending] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const { connection } = useWallet();
    const privyWalletProvider = usePrivyWalletProvider();

    const { signTypedData: signTypedDataDappKit } = useDAppKitWallet();
    const signTypedData = useCallback(
        async (data: SignTypedDataParams): Promise<string> => {
            setIsSigningPending(true);
            setError(null);
            setSignature(null);

            try {
                let sig: string;
                if (connection.isConnectedWithDappKit) {
                    const domain = {
                        ...data.domain,
                        salt: data.domain?.salt
                            ? Buffer.from(data.domain.salt).toString('hex')
                            : undefined,
                    };

                    sig = await signTypedDataDappKit(
                        domain,
                        data.types as Record<
                            string,
                            Array<{ name: string; type: string }>
                        >,
                        data.message as Record<string, any>,
                    );
                } else {
                    sig = await privyWalletProvider.signTypedData(data);
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
        signTypedData,
        isSigningPending,
        signature,
        error,
        reset,
    };
};
