import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getXAppsMetadataBaseUri } from '../getXAppsMetadataBaseUri';
import { useVeChainKitConfig } from '@/providers';

export const getXAppsMetadataBaseUriQueryKey = () => [
    'VECHAIN_KIT',
    'xApps',
    'metadata',
    'baseUri',
];

/**
 *  Hook to get the baseUri of the xApps metadata
 * @returns the baseUri of the xApps metadata
 */
export const useXAppsMetadataBaseUri = () => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppsMetadataBaseUriQueryKey(),
        queryFn: async () => await getXAppsMetadataBaseUri(thor, network.type),
        enabled: !!thor && !!network.type,
        staleTime: 1000 * 60 * 60, // 1 hour,
    });
};
