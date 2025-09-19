import { useQuery } from '@tanstack/react-query';
import { EstimationResponse } from '@/types/gasEstimation';
import { EnhancedClause, GasTokenType } from '@/types';
import { useSmartAccount, useWallet, estimateGas, useSmartAccountVersion, SmartAccountReturnType, useBuildClauses } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';

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
    const { data: smartAccountVersion } = useSmartAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const { feeDelegation } = useVeChainKitConfig();
    const { buildClausesWithAuth } = useBuildClauses();

    // Setup parmameters to pass to the useBuildClauses hook, this will build the executeWithAuthorization or executeBatchWithAuthorization clauses
    const params = {
        clauses,
        smartAccount: smartAccount as SmartAccountReturnType,
        version: smartAccountVersion,
    }
    const queryKey = ['gas-estimation', JSON.stringify(clauses)];
    return useQuery<EstimationResponse, Error>({
        queryKey,
        queryFn: async () => {
            const clausesWithAuth = await buildClausesWithAuth(params);
            // Then estimate gas using the newly built clauses with authorization
            const estimation = await estimateGas(
                smartAccount?.address ?? '',
                feeDelegation?.genericDelegatorUrl ?? '',
                clausesWithAuth as TransactionClause[],
                token as GasTokenType,
                'medium',
            );
            return estimation;
        },
        enabled: enabled && clauses.length > 0 && !!smartAccount?.address && !!feeDelegation?.genericDelegatorUrl,
        staleTime: 30 * 1000, // 30s
        gcTime: 5 * 60 * 1000, // 5m
        retry: 1,
        retryDelay: 1000,
    });
};