import { useQueries } from '@tanstack/react-query';
import { getIpfsMetadata, getIpfsMetadataQueryKey } from './useIpfsMetadata';
import { useVeChainKitConfig } from '../../../providers';

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
            retry: (failureCount: number, error: Error) => {
                // Don't retry on cancellation or validation errors
                if (error instanceof Error) {
                    const errorMessage = error.message.toLowerCase();
                    if (errorMessage.includes('cancel') || 
                        errorMessage.includes('abort') ||
                        errorMessage === 'no uri provided' ||
                        errorMessage === 'invalid uri') {
                        return false;
                    }
                }
                // Retry network errors up to 2 times
                return failureCount < 2;
            },
            staleTime: Infinity,
        })),
    });
};
