import { useQuery } from '@tanstack/react-query';
import { EstimationResponse } from '@/types/GasEstimation';
import { EnhancedClause, GasTokenType } from '@/types';
import { useClauseBuilder, useSmartAccount, useWallet, estimateGas } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

export interface UseGasEstimationParams {
    clauses: EnhancedClause[];
    enabled?: boolean;
    token: string;
}

export const useGasEstimation = ({
    clauses,
    enabled = true,
    token,
}: UseGasEstimationParams) => {
    const { connectedWallet } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { buildClausesWithAuth } = useClauseBuilder();
    const { genericDelegator } = useVeChainKitConfig();
    const queryKey = ['gas-estimation', JSON.stringify(clauses)];
    return useQuery<EstimationResponse, Error>({
        queryKey,
        queryFn: async () => {
            // Get the clause parameters first
            const clauseParams = await buildClausesWithAuth(clauses);
            
            // Then estimate gas using the parameters
            const estimation = await estimateGas(
                clauseParams.verifyingContract,
                genericDelegator?.delegatorUrl ?? '',
                clauseParams.clauses as unknown as EnhancedClause[],
                token as GasTokenType,
                'regular',
            );
            return estimation;
        },
        enabled: enabled && clauses.length > 0 && !!smartAccount?.address && !!genericDelegator?.delegatorUrl,
        staleTime: 30 * 1000, // 30s
        gcTime: 5 * 60 * 1000, // 5m
        retry: 1,
        retryDelay: 1000,
    });
};