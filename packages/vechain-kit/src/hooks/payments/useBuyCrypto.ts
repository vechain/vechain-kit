'use client';

import { useState, useCallback } from 'react';
import { useAddFunds, usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

export type UseBuyCryptoResult = {
    buyCrypto: (params: {
        amount?: string;
        currency?: 'usd' | 'eur' | 'gbp';
    }) => Promise<{ status: 'confirmed' | 'submitted' }>;
    isBuying: boolean;
    error: Error | null;
};

export const useBuyCrypto = (): UseBuyCryptoResult => {
    const { account } = useWallet();
    const { fiatOnramp, network } = useVeChainKitConfig();
    const { addFunds } = useAddFunds();
    const { authenticated } = usePrivy();
    const [isBuying, setIsBuying] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const buyCrypto = useCallback(
        async (params: {
            amount?: string;
            currency?: 'usd' | 'eur' | 'gbp';
        }): Promise<{ status: 'confirmed' | 'submitted' }> => {
            if (!account?.address) {
                throw new Error('No wallet address available');
            }

            if (!authenticated) {
                throw new Error(
                    'Fiat on-ramp requires signing in with a social login ' +
                        '(Google, email, etc.) — a connected wallet alone is not sufficient.',
                );
            }

            setIsBuying(true);
            setError(null);

            try {
                const result = await addFunds({
                    destination: {
                        address: account.address,
                        chain: `eip155:${network.type === 'main' ? '100009' : '100010'}`,
                        asset: '0x0000000000000000000000000000000000000000',
                    },
                    fiat: {
                        source: {
                            assets: [params.currency ?? fiatOnramp?.defaultFiat ?? 'usd'],
                            defaultAsset: params.currency ?? fiatOnramp?.defaultFiat ?? 'usd',
                        },
                        environment: fiatOnramp?.environment ?? 'production',
                        defaultAmount: params.amount ?? fiatOnramp?.defaultAmount ?? '50',
                    },
                });

                if (result.method === 'fiat') {
                    return { status: result.status };
                }

                return { status: 'confirmed' };
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Purchase failed');
                setError(error);
                throw error;
            } finally {
                setIsBuying(false);
            }
        },
        [account?.address, fiatOnramp, network.type, addFunds, authenticated],
    );

    return { buyCrypto, isBuying, error };
};
