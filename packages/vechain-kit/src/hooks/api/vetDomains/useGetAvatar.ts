import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
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
    });

    return avatarQuery;
};
