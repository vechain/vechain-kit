'use client';

import { useCallback, useState } from 'react';
import type { SignTypedDataParams } from '@privy-io/react-auth';
// Import from specific provider file to avoid circular dependencies
import { useOptionalPrivyWalletProvider } from '../../providers/PrivyWalletProvider';
import { useWallet } from '../';
import { useOptionalDAppKitWallet } from '../api/dappkit/useOptionalDAppKitWallet';
import { SignTypedDataOptions, TypedDataDomain } from '@vechain/sdk-network';

type UseSignTypedDataReturnValue = {
    signTypedData: (
        data: SignTypedDataParams,
        options?: { signer?: string },
    ) => Promise<string>;
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

    // Use optional DAppKit wallet hook that handles missing provider gracefully
    const { signer } = useOptionalDAppKitWallet();
    const { connection } = useWallet();
    // Use optional provider - returns null when Privy is not configured
    const privyWalletProvider = useOptionalPrivyWalletProvider();

    const signTypedData = useCallback(
        async (
            data: SignTypedDataParams,
            options?: SignTypedDataOptions,
        ): Promise<string> => {
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
                    } as TypedDataDomain;

                    sig = await signer.signTypedData(
                        domain,
                        data.types,
                        data.message,
                        undefined,
                        options,
                    );
                } else {
                    if (!privyWalletProvider) {
                        throw new Error(
                            'Privy is not configured. Please configure the privy prop in VeChainKitProvider to use this feature.',
                        );
                    }
                    sig = await privyWalletProvider.signTypedData(data);
                }

                setSignature(sig);
                return sig;
            } catch (err) {
                // Handle user rejection specifically
                if (
                    err &&
                    typeof err === 'object' &&
                    'statusCode' in err &&
                    (err as any).statusCode === 4001
                ) {
                    const userRejectionError = new Error(
                        'User denied signature request',
                    );
                    setError(userRejectionError);
                    throw userRejectionError;
                }

                // Handle other errors
                const error =
                    err instanceof Error
                        ? err
                        : new Error(
                              typeof err === 'object'
                                  ? JSON.stringify(err)
                                  : String(err),
                          );
                console.error(error);
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
