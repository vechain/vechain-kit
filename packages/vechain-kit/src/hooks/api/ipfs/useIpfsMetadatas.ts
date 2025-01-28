import { useQueries } from '@tanstack/react-query';
import { getIpfsMetadata, getIpfsMetadataQueryKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

/**
 * Fetches metadatas from IPFS for given URIs
 * @param ipfsUris - The IPFS URIs
 * @returns The metadata from IPFS for each URI
 */
export const useIpfsMetadatas = <T>(ipfsUris: string[], parseJson = false) => {
    const { network } = useVeChainKitConfig();

    return useQueries({
        queries: ipfsUris.map((uri) => ({
            queryKey: getIpfsMetadataQueryKey(network.type, uri),
            queryFn: async () => {
                return getIpfsMetadata<T>(network.type, uri, parseJson);
            },
            enabled: !!uri && !!network.type,
        })),
    });
};
