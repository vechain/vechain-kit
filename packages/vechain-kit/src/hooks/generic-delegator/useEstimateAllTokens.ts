import { useQuery } from '@tanstack/react-query';
import { GasTokenType } from '@/types';
import {
    useSmartAccount,
    useWallet,
    estimateGas,
    useGetAccountVersion,
    computeCorrectedTotalGasNoFeePayer,
    convertGasToGasTokenAmount,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { getConfig } from '@/config';

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
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { feeDelegation, network } = useVeChainKitConfig();
    const thor = ThorClient.at(getConfig(network.type).nodeUrl);

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

            // Local gas estimate is token-agnostic — compute once,
            // bounded by a timeout so a slow node can't hang the UI.
            const totalGasNoFeePayer = await computeCorrectedTotalGasNoFeePayer({
                thor,
                clauses,
                smartAccountAddress: smartAccount?.address ?? '',
                version: smartAccountVersion?.version ?? 0,
            });

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
                        const correctedCost =
                            totalGasNoFeePayer !== null
                                ? convertGasToGasTokenAmount({
                                      totalGasNoFeePayer,
                                      gasToken: token,
                                      estimationResponse: estimation,
                                  })
                                : (estimation.transactionCost ?? 0) * 2;
                        estimates[token] = {
                            cost: correctedCost || 0,
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
