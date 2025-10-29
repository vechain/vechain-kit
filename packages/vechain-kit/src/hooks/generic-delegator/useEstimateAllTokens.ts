import { useQuery } from '@tanstack/react-query';
import { GasTokenType } from '@/types';
import { useSmartAccount, useWallet, estimateGas } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';

export interface UseEstimateAllTokensParams {
    clauses: TransactionClause[];
    tokens: GasTokenType[];
    enabled?: boolean;
}

export const useEstimateAllTokens = ({
    clauses,
    tokens,
    enabled = true,
}: UseEstimateAllTokensParams) => {
    const { connectedWallet } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { feeDelegation } = useVeChainKitConfig();

    return useQuery({
        queryKey: [
            'gas-estimation-all-tokens',
            JSON.stringify(clauses),
            JSON.stringify(tokens),
        ],
        queryFn: async () => {
            const estimates: Record<
                GasTokenType,
                { cost: number; loading: boolean; error?: string }
            > = {} as any;

            await Promise.all(
                tokens.map(async (token) => {
                    try {
                        const estimation = await estimateGas(
                            smartAccount?.address ?? '',
                            feeDelegation?.genericDelegatorUrl ?? '',
                            clauses,
                            token,
                            'medium',
                        );
                        estimates[token] = {
                            cost: estimation.transactionCost || 0,
                            loading: false,
                        };
                    } catch (error) {
                        estimates[token] = {
                            cost: 0,
                            loading: false,
                            error:
                                error instanceof Error
                                    ? error.message
                                    : 'Unknown error',
                        };
                    }
                }),
            );

            return estimates;
        },
        enabled:
            enabled &&
            clauses.length > 0 &&
            !!smartAccount?.address &&
            !!feeDelegation?.genericDelegatorUrl &&
            tokens.length > 0,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
};
