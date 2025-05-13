import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig, VechainKitProviderProps } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { getAvatarLegacy } from './useGetAvatarLegacy';

/**
 * API function to fetch avatar for a VET domain using the vet.domains API
 * @param name - The VET domain name
 * @param networkType - The network type
 * @returns The avatar URL from the API
 */
export const getAvatar = async (
    name: string,
    network: VechainKitProviderProps['network'],
): Promise<string | null> => {
    if (!name) throw new Error('Name is required');

    const result =
        (await fetchAvatar(name, network)) ||
        (await fetchAvatarDirectly(name, network));
    if (!result) return null;

    if (result instanceof Blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
        });
    }

    // If the result is not a Blob, it's already a string
    return result;
};

// Fetch the avatar from the vet.domains API
const fetchAvatar = async (
    name: string,
    network: VechainKitProviderProps['network'],
): Promise<Blob | null> => {
    try {
        const response = await fetch(
            `${getConfig(network.type).vetDomainAvatarUrl}/${name}`,
        );

        if (response.ok) {
            return response.blob();
        }
    } catch (error) {
        console.error('Error fetching avatar:', error);
    }
    return null;
};

// Fetch the avatar from the legacy API, in case the vet.domains API fails
const fetchAvatarDirectly = async (
    name: string,
    network: VechainKitProviderProps['network'],
): Promise<string | null> => {
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;
    if (!nodeUrl) return null;

    const avatar = await getAvatarLegacy(network.type, nodeUrl, name);
    if (!avatar) return null;

    return avatar;
};

export const getAvatarQueryKey = (name: string, networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT_DOMAIN',
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

            return getAvatar(name, network);
        },
        enabled: !!name && !!network.type,
    });

    return avatarQuery;
};
