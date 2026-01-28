import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';
import { NETWORK_TYPE } from '../../../config/network';
import { getAvatar  } from '@vechain/contract-getters';

export const getAvatarQueryKey = (name: string, networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT',
    'VET_DOMAINS',
    'AVATAR',
    name,
    networkType,
];

/**
 * Hook to fetch the avatar URL for a VET domain name
 * @param name - The VET domain name
 * @returns The resolved avatar URL
 */
export const useGetAvatar = (name: string) => {
    const { network } = useVeChainKitConfig();

    const avatarQuery = useQuery({
        queryKey: getAvatarQueryKey(name ?? '', network.type),
        queryFn: async () => {
            if (!name) return null;

            return getAvatar(name, {
                networkUrl: network.nodeUrl,
            });
        },
        enabled: !!name && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });

    return avatarQuery;
};
