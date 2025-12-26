import { useQuery } from '@tanstack/react-query';
import { getPicassoImage } from '@/utils';
import { getAddressDomain, getAvatar } from '@vechain/contract-getters';
import { useVeChainKitConfig } from '@/providers';
import { getLocalStorageItem } from '@/utils/ssrUtils';
import { CrossAppConnectionCache } from '@/types';
import { VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL } from '@/utils/urls';

/**
 * Avatar resolution priority:
 * 1. Avatar from VET domain (if address has a domain with avatar set)
 * 2. Cross-app avatar (if user is connected via cross-app and no domain avatar exists)
 * 3. Picasso generated image (fallback)
 *
 * Cross-app avatars are app-specific defaults used when a user connects via
 * the VeChain cross-app ecosystem (e.g., Mugshot, Greencart, Cleanify, EVearn)
 * and doesn't have a custom avatar set on their domain.
 */

const CROSSAPP_AVATAR_MAP: Record<string, string> = {
    Mugshot:
        `${VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL}/mugshot.png`,
    Greencart:
        `${VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL}/greencart.png`,
    Cleanify:
        `${VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL}/cleanify.png`,
    EVearn: `${VECHAIN_KIT_DOCS_IMAGES_BUCKET_BASE_URL}/evearn.png`,
};

const CACHE_KEY = 'vechain_kit_cross_app_connection';

const getCrossAppAvatar = (): string | null => {
    const cached = getLocalStorageItem(CACHE_KEY);
    if (!cached) return null;

    try {
        const connectionCache = JSON.parse(cached) as CrossAppConnectionCache;
        const appName = connectionCache?.ecosystemApp?.name;
        if (!appName) return null;
        return CROSSAPP_AVATAR_MAP[appName] ?? null;
    } catch {
        return null;
    }
};

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
            if (!address || !network.nodeUrl) {
                const crossAppAvatar = getCrossAppAvatar();
                return crossAppAvatar ?? getPicassoImage(address ?? '');
            }

            const addressDomain = await getAddressDomain(address, {
                networkUrl: network.nodeUrl,
            });
            if (!addressDomain) {
                const crossAppAvatar = getCrossAppAvatar();
                return crossAppAvatar ?? getPicassoImage(address ?? '');
            }

            const avatar = await getAvatar(addressDomain, {
                networkUrl: network.nodeUrl,
            });
            if (!avatar) {
                const crossAppAvatar = getCrossAppAvatar();
                return crossAppAvatar ?? getPicassoImage(address ?? '');
            }
            return avatar;
        },
        enabled: !!address && !!network.nodeUrl,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (
                    errorMessage.includes('cancel') ||
                    errorMessage.includes('abort')
                ) {
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
