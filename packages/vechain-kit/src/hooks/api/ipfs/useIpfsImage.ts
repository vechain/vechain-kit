import { convertUriToUrl, resolveMediaTypeFromMimeType } from '@/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { NFTMediaType } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

export interface IpfsImage {
    image: string;
    mime: string;
    mediaType: NFTMediaType;
}
export const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10MB

/**
 * Fetches NFT media from IPFS
 * @param networkType - The network type
 * @param uri - The IPFS URI of the NFT media
 * @returns The NFT media
 */
export const getIpfsImage = async (
    networkType: NETWORK_TYPE,
    uri?: string,
): Promise<IpfsImage> => {
    if (!uri) throw new Error('IPFS URI is required');

    const response = await fetch(convertUriToUrl(uri, networkType) ?? '', {
        headers: {
            'X-Project-Id': 'vechain-kit',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Check if the MIME type is allowed
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp',
        'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(blob.type)) {
        throw new Error(`Unsupported MIME type: ${blob.type}`);
    }

    if (blob.size > MAX_IMAGE_SIZE) {
        throw new Error('Image size exceeds maximum allowed size');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            resolve({
                image: reader.result as string,
                mime: blob.type,
                mediaType: resolveMediaTypeFromMimeType(blob.type),
            });
        };
        reader.onerror = () => {
            reject(Error('Error occurred while reading blob.'));
        };
    });
};

/**
 * @param networkType - The network type
 * @param imageIpfsUri - The IPFS URI of the NFT media
 * @returns The NFT media
 */
export const getIpfsImageQueryKey = (
    networkType: NETWORK_TYPE,
    imageIpfsUri?: null | string,
) => ['VECHAIN_KIT', 'IPFS_IMAGE', networkType, imageIpfsUri];

/**
 * Hook to fetch NFT media from IPFS
 * @param imageIpfsUri - The IPFS URI of the NFT media
 * @returns The NFT media
 */
export const useIpfsImage = (imageIpfsUri?: null | string) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getIpfsImageQueryKey(network.type, imageIpfsUri),
        queryFn: () => getIpfsImage(network.type, imageIpfsUri!),
        enabled: !!imageIpfsUri && !!network.type,
        staleTime: Infinity,
    });
};

/**
 * Custom hook to fetch a list of IPFS images.
 *
 * @param imageIpfsUriList - An array of IPFS URIs for the images.
 * @returns An array of queries for each IPFS image URI.
 */
export const useIpfsImageList = (imageIpfsUriList: string[]) => {
    const { network } = useVeChainKitConfig();

    return useQueries({
        queries: imageIpfsUriList.map((imageIpfsUri) => ({
            queryKey: getIpfsImageQueryKey(network.type, imageIpfsUri),
            queryFn: () => getIpfsImage(network.type, imageIpfsUri),
            enabled: !!imageIpfsUri && !!network.type,
            staleTime: Infinity,
        })),
    });
};
