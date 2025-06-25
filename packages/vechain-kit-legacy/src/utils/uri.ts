import { NETWORK_TYPE } from '@/config/network';
import { validateIpfsUri } from './ipfs';
import { getConfig } from '@/config';

/**
 * Convert a URI to a URL
 * We support both IPFS and Arweave URIs. Both should be converted to their https gateway URLs.
 * All other URIs should pass through unchanged.
 *
 * @param uri
 */
export const convertUriToUrl = (uri: string, networkType: NETWORK_TYPE) => {
    // if it is a data uri just return it
    if (uri.startsWith('data:')) return uri;

    const splitUri = uri?.split('://');
    if (splitUri.length !== 2) return null;
    // if (splitUri.length !== 2) throw new Error(`Invalid URI ${uri}`);

    const protocol = splitUri?.[0]?.trim();
    const uriWithoutProtocol = splitUri[1];

    switch (protocol) {
        case 'ipfs':
            if (!validateIpfsUri(uri))
                throw new Error(`Invalid IPFS URI ${uri}`);

            // Check cache for IPFS document
            return `${
                getConfig(networkType).ipfsFetchingService
            }/${uriWithoutProtocol}`;

        case 'ar':
            return `https://arweave.net/${uriWithoutProtocol}`;

        default:
            return uri;
    }
};
