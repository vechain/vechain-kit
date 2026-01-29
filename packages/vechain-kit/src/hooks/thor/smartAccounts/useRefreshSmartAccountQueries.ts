import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../../api/wallet/useWallet';
// Direct imports to avoid circular dependencies
import { getSmartAccountQueryKey } from './useSmartAccount';
import { getIsDeployedQueryKey } from './useIsSmartAccountDeployed';

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
                queryKey: getIsDeployedQueryKey(smartAccountAddress),
            }),
        ]);
    };

    return { refresh };
};
