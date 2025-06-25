import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../api/wallet/useWallet';
import {
    getSmartAccountQueryKey,
    getVersionQueryKey,
    getIsDeployedQueryKey,
} from '@/hooks';

/**
 * Hook to refresh smart account-related queries
 * @returns Object with refresh function
 */
export const useRefreshSmartAccountQueries = () => {
    const queryClient = useQueryClient();
    const { smartAccount } = useWallet();

    const refresh = async () => {
        const smartAccountAddress = smartAccount?.address ?? '';

        // First cancel all queries
        await Promise.all([
            // Smart account basic info
            queryClient.cancelQueries({
                queryKey: getSmartAccountQueryKey(smartAccountAddress),
            }),
            queryClient.cancelQueries({
                queryKey: getVersionQueryKey(smartAccountAddress),
            }),
            queryClient.cancelQueries({
                queryKey: getIsDeployedQueryKey(smartAccountAddress),
            }),
        ]);

        // Then refetch all queries
        await Promise.all([
            // Smart account basic info
            queryClient.refetchQueries({
                queryKey: getSmartAccountQueryKey(smartAccountAddress),
            }),
            queryClient.refetchQueries({
                queryKey: getVersionQueryKey(smartAccountAddress),
            }),
            queryClient.refetchQueries({
                queryKey: getIsDeployedQueryKey(smartAccountAddress),
            }),
        ]);
    };

    return { refresh };
};
