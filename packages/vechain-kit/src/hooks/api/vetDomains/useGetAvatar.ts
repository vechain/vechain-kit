import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { getAvatarLegacy } from './useGetAvatarLegacy';
import { NETWORK_TYPE } from '@/config/network';

/**
 * API function to fetch avatar for a VET domain using the vet.domains API
 * @param name - The VET domain name
 * @returns The avatar URL from the API
 */
export const getAvatar = async (name: string): Promise<string | null> => {
    if (!name) throw new Error('Name is required');

    try {
        const response = await fetch(`https://vet.domains/api/avatar/${name}`);

        if (!response.ok) {
            return null;
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return null;
    }
};

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
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    const avatarQuery = useQuery({
        queryKey: getAvatarQueryKey(name ?? '', network.type),
        queryFn: async () => {
            if (!name) return null;

            // The vet.domains API is only available on the mainnet
            return network.type === 'main'
                ? getAvatar(name)
                : getAvatarLegacy(network.type, nodeUrl, name);
        },
        enabled: !!name,
    });

    return avatarQuery;
};
