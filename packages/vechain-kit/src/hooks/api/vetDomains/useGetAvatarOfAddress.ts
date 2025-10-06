import { useQuery } from '@tanstack/react-query';
import { getPicassoImage } from '@/utils';
import { getAddressDomain, getAvatar } from '@vechain/contract-getters';
import { useVeChainKitConfig } from '@/providers';

export const getAvatarOfAddressQueryKey = (address?: string) => [
    'VECHAIN_KIT',
    'VET_DOMAINS',
    'AVATAR_OF_ADDRESS',
    address,
];

/**
 * Hook to fetch the avatar for an address by first getting their domains
 * and then fetching the avatar for the first domain found
 * @param address The owner's address
 * @returns The avatar URL for the address's primary domain
 */
export const useGetAvatarOfAddress = (address?: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAvatarOfAddressQueryKey(address),
        queryFn: async () => {
            if (!address || !network.nodeUrl) return getPicassoImage(address ?? '');

            const addressDomain = await getAddressDomain(address, {
                networkUrl: network.nodeUrl,
            });
            if (!addressDomain) return getPicassoImage(address ?? '');

            const avatar = await getAvatar(address, {
                networkUrl: network.nodeUrl,
            });
            if (!avatar) return getPicassoImage(address ?? '');
            return avatar;

        },
        enabled:
            !!address &&
            !!network.nodeUrl,
    });
};
