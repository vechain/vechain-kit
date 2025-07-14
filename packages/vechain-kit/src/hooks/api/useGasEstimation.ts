import { useQuery } from '@tanstack/react-query';
import { createGasEstimationService } from '@/services/api';
import { EstimationResponse } from '@/types/GasEstimation';
import { EnhancedClause } from '@/types';
import { GENERIC_DELEGATOR_URL } from '@/utils/constants';

export interface UseGasEstimationParams {
    clauses: EnhancedClause[];
    enabled?: boolean;
}

export const useGasEstimation = ({
    clauses,
    enabled = true,
}: UseGasEstimationParams) => {
    const queryKey = ['gas-estimation', JSON.stringify(clauses)];

    return useQuery<EstimationResponse, Error>({
        queryKey,
        queryFn: async () => {
            const service = createGasEstimationService(
                GENERIC_DELEGATOR_URL,
                false, // don't use mock
            );

            return service.estimateGas(clauses);
        },
        enabled: enabled && clauses.length > 0,
        staleTime: 30 * 1000, // 30s
        gcTime: 5 * 60 * 1000, // 5m
        retry: 1,
        retryDelay: 1000,
    });
};
