import { useQuery } from '@tanstack/react-query';
import { convertUriToUrl } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Fetches metadata from IPFS for a given URI
 *
 * @param networkType - The network type
 * @param uri - The IPFS URI
 * @param parseJson - Whether to parse the JSON
 * @returns The metadata
 */
export const getIpfsMetadata = async <T>(
    networkType: NETWORK_TYPE,
    uri?: string,
    parseJson = false,
): Promise<T> => {
    if (!uri) throw new Error('No URI provided');
    const newUri = convertUriToUrl(uri, networkType);
    if (!newUri) throw new Error('Invalid URI');

    const response = await fetch(newUri, {
        headers: {
            'x-project-id': 'vechain-kit',
        },
    });
    const data = await response.text();

    if (parseJson) return JSON.parse(data);

    return data as unknown as T;
};

export const getIpfsMetadataQueryKey = (
    networkType: NETWORK_TYPE,
    ipfsUri?: string,
) => ['VECHAIN_KIT', 'IPFS_METADATA', networkType, ipfsUri];

/**
 * Fetches metadata from IPFS for a given URI
 * @param ipfsUri - The IPFS URI
 * @returns The metadata from IPFS
 */
export const useIpfsMetadata = <T>(ipfsUri?: string, parseJson = false) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getIpfsMetadataQueryKey(network.type, ipfsUri),
        queryFn: () => getIpfsMetadata<T>(network.type, ipfsUri, parseJson),
        enabled: !!ipfsUri && !!network.type,
        staleTime: Infinity,
    });
};
