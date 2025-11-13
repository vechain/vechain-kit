import { useQuery } from '@tanstack/react-query';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { getIsPerson } from '@vechain/contract-getters';

/**
 * Returns the query key for fetching the isPerson status.
 * @param user - The user address.
 * @param networkType - The network type.
 * @returns The query key for fetching the isPerson status.
 */
export const getIsPersonQueryKey = (user: string, networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT',
    'IS_PERSON',
    user,
    networkType,
];

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @returns The isPerson status.
 */
export const useIsPerson = (user?: string | null) => {
    const { network } = useVeChainKitConfig();

    return useQuery<boolean>({
        queryKey: getIsPersonQueryKey(user ?? '', network.type),
        queryFn: async () => {
            if (!user) throw new Error('User address is required');

            return getIsPerson(user, {
                networkUrl: network.nodeUrl,
            });
        },
        enabled: !!user && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || 
                    errorMessage.includes('abort') ||
                    errorMessage === 'user address is required') {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
