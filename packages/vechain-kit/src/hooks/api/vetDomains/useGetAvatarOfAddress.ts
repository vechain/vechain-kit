import { useQuery } from '@tanstack/react-query';
import { useGetAvatar } from './useGetAvatar';
import { getPicassoImage } from '@/utils';
import { useVechainDomain } from './useVechainDomain';

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
    // First, get all domains for this address
    const domainsQuery = useVechainDomain(address);

    // Then, get the avatar for the first domain
    const primaryDomain = domainsQuery.data?.domain;
    const avatarQuery = useGetAvatar(primaryDomain ?? '');

    return useQuery({
        queryKey: getAvatarOfAddressQueryKey(address),
        queryFn: async () => {
            if (!address) return getPicassoImage(address ?? '');

            // Wait for domains to be fetched
            const domains = await domainsQuery.refetch();
            if (!domains.data?.domain) return getPicassoImage(address);

            if (avatarQuery.data) return avatarQuery.data;

            return getPicassoImage(address);
        },
        enabled: !!address && domainsQuery.isSuccess && avatarQuery.isSuccess,
        // Use the same caching strategy as the avatar query
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
