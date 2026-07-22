# VeChain Kit — Data hooks, domains, NFTs, swaps, and staking

Query-backed wallet data, tokens and balances, VET domains, NFTs, IPFS, transfer history, swap integrations, StarGate and related staking positions.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `packages/vechain-kit/src/hooks/api/ipfs/useIpfsImage.ts`

````typescript
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
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') ||
                    errorMessage.includes('abort') ||
                    errorMessage === 'ipfs uri is required') {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
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
            retry: (failureCount: number, error: Error) => {
                // Don't retry on cancellation or validation errors
                if (error instanceof Error) {
                    const errorMessage = error.message.toLowerCase();
                    if (errorMessage.includes('cancel') ||
                        errorMessage.includes('abort') ||
                        errorMessage === 'ipfs uri is required') {
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
````

## Source: `packages/vechain-kit/src/hooks/api/ipfs/useIpfsMetadata.ts`

````typescript
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
            'X-Project-Id': 'vechain-kit',
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
        retry: (failureCount, error) => {
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
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/ipfs/useIpfsMetadatas.ts`

````typescript
import { useQueries } from '@tanstack/react-query';
import { getIpfsMetadata, getIpfsMetadataQueryKey } from './useIpfsMetadata';
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
````

## Source: `packages/vechain-kit/src/hooks/api/ipfs/useSingleImageUpload.ts`

````typescript
import { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { imageCompressionOptions, UploadedImage } from './useUploadImages';

type Props = {
    compressImage?: boolean;
    defaultImage?: UploadedImage;
};
/**
 *  Hook to handle image uploads and compressions in a dropzone
 * @param param0  compressImags: boolean to indicate if the image should be compressed (default: true)
 * @param param1  defaultImage: default image to be displayed
 * @returns   uploaded image, setUploadedImage: function to set the uploaded image, onDrop: function to handle the drop event
 */

export const useSingleImageUpload = ({
    compressImage,
    defaultImage,
}: Props) => {
    const [uploadedImage, setUploadedImage] = useState<
        UploadedImage | undefined
    >(defaultImage);

    useEffect(() => {
        if (defaultImage) {
            setUploadedImage(defaultImage);
        }
    }, [defaultImage]);

    const onRemove = useCallback(() => setUploadedImage(undefined), []);

    const onUpload = useCallback(
        async (acceptedFile: File) => {
            let parsedFile = acceptedFile;
            if (compressImage) {
                parsedFile = await imageCompression(
                    parsedFile,
                    imageCompressionOptions,
                );
            }

            const image: UploadedImage = {
                file: parsedFile,
                image: URL.createObjectURL(parsedFile),
            };

            setUploadedImage(image);
            return image;
        },
        [compressImage],
    );

    return {
        uploadedImage,
        setUploadedImage,
        onUpload,
        onRemove,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/ipfs/useUploadImages.ts`

````typescript
'use client';
import { useState, useCallback, useEffect } from 'react';
import imageCompression, {
    Options as CompressOptions,
} from 'browser-image-compression';

export const imageCompressionOptions: CompressOptions = {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
};

export const compressImages = async (images: UploadedImage[]) => {
    const compressedImages: File[] = [];
    try {
        for (const image of images) {
            const parsedFile = await imageCompression(
                image.file,
                imageCompressionOptions,
            );

            compressedImages.push(parsedFile);
        }
        return compressedImages;
    } catch (e) {
        console.error('compress error', e);
        throw e;
    }
};

type Props = {
    compressImages?: boolean;
    defaultImages?: UploadedImage[];
};
/**
 *  Hook to handle image uploads and compressions in a dropzone
 * @param param0  compressImages: boolean to indicate if the images should be compressed (default: true)
 * @returns  uploadedImages: array of uploaded images, setUploadedImages: function to set the uploaded images, onDrop: function to handle the drop event
 */

export type UploadedImage = {
    file: File;
    image: string;
};
export const useUploadImages = ({ compressImages, defaultImages }: Props) => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
        defaultImages ?? [],
    );

    useEffect(() => {
        if (defaultImages) {
            setUploadedImages(defaultImages);
        }
    }, [defaultImages]);

    const [invalidDateError, setInvalidDateError] = useState<number[]>([]);

    const onRemove = useCallback(
        (index: number) =>
            setUploadedImages((s) => s.filter((_, i) => i !== index)),
        [],
    );

    const onUpload = useCallback(
        async (acceptedFiles: File[], keepCurrent = true) => {
            setInvalidDateError([]);

            const parsedUploads: UploadedImage[] = [];
            for (const file of acceptedFiles) {
                let parsedFile = file;
                if (compressImages) {
                    parsedFile = await imageCompression(
                        file,
                        imageCompressionOptions,
                    );
                }

                const image: UploadedImage = {
                    file: parsedFile,
                    image: URL.createObjectURL(file),
                };
                parsedUploads.push(image);
            }

            setUploadedImages((s) => [
                ...parsedUploads,
                ...(!keepCurrent
                    ? []
                    : s.filter(
                          (f) =>
                              !parsedUploads.some(
                                  (p) => p.file.name === f.file.name,
                              ),
                      )),
            ]);
        },
        [compressImages],
    );

    return {
        uploadedImages,
        setUploadedImages,
        onUpload,
        onRemove,
        invalidDateError,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/types.ts`

````typescript
export type IndexerNft = {
    id?: string;
    contractAddress: string;
    tokenId: string;
    owner?: string;
    txId?: string;
    blockNumber?: number;
    blockId?: string;
    blockTimestamp?: number;
};

export type OwnedNft = {
    id: string;
    collectionAddress: string;
    tokenId: string;
    lastTransferTimestamp?: number;
    lastTransferTxId?: string;
};

export type NftAttribute = {
    trait_type?: string;
    value?: string | number | boolean;
    display_type?: string;
};

export type NftMetadata = {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    animation_url?: string;
    attributes?: NftAttribute[];
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/useNftBlacklist.ts`

````typescript
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';

const blacklistAbi = [
    {
        type: 'function',
        name: 'isBlacklisted',
        stateMutability: 'view',
        inputs: [{ type: 'address', name: 'nft' }],
        outputs: [{ type: 'bool' }],
    },
] as const;

export const getNftBlacklistQueryKey = (
    networkType: string,
    blacklistAddress?: string,
    collections?: string[],
) => [
    'VECHAIN_KIT',
    'NFT_BLACKLIST',
    networkType,
    blacklistAddress?.toLowerCase() ?? null,
    collections ? [...collections].sort().join(',') : '',
];

/**
 * Reads `isBlacklisted(address)` on the on-chain blacklist contract for each
 * unique collection. Returns a Set of lowercased collection addresses that are
 * blacklisted. If the network has no blacklist contract configured, returns
 * an empty Set (everything passes).
 */
export const useNftBlacklist = (collectionAddresses: string[]) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const blacklistAddress = config.nftBlacklistContractAddress;

    const uniqueCollections = useMemo(() => {
        const set = new Set<string>();
        for (const addr of collectionAddresses) {
            if (addr) set.add(addr.toLowerCase());
        }
        return Array.from(set);
    }, [collectionAddresses]);

    const enabled =
        !!thor && !!blacklistAddress && uniqueCollections.length > 0;

    const query = useQuery({
        queryKey: getNftBlacklistQueryKey(
            network.type,
            blacklistAddress,
            uniqueCollections,
        ),
        enabled,
        staleTime: 5 * 60_000,
        queryFn: async (): Promise<Set<string>> => {
            if (!blacklistAddress || !uniqueCollections.length) {
                return new Set();
            }

            const results = await executeMultipleClausesCall({
                thor,
                calls: uniqueCollections.map((collection) => ({
                    abi: blacklistAbi,
                    functionName: 'isBlacklisted' as const,
                    address: blacklistAddress as `0x${string}`,
                    args: [collection as `0x${string}`] as const,
                })),
            });

            const blacklisted = new Set<string>();
            results.forEach((r, i) => {
                const flag = Array.isArray(r) ? r[0] : r;
                if (flag === true) {
                    blacklisted.add(uniqueCollections[i]);
                }
            });
            return blacklisted;
        },
    });

    return {
        blacklist: query.data ?? new Set<string>(),
        isLoading: query.isLoading,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/useNftCollectionName.ts`

````typescript
import { useMemo } from 'react';
import { useCallClause } from '@/hooks/utils/useCallClause';

const erc721NameAbi = [
    {
        type: 'function',
        name: 'name',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'string' }],
    },
] as const;

/**
 * Reads ERC721 `name()` for a collection. Returns undefined while loading or
 * if the contract doesn't implement it (some collections don't).
 */
export const useNftCollectionName = (collectionAddress?: string) => {
    const enabled = !!collectionAddress;

    const { data, isLoading, error } = useCallClause({
        abi: erc721NameAbi,
        address: (collectionAddress ?? '') as `0x${string}`,
        method: 'name' as const,
        args: [] as const,
        queryOptions: {
            enabled,
            staleTime: Infinity,
            retry: (failureCount, e) =>
                !(e instanceof Error &&
                    e.message?.toLowerCase().includes('reverted')) &&
                failureCount < 1,
        },
    });

    const name = useMemo(() => {
        if (!data) return undefined;
        const raw = Array.isArray(data) ? (data[0] as string) : (data as unknown as string);
        return raw || undefined;
    }, [data]);

    return { name, isLoading, error };
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/useNftMetadata.ts`

````typescript
import { useMemo } from 'react';
import { useCallClause } from '@/hooks/utils/useCallClause';
import { useIpfsMetadata } from '@/hooks/api/ipfs/useIpfsMetadata';
import { NftMetadata } from './types';

const erc721TokenURIAbi = [
    {
        type: 'function',
        name: 'tokenURI',
        stateMutability: 'view',
        inputs: [{ type: 'uint256', name: 'tokenId' }],
        outputs: [{ type: 'string' }],
    },
] as const;

/**
 * Resolves the on-chain `tokenURI` for an ERC721 token, then fetches & parses
 * its JSON metadata from IPFS (or any HTTP gateway).
 */
export const useNftMetadata = (
    collectionAddress?: string,
    tokenId?: string,
) => {
    const enabled = !!collectionAddress && !!tokenId;

    const {
        data: tokenURIResult,
        isLoading: isLoadingUri,
        error: uriError,
    } = useCallClause({
        abi: erc721TokenURIAbi,
        address: (collectionAddress ?? '') as `0x${string}`,
        method: 'tokenURI' as const,
        args: [BigInt(tokenId ?? '0')] as const,
        queryOptions: {
            enabled,
            staleTime: Infinity,
            retry: (failureCount, error) =>
                !(error instanceof Error &&
                    error.message?.toLowerCase().includes('reverted')) &&
                failureCount < 2,
        },
    });

    const tokenURI = useMemo(() => {
        if (!tokenURIResult) return undefined;
        const raw = Array.isArray(tokenURIResult)
            ? (tokenURIResult[0] as string)
            : (tokenURIResult as unknown as string);
        return raw || undefined;
    }, [tokenURIResult]);

    const {
        data: metadata,
        isLoading: isLoadingMetadata,
        error: metadataError,
    } = useIpfsMetadata<NftMetadata>(tokenURI, true);

    return {
        tokenURI,
        metadata,
        isLoading: isLoadingUri || (!!tokenURI && isLoadingMetadata),
        error: uriError ?? metadataError ?? null,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/useOwnedNfts.ts`

````typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { IndexerNft, OwnedNft } from './types';

type IndexerResponse = {
    data: IndexerNft[];
    pagination?: { hasNext?: boolean };
};

type OwnedNftsPage = {
    items: OwnedNft[];
    hasNext: boolean;
};

export const getOwnedNftsQueryKey = (
    address?: string,
    networkType?: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'OWNED_NFTS',
    networkType,
    address?.toLowerCase(),
];

/**
 * Lists NFTs owned by an address using the indexer at
 * `GET ${indexerUrl}/nfts?address=<addr>&page=<n>`, returning
 * `{ data: IndexerNft[], pagination?: { hasNext?: boolean } }`.
 */
export const useOwnedNfts = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();

    const indexerUrl = config.indexerUrl;
    const supportsNfts = !!indexerUrl && network.type !== 'solo';

    const query = useInfiniteQuery<OwnedNftsPage, Error>({
        queryKey: getOwnedNftsQueryKey(address, network.type),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        queryFn: async ({ pageParam = 0 }): Promise<OwnedNftsPage> => {
            if (!address) return { items: [], hasNext: false };

            const params = new URLSearchParams({
                address: address.toLowerCase(),
                page: String(pageParam),
            });

            const res = await fetch(
                `${indexerUrl}/nfts?${params.toString()}`,
            );
            if (!res.ok) {
                throw new Error(`Indexer request failed: ${res.status}`);
            }

            const body = (await res.json()) as IndexerResponse;
            const items: OwnedNft[] = (body.data ?? []).map((n) => ({
                id:
                    n.id ??
                    `${(n.contractAddress ?? '').toLowerCase()}:${n.tokenId}`,
                collectionAddress: (n.contractAddress ?? '').toLowerCase(),
                tokenId: String(n.tokenId),
                lastTransferTimestamp: n.blockTimestamp,
                lastTransferTxId: n.txId,
            }));

            return {
                items,
                hasNext: !!body.pagination?.hasNext,
            };
        },
        enabled: !!address && supportsNfts,
        staleTime: 30_000,
    });

    const items: OwnedNft[] = query.data?.pages.flatMap((p) => p.items) ?? [];

    return {
        items,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: !!query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isUnsupportedNetwork: !supportsNfts,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/useOwnedNftsFiltered.ts`

````typescript
import { useMemo } from 'react';
import { useOwnedNfts } from './useOwnedNfts';
import { useNftBlacklist } from './useNftBlacklist';

/**
 * Composes useOwnedNfts + useNftBlacklist: returns the user's NFTs with any
 * collection blacklisted by the on-chain registry removed.
 */
export const useOwnedNftsFiltered = (address?: string) => {
    const owned = useOwnedNfts(address);

    const collectionAddresses = useMemo(
        () => owned.items.map((n) => n.collectionAddress),
        [owned.items],
    );

    const { blacklist, isLoading: isBlacklistLoading } =
        useNftBlacklist(collectionAddresses);

    const visibleItems = useMemo(
        () =>
            owned.items.filter(
                (n) => !blacklist.has(n.collectionAddress.toLowerCase()),
            ),
        [owned.items, blacklist],
    );

    return {
        ...owned,
        items: visibleItems,
        rawItems: owned.items,
        isLoading: owned.isLoading || isBlacklistLoading,
        isBlacklistLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/privy/useFetchAppInfo.ts`

````typescript
import { PrivyAppInfo } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_PRIVY_ECOSYSTEM_APPS } from '@/utils/constants';
import { PRIVY_AUTH_BASE_URL } from '@/constants';

export const fetchPrivyAppInfo = async (
    appId: string,
): Promise<PrivyAppInfo> => {
    const appInfoUrl = new URL(`/api/v1/apps/${appId}`, PRIVY_AUTH_BASE_URL);
    const response = await fetch(appInfoUrl, {
        headers: {
            'privy-app-id': appId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Privy app info');
    }

    return response.json();
};

export const getPrivyAppInfoQueryKey = (appIds: string | string[]) => [
    'VECHAIN_KIT_PRIVY_APP_INFO',
    ...(Array.isArray(appIds) ? appIds : [appIds]),
];

export const useFetchAppInfo = (appIds: string | string[]) => {
    const normalizedIds = Array.isArray(appIds) ? appIds : [appIds];

    return useQuery({
        queryKey: getPrivyAppInfoQueryKey(appIds),
        queryFn: async () => {
            const results = await Promise.all(
                normalizedIds.map((id) => fetchPrivyAppInfo(id)),
            );

            return Object.fromEntries(
                results.map((result, index) => {
                    const id = normalizedIds[index];
                    const defaultApp = DEFAULT_PRIVY_ECOSYSTEM_APPS.find(
                        (app) => app.id === id,
                    );
                    return [
                        id,
                        {
                            ...result,
                            website: defaultApp?.website,
                        },
                    ];
                }),
            );
        },
        enabled: normalizedIds.length > 0,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
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
````

## Source: `packages/vechain-kit/src/hooks/api/privy/useFetchPrivyStatus.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { PRIVY_STATUS_BASE_URL } from '@/constants';

export const fetchPrivyStatus = async (): Promise<string> => {
    try {
        const statusUrl = new URL('summary.json', PRIVY_STATUS_BASE_URL);
        const response = await fetch(statusUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch Privy status');
        }

        const data = await response.json();
        return data.page.status ?? 'No data';
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Error fetching data';
    }
};

export const useFetchPrivyStatus = () => {
    return useQuery({
        queryKey: ['PRIVY_STATUS'],
        queryFn: fetchPrivyStatus,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
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
````

## Source: `packages/vechain-kit/src/hooks/api/staking/abis.ts`

````typescript
export const JuicyPoolAbi = [
    {
        inputs: [],
        name: 'getReservesList',
        outputs: [{ name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'user', type: 'address' }],
        name: 'getUserAccountData',
        outputs: [
            { name: 'totalCollateralBase', type: 'uint256' },
            { name: 'totalDebtBase', type: 'uint256' },
            { name: 'availableBorrowsBase', type: 'uint256' },
            { name: 'currentLiquidationThreshold', type: 'uint256' },
            { name: 'ltv', type: 'uint256' },
            { name: 'healthFactor', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'asset', type: 'address' }],
        name: 'getReserveData',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { name: 'data', type: 'uint256' },
                        ],
                        name: 'configuration',
                        type: 'tuple',
                    },
                    { name: 'liquidityIndex', type: 'uint128' },
                    { name: 'currentLiquidityRate', type: 'uint128' },
                    { name: 'variableBorrowIndex', type: 'uint128' },
                    { name: 'currentVariableBorrowRate', type: 'uint128' },
                    { name: 'currentStableBorrowRate', type: 'uint128' },
                    { name: 'lastUpdateTimestamp', type: 'uint40' },
                    { name: 'id', type: 'uint16' },
                    { name: 'aTokenAddress', type: 'address' },
                    { name: 'stableDebtTokenAddress', type: 'address' },
                    { name: 'variableDebtTokenAddress', type: 'address' },
                    { name: 'interestRateStrategyAddress', type: 'address' },
                    { name: 'accruedToTreasury', type: 'uint128' },
                    { name: 'unbacked', type: 'uint128' },
                    { name: 'isolationModeTotalDebt', type: 'uint128' },
                ],
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export const NavigatorRegistryAbi = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'isNavigator',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'navigator', type: 'address' }],
        name: 'getStake',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'isDelegated',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'getDelegatedAmount',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'getNavigator',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
````

## Source: `packages/vechain-kit/src/hooks/api/staking/useBetterSwapLpPositions.ts`

````typescript
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import { isAddress } from 'viem';
import {
    UniswapV2Factory__factory,
    UniswapV2Pair__factory,
} from '@vechain/vechain-contract-types';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

export type LpPositionToken = {
    address: string;
    symbol: string;
    amount: number;
};

export type LpPosition = {
    pairAddress: string;
    lpBalance: number;
    sharePct: number;
    token0: LpPositionToken;
    token1: LpPositionToken;
    valueUsd: number;
    valueInCurrency: number;
};

type LpRawPosition = Omit<LpPosition, 'valueUsd' | 'valueInCurrency'>;

const ERC20_MINI_ABI = [
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

const usePairList = (factoryAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: ['VECHAIN_KIT', 'BETTERSWAP_PAIRS', network.type, factoryAddress],
        enabled: !!factoryAddress && !!thor,
        // Pair list rarely changes; cache for the session.
        staleTime: 24 * 60 * 60 * 1000,
        queryFn: async (): Promise<string[]> => {
            if (!factoryAddress) return [];
            const factoryAbi = UniswapV2Factory__factory.abi;
            const lenRes = await thor.contracts
                .load(factoryAddress, factoryAbi)
                .read.allPairsLength();
            const length = Number(
                (lenRes as readonly bigint[])[0] ?? lenRes,
            );
            if (!length) return [];

            const indexes = Array.from({ length }, (_, i) => BigInt(i));
            const res = await executeMultipleClausesCall({
                thor,
                calls: indexes.map((i) => ({
                    abi: factoryAbi,
                    functionName: 'allPairs' as const,
                    address: factoryAddress as `0x${string}`,
                    args: [i] as const,
                })),
            });

            return res.map((r) => r as unknown as string);
        },
    });
};

export const useBetterSwapLpPositions = (address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const factoryAddress = config.betterSwapFactoryAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const { data: pairs = [], isLoading: pairsLoading } =
        usePairList(factoryAddress);

    const enabled =
        !!address &&
        isAddress(address) &&
        !!factoryAddress &&
        isAddress(factoryAddress) &&
        !!thor &&
        pairs.length > 0;

    // Fingerprint includes the first and last pair plus the length so two
    // pair sets with the same length still produce distinct cache entries.
    const pairsFingerprint = pairs.length
        ? `${pairs[0]}-${pairs[pairs.length - 1]}-${pairs.length}`
        : 'empty';

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'BETTERSWAP_LP_POSITIONS',
            network.type,
            address?.toLowerCase(),
            pairsFingerprint,
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async (): Promise<LpRawPosition[]> => {
            if (!address || !pairs.length) return [];

            const pairAbi = UniswapV2Pair__factory.abi;
            const validPairs = pairs.filter((p) => isAddress(p));
            if (!validPairs.length) return [];

            const balRes = await executeMultipleClausesCall({
                thor,
                calls: validPairs.map((p) => ({
                    abi: pairAbi,
                    functionName: 'balanceOf' as const,
                    address: p as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                })),
            });

            const ownedIndexes: number[] = [];
            balRes.forEach((r, i) => {
                const bal = r as unknown as bigint;
                if (bal && bal > 0n) ownedIndexes.push(i);
            });

            if (!ownedIndexes.length) return [];

            const detailRes = await executeMultipleClausesCall({
                thor,
                calls: ownedIndexes.flatMap((i) => {
                    const pair = validPairs[i] as `0x${string}`;
                    return [
                        {
                            abi: pairAbi,
                            functionName: 'totalSupply' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'getReserves' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'token0' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'token1' as const,
                            address: pair,
                            args: [] as const,
                        },
                    ];
                }),
            });

            const tokenAddresses = new Set<string>();
            for (let i = 0; i < ownedIndexes.length; i++) {
                const t0 = detailRes[i * 4 + 2] as unknown as string;
                const t1 = detailRes[i * 4 + 3] as unknown as string;
                tokenAddresses.add(t0.toLowerCase());
                tokenAddresses.add(t1.toLowerCase());
            }

            const tokenAddrList = Array.from(tokenAddresses);
            const symbolByAddr = new Map<string, string>();
            if (tokenAddrList.length) {
                const symbolsRes = await executeMultipleClausesCall({
                    thor,
                    calls: tokenAddrList.map((a) => ({
                        abi: ERC20_MINI_ABI,
                        functionName: 'symbol' as const,
                        address: a as `0x${string}`,
                        args: [] as const,
                    })),
                });
                symbolsRes.forEach((r, i) => {
                    const sym = r as unknown as string;
                    symbolByAddr.set(tokenAddrList[i], sym ?? '');
                });
            }

            const rawPositions: LpRawPosition[] = [];
            for (let i = 0; i < ownedIndexes.length; i++) {
                const pairIndex = ownedIndexes[i];
                const pairAddress = validPairs[pairIndex];
                const lpBal = balRes[pairIndex] as unknown as bigint;
                const totalSupply = detailRes[i * 4] as unknown as bigint;
                const reservesTuple = detailRes[
                    i * 4 + 1
                ] as unknown as readonly [bigint, bigint, number];
                const reserve0 = reservesTuple[0];
                const reserve1 = reservesTuple[1];
                const token0Addr = detailRes[i * 4 + 2] as unknown as string;
                const token1Addr = detailRes[i * 4 + 3] as unknown as string;

                const lpBalanceFormatted = Number(formatUnits(lpBal, 18));
                const share =
                    totalSupply > 0n
                        ? Number((lpBal * 1_000_000n) / totalSupply) / 1_000_000
                        : 0;

                const amount0 = Number(formatUnits(reserve0, 18)) * share;
                const amount1 = Number(formatUnits(reserve1, 18)) * share;

                rawPositions.push({
                    pairAddress,
                    lpBalance: lpBalanceFormatted,
                    sharePct: share * 100,
                    token0: {
                        address: token0Addr,
                        symbol:
                            symbolByAddr.get(token0Addr.toLowerCase()) ?? '',
                        amount: amount0,
                    },
                    token1: {
                        address: token1Addr,
                        symbol:
                            symbolByAddr.get(token1Addr.toLowerCase()) ?? '',
                        amount: amount1,
                    },
                });
            }

            return rawPositions;
        },
    });

    // USD/currency derived from live prices so a late-arriving price query
    // repopulates values without re-running the on-chain query.
    const positions = useMemo<LpPosition[]>(() => {
        const raw = query.data ?? [];
        return raw.map((p) => {
            const price0 = prices[p.token0.address.toLowerCase()] || 0;
            const price1 = prices[p.token1.address.toLowerCase()] || 0;
            const valueUsd =
                p.token0.amount * price0 + p.token1.amount * price1;
            return {
                ...p,
                valueUsd,
                valueInCurrency: convertToSelectedCurrency(
                    valueUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                ),
            };
        });
    }, [query.data, prices, currentCurrency, exchangeRates]);

    const totalValueUsd = positions.reduce((acc, p) => acc + p.valueUsd, 0);
    const totalValueInCurrency = positions.reduce(
        (acc, p) => acc + p.valueInCurrency,
        0,
    );

    return {
        positions,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: pairsLoading || query.isLoading,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/staking/useJuicyPosition.ts`

````typescript
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import { getTokenInfo } from '../wallet/useGetCustomTokenInfo';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { JuicyPoolAbi } from './abis';

const ERC20_BALANCE_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export type JuicyAssetPosition = {
    asset: string;
    symbol: string;
    decimals: number;
    amount: number;
    valueUsd: number;
    valueInCurrency: number;
};

type JuicyRawAssetPosition = Omit<
    JuicyAssetPosition,
    'valueUsd' | 'valueInCurrency'
>;

export type JuicyPositionResult = {
    supplied: JuicyAssetPosition[];
    borrowed: JuicyAssetPosition[];
    totalSuppliedUsd: number;
    totalSuppliedInCurrency: number;
    totalBorrowedUsd: number;
    totalBorrowedInCurrency: number;
    healthFactor: number | null; // null when no debt
    netValueUsd: number;
    netValueInCurrency: number;
    hasPosition: boolean;
    isLoading: boolean;
    error: unknown;
};

const MAX_UINT256 = (1n << 256n) - 1n;

export const useJuicyPosition = (address?: string): JuicyPositionResult => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const poolAddress = config.juicyPoolAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const enabled = !!address && !!poolAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'JUICY_POSITION',
            network.type,
            address?.toLowerCase(),
            poolAddress,
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async () => {
            if (!address || !poolAddress) {
                return {
                    supplied: [] as JuicyRawAssetPosition[],
                    borrowed: [] as JuicyRawAssetPosition[],
                    healthFactor: null as number | null,
                };
            }

            const pool = thor.contracts.load(poolAddress, JuicyPoolAbi);

            const reservesRaw = await pool.read.getReservesList();
            const reserves = (
                reservesRaw[0] as readonly string[] | undefined
            ) ?? (reservesRaw as unknown as readonly string[]);
            const reserveList = Array.from(reserves);

            if (!reserveList.length) {
                return {
                    supplied: [] as JuicyRawAssetPosition[],
                    borrowed: [] as JuicyRawAssetPosition[],
                    healthFactor: null as number | null,
                };
            }

            const reserveData = await executeMultipleClausesCall({
                thor,
                calls: reserveList.map((asset) => ({
                    abi: JuicyPoolAbi,
                    functionName: 'getReserveData' as const,
                    address: poolAddress as `0x${string}`,
                    args: [asset as `0x${string}`] as const,
                })),
            });

            type ReserveTokens = {
                asset: string;
                aTokenAddress: string;
                stableDebtTokenAddress: string;
                variableDebtTokenAddress: string;
            };
            const tokens: ReserveTokens[] = reserveList.map((asset, i) => {
                const rd = reserveData[i] as unknown as {
                    aTokenAddress: string;
                    stableDebtTokenAddress: string;
                    variableDebtTokenAddress: string;
                };
                return {
                    asset,
                    aTokenAddress: rd.aTokenAddress,
                    stableDebtTokenAddress: rd.stableDebtTokenAddress,
                    variableDebtTokenAddress: rd.variableDebtTokenAddress,
                };
            });

            // One batched call: balanceOf for aToken + both debt tokens per
            // reserve, plus getUserAccountData on the pool.
            const balanceCalls = tokens.flatMap((t) => [
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.aTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.variableDebtTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.stableDebtTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
            ]);

            const balanceResults = await executeMultipleClausesCall({
                thor,
                calls: balanceCalls,
            });

            const userAccountData = await pool.read.getUserAccountData(address);
            const hfRaw = (
                userAccountData as unknown as readonly bigint[]
            )[5];
            const totalDebtBaseRaw = (
                userAccountData as unknown as readonly bigint[]
            )[1];

            // Reserves with non-zero supply/debt we'll need symbols for.
            const interestingAssets: string[] = [];
            const supplyRaw: bigint[] = new Array(tokens.length).fill(0n);
            const variableDebtRaw: bigint[] = new Array(tokens.length).fill(0n);
            const stableDebtRaw: bigint[] = new Array(tokens.length).fill(0n);

            for (let i = 0; i < tokens.length; i++) {
                const aBal = balanceResults[i * 3] as unknown as bigint;
                const vBal = balanceResults[i * 3 + 1] as unknown as bigint;
                const sBal = balanceResults[i * 3 + 2] as unknown as bigint;
                supplyRaw[i] = aBal;
                variableDebtRaw[i] = vBal;
                stableDebtRaw[i] = sBal;
                if (aBal > 0n || vBal > 0n || sBal > 0n) {
                    interestingAssets.push(tokens[i].asset.toLowerCase());
                }
            }

            // Resolve token symbol+decimals for any interesting asset that
            // isn't already priced (or where we don't know decimals).
            const tokenMeta = new Map<
                string,
                { symbol: string; decimals: number }
            >();
            await Promise.all(
                interestingAssets.map(async (addr) => {
                    try {
                        const info = await getTokenInfo(
                            addr,
                            network.nodeUrl,
                        );
                        const parsed = Number(info.decimals);
                        tokenMeta.set(addr, {
                            symbol: info.symbol ?? addr.slice(0, 6),
                            decimals: Number.isFinite(parsed) ? parsed : 18,
                        });
                    } catch {
                        tokenMeta.set(addr, {
                            symbol: addr.slice(0, 6),
                            decimals: 18,
                        });
                    }
                }),
            );

            const supplied: JuicyRawAssetPosition[] = [];
            const borrowed: JuicyRawAssetPosition[] = [];

            for (let i = 0; i < tokens.length; i++) {
                const asset = tokens[i].asset;
                const lower = asset.toLowerCase();
                const meta = tokenMeta.get(lower) ?? {
                    symbol: asset.slice(0, 6),
                    decimals: 18,
                };

                const aBal = supplyRaw[i];
                if (aBal > 0n) {
                    supplied.push({
                        asset,
                        symbol: meta.symbol,
                        decimals: meta.decimals,
                        amount: Number(formatUnits(aBal, meta.decimals)),
                    });
                }

                const debtRaw = variableDebtRaw[i] + stableDebtRaw[i];
                if (debtRaw > 0n) {
                    borrowed.push({
                        asset,
                        symbol: meta.symbol,
                        decimals: meta.decimals,
                        amount: Number(formatUnits(debtRaw, meta.decimals)),
                    });
                }
            }

            // healthFactor is 1e18-scaled. When there's no debt the pool
            // returns max uint256 — treat that as "no debt" rather than
            // a numeric value.
            let healthFactor: number | null = null;
            if (totalDebtBaseRaw > 0n && hfRaw < MAX_UINT256) {
                healthFactor = Number(formatUnits(hfRaw, 18));
            }

            return {
                supplied,
                borrowed,
                healthFactor,
            };
        },
    });

    const data = query.data;

    // USD/currency derived from live prices so a late-arriving price query
    // repopulates values without re-running the on-chain query.
    const { supplied, borrowed } = useMemo(() => {
        const enrich = (raw: JuicyRawAssetPosition[]): JuicyAssetPosition[] =>
            raw.map((p) => {
                const lower = p.asset.toLowerCase();
                const priceUsd = prices[lower] ?? prices[p.asset] ?? 0;
                const valueUsd = p.amount * priceUsd;
                return {
                    ...p,
                    valueUsd,
                    valueInCurrency: convertToSelectedCurrency(
                        valueUsd,
                        currentCurrency as SupportedCurrency,
                        exchangeRates,
                    ),
                };
            });
        return {
            supplied: enrich(data?.supplied ?? []),
            borrowed: enrich(data?.borrowed ?? []),
        };
    }, [data, prices, currentCurrency, exchangeRates]);

    const totalSuppliedUsd = supplied.reduce((s, p) => s + p.valueUsd, 0);
    const totalSuppliedInCurrency = supplied.reduce(
        (s, p) => s + p.valueInCurrency,
        0,
    );
    const totalBorrowedUsd = borrowed.reduce((s, p) => s + p.valueUsd, 0);
    const totalBorrowedInCurrency = borrowed.reduce(
        (s, p) => s + p.valueInCurrency,
        0,
    );

    return {
        supplied,
        borrowed,
        totalSuppliedUsd,
        totalSuppliedInCurrency,
        totalBorrowedUsd,
        totalBorrowedInCurrency,
        healthFactor: data?.healthFactor ?? null,
        netValueUsd: totalSuppliedUsd - totalBorrowedUsd,
        netValueInCurrency:
            totalSuppliedInCurrency - totalBorrowedInCurrency,
        hasPosition: supplied.length > 0 || borrowed.length > 0,
        isLoading: query.isLoading,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/staking/useNavigatorPosition.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { NavigatorRegistryAbi } from './abis';

export type NavigatorPosition = {
    isNavigator: boolean;
    isDelegated: boolean;
    stakedB3TR: number;
    stakedB3TRRaw: string;
    delegatedAmount: number;
    delegatedAmountRaw: string;
    navigatorAddress?: string;
    totalB3TR: number;
    totalValueUsd: number;
    totalValueInCurrency: number;
    isLoading: boolean;
    error: unknown;
};

export const useNavigatorPosition = (address?: string): NavigatorPosition => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const registryAddress = config.navigatorRegistryContractAddress;
    const b3trAddress = config.b3trContractAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();
    const b3trPriceUsd = prices[b3trAddress] || 0;

    const enabled = !!address && !!registryAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'NAVIGATOR_POSITION',
            network.type,
            address?.toLowerCase(),
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async () => {
            if (!address) {
                return {
                    isNavigator: false,
                    isDelegated: false,
                    stakedB3TR: '0',
                    delegatedAmount: '0',
                    navigatorAddress: undefined as string | undefined,
                };
            }

            const res = await executeMultipleClausesCall({
                thor,
                calls: [
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'isNavigator' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getStake' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'isDelegated' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getDelegatedAmount' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getNavigator' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                ],
            });

            const [isNavRes, stakeRes, isDelegRes, delegAmtRes, navAddrRes] =
                res as unknown as [boolean, bigint, boolean, bigint, string];

            return {
                isNavigator: Boolean(isNavRes),
                isDelegated: Boolean(isDelegRes),
                stakedB3TR: stakeRes.toString(),
                delegatedAmount: delegAmtRes.toString(),
                navigatorAddress: navAddrRes,
            };
        },
    });

    const data = query.data;
    const stakedB3TR = data ? Number(formatUnits(data.stakedB3TR, 18)) : 0;
    const delegatedAmount = data
        ? Number(formatUnits(data.delegatedAmount, 18))
        : 0;
    const totalB3TR = stakedB3TR + delegatedAmount;
    const totalValueUsd = totalB3TR * b3trPriceUsd;
    const totalValueInCurrency = convertToSelectedCurrency(
        totalValueUsd,
        currentCurrency as SupportedCurrency,
        exchangeRates,
    );

    const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
    const navAddr = data?.navigatorAddress;
    const navigatorAddress =
        navAddr && navAddr !== ZERO_ADDR ? navAddr : undefined;

    return {
        isNavigator: Boolean(data?.isNavigator),
        isDelegated: Boolean(data?.isDelegated),
        stakedB3TR,
        stakedB3TRRaw: data?.stakedB3TR ?? '0',
        delegatedAmount,
        delegatedAmountRaw: data?.delegatedAmount ?? '0',
        navigatorAddress,
        totalB3TR,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: query.isLoading,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/staking/useStargatePositions.ts`

````typescript
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import {
    Stargate__factory,
    StargateNFT__factory,
} from '@vechain/vechain-contract-types';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

export type StargatePosition = {
    tokenId: string;
    levelId: number;
    vetAmountStaked: string;
    vetAmountFormatted: number;
    valueUsd: number;
    valueInCurrency: number;
    isDelegated: boolean;
};

type StargateRawPosition = Omit<
    StargatePosition,
    'valueUsd' | 'valueInCurrency'
>;

export type StargatePositionsResult = {
    positions: StargatePosition[];
    totalVet: number;
    totalValueUsd: number;
    totalValueInCurrency: number;
    isLoading: boolean;
    error: unknown;
};

const VET_ADDRESS = '0x';

export const useStargatePositions = (
    address?: string,
): StargatePositionsResult => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const stargateAddress = config.stargateContractAddress;
    const stargateNftAddress = config.stargateNftContractAddress;

    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();
    const vetPriceUsd = prices[VET_ADDRESS] || 0;

    const enabled =
        !!address && !!stargateAddress && !!stargateNftAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'STARGATE_POSITIONS',
            network.type,
            address?.toLowerCase(),
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async (): Promise<StargateRawPosition[]> => {
            if (!address) return [];

            const nftAbi = StargateNFT__factory.abi;
            const stargateAbi = Stargate__factory.abi;

            const balanceRes = await thor.contracts
                .load(stargateNftAddress, nftAbi)
                .read.balanceOf(address);
            const balance = Number(
                (balanceRes as readonly bigint[])[0] ?? balanceRes,
            );
            if (!balance) return [];

            const indexes = Array.from({ length: balance }, (_, i) => BigInt(i));

            const tokenIdsRes = await executeMultipleClausesCall({
                thor,
                calls: indexes.map((i) => ({
                    abi: nftAbi,
                    functionName: 'tokenOfOwnerByIndex' as const,
                    address: stargateNftAddress as `0x${string}`,
                    args: [address as `0x${string}`, i] as const,
                })),
            });

            const tokenIds = tokenIdsRes.map((r) => r as unknown as bigint);

            if (!tokenIds.length) return [];

            const detailsRes = await executeMultipleClausesCall({
                thor,
                calls: tokenIds.flatMap((tokenId) => [
                    {
                        abi: nftAbi,
                        functionName: 'getToken' as const,
                        address: stargateNftAddress as `0x${string}`,
                        args: [tokenId] as const,
                    },
                    {
                        abi: stargateAbi,
                        functionName: 'getDelegationStatus' as const,
                        address: stargateAddress as `0x${string}`,
                        args: [tokenId] as const,
                    },
                ]),
            });

            const rawPositions: StargateRawPosition[] = [];
            for (let i = 0; i < tokenIds.length; i++) {
                const tokenStruct = detailsRes[i * 2] as unknown as {
                    tokenId: bigint;
                    levelId: number | bigint;
                    vetAmountStaked: bigint;
                };
                const delegationStatus = Number(
                    detailsRes[i * 2 + 1] as unknown as number | bigint,
                );

                const vetAmountStaked = tokenStruct.vetAmountStaked.toString();
                const vetFormatted = Number(
                    formatUnits(tokenStruct.vetAmountStaked, 18),
                );

                rawPositions.push({
                    tokenId: tokenStruct.tokenId.toString(),
                    levelId: Number(tokenStruct.levelId),
                    vetAmountStaked,
                    vetAmountFormatted: vetFormatted,
                    isDelegated: delegationStatus !== 0,
                });
            }

            return rawPositions;
        },
    });

    // USD/currency are derived from live prices so a late-arriving price
    // query repopulates values without re-running the on-chain query.
    const positions = useMemo<StargatePosition[]>(() => {
        const raw = query.data ?? [];
        return raw.map((p) => {
            const valueUsd = p.vetAmountFormatted * vetPriceUsd;
            return {
                ...p,
                valueUsd,
                valueInCurrency: convertToSelectedCurrency(
                    valueUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                ),
            };
        });
    }, [query.data, vetPriceUsd, currentCurrency, exchangeRates]);

    const totalVet = positions.reduce((acc, p) => acc + p.vetAmountFormatted, 0);
    const totalValueUsd = positions.reduce((acc, p) => acc + p.valueUsd, 0);
    const totalValueInCurrency = positions.reduce(
        (acc, p) => acc + p.valueInCurrency,
        0,
    );

    return {
        positions,
        totalVet,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: query.isLoading,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/swap/useSwapQuotes.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getSwapAggregators } from '@/config/swapAggregators';
import { SwapParams, SwapQuote } from '@/types/swap';
import { parseUnits, zeroAddress } from 'viem';
import { useThor } from '@vechain/dapp-kit-react';
import { useGetCustomTokenInfo } from '@/hooks/api/wallet/useGetCustomTokenInfo';
import { TokenWithValue } from '@/hooks';
import { useWallet } from '@/hooks/api/wallet/useWallet';

export type UnifiedSwapQuotesResult = {
    bestQuote: SwapQuote | null;
    quotes: SwapQuote[];
    isLoading: boolean;
    error: unknown;
    from: TokenWithValue & {
        address: string;
        decimals: number;
    } | null;
    to: TokenWithValue & {
        address: string;
        decimals: number;
    } | null;
};

/**
 * Unified hook: fetches quotes from all aggregators, simulates each, returns
 * - bestQuote (filtered against reverts when at least one succeeds)
 * - quotes: full list with revert flags and gas
 */
export const useSwapQuotes = (
    fromToken: TokenWithValue | null,
    toToken: TokenWithValue | null,
    amountIn: string,
    userAddress: string,
    slippageTolerance: number = 1,
    enabled: boolean = true,
): UnifiedSwapQuotesResult => {
    const thor = useThor();
    const { connection } = useWallet();

    // Use on-chain token decimals for correct parsing of amountIn, pass empty string to not let it fetch details for VET
    const fromTokenAddress = fromToken?.address ?? null;
    const toTokenAddress = toToken?.address ?? null;
    const { data: fromTokenInfo } = useGetCustomTokenInfo(fromTokenAddress === '0x' || fromTokenAddress === zeroAddress || !fromTokenAddress ? '' : fromTokenAddress);
    const { data: toTokenInfo } = useGetCustomTokenInfo(toTokenAddress === '0x' || toTokenAddress === zeroAddress || !toTokenAddress ? '' : toTokenAddress);

    const fromTokenDecimals = useMemo(() => {
        if (!fromTokenAddress || fromTokenAddress === '0x' || fromTokenAddress === zeroAddress || !fromTokenInfo) return 18;
        return Number(fromTokenInfo?.decimals ?? 18);
    }, [fromTokenAddress, fromTokenInfo?.decimals]);

    const toTokenDecimals = useMemo(() => {
        if (!toTokenAddress || toTokenAddress === '0x' || toTokenAddress === zeroAddress || !toTokenInfo) return 18;
        return Number(toTokenInfo?.decimals ?? 18);
    }, [toTokenAddress, toTokenInfo?.decimals]);

    const params: SwapParams | null = useMemo(() => {
        if (!fromTokenAddress || !toTokenAddress || !amountIn || !userAddress) return null;


        let amountInRaw: bigint;
        try {
            amountInRaw = parseUnits(amountIn, fromTokenDecimals)
        } catch (error) {
            console.error('Failed to parse amount:', amountIn, error);
            return null;
        }

        if (amountInRaw <= 0n) return null;

        return {
            fromTokenAddress,
            toTokenAddress,
            amountIn: amountInRaw.toString(),
            userAddress,
            slippageTolerance,
        };
    }, [fromTokenAddress, toTokenAddress, amountIn, userAddress, slippageTolerance, fromTokenDecimals]);

    const { data, isLoading, error } = useQuery<{ quotes: SwapQuote[]; best: SwapQuote | null }>({
        queryKey: ['unified-swap-quotes', params, connection.network],
        queryFn: async () => {
            if (!params || !thor || !connection.network) return { quotes: [], best: null };

            const aggregators = getSwapAggregators(connection.network);
            const quotePromises = aggregators.map(async (aggregator) => {
                try {
                    const quote = await aggregator.getQuote(params, thor);
                    try {
                        const simulation = await aggregator.simulateSwap(params, quote, thor);
                        const enrichedQuote: SwapQuote = {
                            ...quote,
                            aggregator,
                            reverted: !simulation.success,
                            revertReason: simulation.error,
                            gasCostVTHO: simulation.gasCostVTHO,
                        };
                        return enrichedQuote;
                    } catch (simError) {
                        console.error(`Failed to simulate swap for ${aggregator.name}:`, simError);
                        const enrichedQuote: SwapQuote = {
                            ...quote,
                            aggregator,
                            reverted: true,
                            revertReason: simError instanceof Error ? simError.message : 'Simulation failed',
                            gasCostVTHO: 0,
                        };
                        return enrichedQuote;
                    }
                } catch (error) {
                    console.error(`Failed to get quote from ${aggregator.name}:`, error);
                    return null;
                }
            });

            const quotes = (await Promise.all(quotePromises)).filter(
                (q): q is SwapQuote => q !== null && q.outputAmount !== 0n,
            );

            // Decide best quote with revert-aware filtering
            let best: SwapQuote | null = null;
            if (quotes.length > 0) {
                const nonReverted = quotes.filter((q) => !(q.reverted ?? false));
                const candidates = nonReverted.length > 0 ? nonReverted : quotes;
                best = candidates.reduce((acc, cur) => {
                    const a = BigInt(acc.outputAmount || '0');
                    const b = BigInt(cur.outputAmount || '0');
                    return b > a ? cur : acc;
                });
            }

            return { quotes, best };
        },
        enabled: enabled && params !== null && thor !== null && thor !== undefined,
        refetchInterval: 10000,
    });

    return {
        bestQuote: data?.best ?? null,
        quotes: data?.quotes ?? [],
        isLoading,
        error,
        from: fromToken ? {
            ...fromToken,
            address: fromTokenAddress ?? '',
            decimals: fromTokenDecimals,
        } : null,
        to: toToken ? {
            ...toToken,
            address: toTokenAddress ?? '',
            decimals: toTokenDecimals,
        } : null,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/swap/useSwapTransaction.ts`

````typescript
import { useCallback } from 'react';
import { useSendTransaction } from '@/hooks/thor/transactions/useSendTransaction';
import { useWallet } from '@/hooks';
import { SwapParams, SwapQuote } from '@/types/swap';
import { useTranslation } from 'react-i18next';

/**
 * Hook to execute a swap transaction
 */
export const useSwapTransaction = (
    params: SwapParams | null,
    quote: SwapQuote | null,
) => {
    const { account } = useWallet();
    const { t } = useTranslation();

    const {
        sendTransaction,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        resetStatus,
        error,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: t('ConfirmSwapTitle', { defaultValue: 'Confirm Swap' }),
            description: t('ConfirmSwapDescription', { defaultValue: 'Please confirm the swap transaction in your wallet' }),
            buttonText: t('Confirm', { defaultValue: 'Confirm' }),
        },
    });

    const executeSwap = useCallback(async () => {
        if (!params || !quote) {
            throw new Error('Missing swap parameters or quote');
        }

        // Use the aggregator reference from the quote
        if (!quote.aggregator) {
            throw new Error(`Aggregator not found for quote from ${quote.aggregatorName}`);
        }

        // Build transaction clauses
        const clauses = await quote.aggregator.buildSwapTransaction(params, quote);

        if (clauses.length === 0) {
            throw new Error('Failed to build swap transaction');
        }

        // Send the transaction
        await sendTransaction(clauses);
    }, [params, quote, sendTransaction]);

    return {
        executeSwap,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        resetStatus,
        error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/transferHistory/types.ts`

````typescript
export type TransferDirection = 'sent' | 'received';

export type TransferEventType = 'VET' | 'FUNGIBLE_TOKEN' | 'NFT';

export type IndexerTransfer = {
    id: string;
    blockId: string;
    blockNumber: number;
    blockTimestamp: number;
    txId: string;
    from: string;
    to: string;
    value: string;
    tokenAddress?: string;
    tokenId?: string;
    topics: string[];
    eventType: TransferEventType;
};

export type TransferHistoryItem = {
    id: string;
    txId: string;
    blockNumber: number;
    timestamp: number;
    direction: TransferDirection;
    from: string;
    to: string;
    tokenAddress: string | null;
    tokenSymbol: string;
    tokenDecimals: number;
    rawValue: string;
    amount: number;
    eventType: TransferEventType;
};

export const VET_TOKEN_SENTINEL = '0x';

export const VTHO_TOKEN_ADDRESS =
    '0x0000000000000000000000000000456e65726779';
````

## Source: `packages/vechain-kit/src/hooks/api/transferHistory/useTokenTransferHistory.ts`

````typescript
import { useTransferHistory } from './useTransferHistory';

export const useTokenTransferHistory = (
    address?: string,
    tokenAddress?: string | null,
    options: { enabled?: boolean } = {},
) => {
    return useTransferHistory(address, {
        tokenAddress: tokenAddress ?? undefined,
        enabled: options.enabled,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/transferHistory/useTransferHistory.ts`

````typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { useTokenBalances } from '../wallet/useTokenBalances';
import { getTokenInfo } from '../wallet/useGetCustomTokenInfo';
import {
    IndexerTransfer,
    TransferHistoryItem,
    VET_TOKEN_SENTINEL,
    VTHO_TOKEN_ADDRESS,
} from './types';

type IndexerResponse = {
    data: IndexerTransfer[];
    pagination?: { hasNext?: boolean };
};

const eqLower = (a?: string | null, b?: string | null) =>
    (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

export const getTransferHistoryQueryKey = (
    address?: string,
    networkType?: string,
    tokenAddress?: string | null,
) => [
    'VECHAIN_KIT',
    'TRANSFER_HISTORY',
    networkType,
    address?.toLowerCase(),
    tokenAddress ? tokenAddress.toLowerCase() : 'all',
];

type UseTransferHistoryOptions = {
    tokenAddress?: string | null;
    enabled?: boolean;
};

export const useTransferHistory = (
    address?: string,
    { tokenAddress, enabled = true }: UseTransferHistoryOptions = {},
) => {
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const { balances } = useTokenBalances(address);

    const symbolByAddress = new Map<string, { symbol: string; decimals: number }>();
    // Pre-fill only tokens we know to be 18-decimal. Custom tokens (which may
    // not be 18-decimal) flow through the lazy on-chain getTokenInfo lookup
    // in the queryFn so amounts are formatted with their real decimals.
    const known18 = new Set(
        [
            VET_TOKEN_SENTINEL,
            VTHO_TOKEN_ADDRESS,
            config.b3trContractAddress,
            config.vot3ContractAddress,
            config.veDelegateTokenContractAddress,
            config.vvetContractAddress,
        ]
            .filter(Boolean)
            .map((a) => a.toLowerCase()),
    );
    symbolByAddress.set(VET_TOKEN_SENTINEL.toLowerCase(), {
        symbol: 'VET',
        decimals: 18,
    });
    symbolByAddress.set(VTHO_TOKEN_ADDRESS.toLowerCase(), {
        symbol: 'VTHO',
        decimals: 18,
    });
    for (const b of balances) {
        if (!b.address || !b.symbol) continue;
        if (!known18.has(b.address.toLowerCase())) continue;
        symbolByAddress.set(b.address.toLowerCase(), {
            symbol: b.symbol,
            decimals: 18,
        });
    }

    const indexerUrl = config.indexerUrl;
    // Only treat this as a VET-specific filter when the caller actually
    // passed the VET sentinel — an undefined tokenAddress means "all".
    const filteringByVet = tokenAddress === VET_TOKEN_SENTINEL;
    const supportsHistory = !!indexerUrl && network.type !== 'solo';

    type TransferPage = {
        items: TransferHistoryItem[];
        hasNext: boolean;
    };

    const query = useInfiniteQuery<TransferPage, Error>({
        queryKey: getTransferHistoryQueryKey(
            address,
            network.type,
            tokenAddress ?? null,
        ),
        initialPageParam: 0,
        // The indexer is 0-indexed and ignores limit/offset; it only honors
        // a `page` parameter and returns ~20 items per page.
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length : undefined,
        queryFn: async ({ pageParam = 0 }): Promise<TransferPage> => {
            if (!address) {
                return { items: [] as TransferHistoryItem[], hasNext: false };
            }

            const params = new URLSearchParams({
                address: address.toLowerCase(),
                page: String(pageParam),
            });
            if (filteringByVet) {
                // Indexer doesn't accept the VET sentinel as a tokenAddress;
                // use the dedicated eventType filter so we don't have to
                // post-filter a mixed page client-side (which would yield
                // very few rows).
                params.set('eventType', 'VET');
            } else if (tokenAddress) {
                params.set('tokenAddress', tokenAddress.toLowerCase());
            }

            const res = await fetch(`${indexerUrl}/transfers?${params.toString()}`);
            if (!res.ok) {
                throw new Error(`Indexer request failed: ${res.status}`);
            }
            const body = (await res.json()) as IndexerResponse;

            const filtered = (body.data ?? [])
                .filter((t) => t.eventType !== 'NFT')
                .filter((t) => {
                    if (!tokenAddress) return true;
                    if (filteringByVet) {
                        return t.eventType === 'VET';
                    }
                    return eqLower(t.tokenAddress, tokenAddress);
                });

            // Fetch on-chain metadata for ERC-20 addresses we don't yet
            // recognise so the row shows the real symbol and the amount
            // uses the correct decimals (the indexer reports raw wei).
            const unknownTokens = new Set<string>();
            for (const t of filtered) {
                if (t.eventType !== 'FUNGIBLE_TOKEN' || !t.tokenAddress) continue;
                const key = t.tokenAddress.toLowerCase();
                if (!symbolByAddress.has(key)) unknownTokens.add(key);
            }
            if (unknownTokens.size && network.nodeUrl) {
                const addrs = Array.from(unknownTokens);
                const results = await Promise.allSettled(
                    addrs.map((addr) => getTokenInfo(addr, network.nodeUrl)),
                );
                results.forEach((r, i) => {
                    if (r.status !== 'fulfilled' || !r.value) return;
                    const info = r.value;
                    if (!info.symbol) return;
                    const parsed = Number(info.decimals);
                    symbolByAddress.set(addrs[i], {
                        symbol: info.symbol,
                        decimals: Number.isFinite(parsed) ? parsed : 18,
                    });
                });
            }

            const items: TransferHistoryItem[] = filtered.map((t) => {
                const isVet = t.eventType === 'VET';
                const tokenAddrKey = isVet
                    ? VET_TOKEN_SENTINEL.toLowerCase()
                    : (t.tokenAddress ?? '').toLowerCase();
                const meta = symbolByAddress.get(tokenAddrKey);
                const decimals = meta?.decimals ?? 18;
                const symbol =
                    meta?.symbol ??
                    (isVet ? 'VET' : t.tokenAddress?.slice(0, 6) ?? '');
                const direction = eqLower(t.from, address)
                    ? 'sent'
                    : 'received';
                let amount = 0;
                try {
                    amount = Number(formatUnits(BigInt(t.value), decimals));
                } catch {
                    amount = 0;
                }
                return {
                    id: t.id,
                    txId: t.txId,
                    blockNumber: t.blockNumber,
                    timestamp: t.blockTimestamp,
                    direction,
                    from: t.from,
                    to: t.to,
                    tokenAddress: isVet ? null : (t.tokenAddress ?? null),
                    tokenSymbol: symbol,
                    tokenDecimals: decimals,
                    rawValue: t.value,
                    amount,
                    eventType: t.eventType,
                } satisfies TransferHistoryItem;
            });

            return {
                items,
                hasNext: !!body.pagination?.hasNext,
            };
        },
        enabled: enabled && !!address && supportsHistory,
        staleTime: 30_000,
    });

    const transfers: TransferHistoryItem[] =
        query.data?.pages.flatMap((p) => p.items) ?? [];

    return {
        transfers,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isFetchingNextPage: query.isFetchingNextPage,
        hasNextPage: !!query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isUnsupportedNetwork: !supportsHistory,
        error: query.error,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useClaimVeWorldSubdomain.ts`

````typescript
import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useCallback } from 'react';
import {
    VeworldSubdomainClaimer__factory,
    VetDomainsReverseRegistrar__factory,
} from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useVeChainKitConfig, VeChainKitConfig } from '@/providers';
import { getKitSponsoredDelegatorUrl, humanAddress } from '@/utils';
import { ethers } from 'ethers';
import { useRefreshMetadata } from '../wallet/useRefreshMetadata';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import { Wallet } from '@/types';
import { TransactionClause } from '@vechain/sdk-core';

type useClaimVeWorldSubdomainProps = {
    subdomain: string;
    domain: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
};

type useClaimVeWorldSubdomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const SubdomainClaimerInterface = VeworldSubdomainClaimer__factory.createInterface();
const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

const buildVeWorldSubdomainClauses = (subdomain: string, domain: string, alreadyOwned: boolean, account: Wallet, network: VeChainKitConfig['network']): TransactionClause[] => {
    const clausesArray: any[] = [];

    if (!subdomain) throw new Error('Invalid subdomain');

    const fullDomain = `${subdomain}.${domain}`;

    // Always unset current nickname first
    clausesArray.push({
        to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
        value: '0x0',
        data: ReverseRegistrarInterface.encodeFunctionData('setName', ['']),
        comment: `Unsetting your current VeChain nickname of the account ${humanAddress(
            account?.address ?? '',
            4,
            4,
        )}`,
        abi: ReverseRegistrarInterface.getFunction('setName'),
    });

    if (alreadyOwned) {
        // For already owned domains, set the name in the reverse registrar
        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                fullDomain,
            ]),
            comment: `Setting your VeChain nickname to ${fullDomain}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        // Also set the address in the public resolver
        const PublicResolverInterface = new ethers.Interface([
            'function setAddr(bytes32 node, address addr)',
        ]);

        // Calculate the namehash for the domain
        const domainNode = ethers.namehash(fullDomain);

        clausesArray.push({
            to: getConfig(network.type).vetDomainsPublicResolverAddress,
            value: '0x0',
            data: PublicResolverInterface.encodeFunctionData('setAddr', [
                domainNode,
                account?.address || '',
            ]),
            comment: `Setting the address for ${fullDomain} to ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: PublicResolverInterface.getFunction('setAddr'),
        });
    } else {
        if (isVeWorldDomain(domain)) {
            // For new domains, claim the subdomain
            clausesArray.push({
                to: getConfig(network.type)
                    .veWorldSubdomainClaimerContractAddress,
                value: '0x0',
                data: SubdomainClaimerInterface.encodeFunctionData(
                    'claim',
                    [
                        subdomain,
                        getConfig(network.type)
                            .vetDomainsPublicResolverAddress,
                    ],
                ),
                comment: `Claim VeChain subdomain: ${subdomain}.${domain}`,
                abi: SubdomainClaimerInterface.getFunction('claim'),
            });

            clausesArray.push({
                to: getConfig(network.type)
                    .vetDomainsReverseRegistrarAddress,
                value: '0x0',
                data: ReverseRegistrarInterface.encodeFunctionData(
                    'setName',
                    [subdomain + '.' + domain],
                ),
                comment: `Set ${subdomain}.${domain} as the VeChain nickname of the account ${humanAddress(
                    account?.address ?? '',
                    4,
                    4,
                )}`,
                abi: ReverseRegistrarInterface.getFunction('setName'),
            });
        } else {
            throw new Error(
                'This hook only supports .veworld.vet subdomains',
            );
        }
    }

    return clausesArray;
};

/**
 * Hook for claiming a .veworld.vet subdomain
 *
 * This hook specializes in handling subdomains in the .veworld.vet domain
 */
export const useClaimVeWorldSubdomain = ({
    subdomain,
    domain,
    onSuccess,
    onError,
    alreadyOwned = false,
}: useClaimVeWorldSubdomainProps): useClaimVeWorldSubdomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();
    const { refresh: refreshMetadata } = useRefreshMetadata(
        subdomain + '.' + domain,
        account?.address ?? '',
    );

    const clauses = useCallback(() => buildVeWorldSubdomainClauses(subdomain, domain, alreadyOwned, account, network), [subdomain, domain, alreadyOwned, account, network]);

    //Refetch queries to update ui after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const fullDomain = `${subdomain}.${domain}`;
        const address = account?.address ?? '';

        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            fullDomain,
            subdomain,
            domain,
            network.type,
        );

        // Use the dedicated metadata refresh utility
        refreshMetadata();
        onSuccess?.();
    }, [
        onSuccess,
        subdomain,
        domain,
        queryClient,
        account,
        network.type,
        refreshMetadata,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to claim your VeChain nickname',
            description: `Claim ${subdomain}.${domain} as your VeChain nickname`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: () => {
            onError?.();
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            // Route through VeChain's sponsored delegator so new users
            // without VTHO / B3TR can still claim a veworld.vet subdomain.
            return result.sendTransaction(
                clauses(),
                getKitSponsoredDelegatorUrl(),
            );
        },
    };
};

const isVeWorldDomain = (domain: string) => {
    return domain.endsWith('veworld.vet');
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useClaimVetDomain.ts`

````typescript
import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useRefreshMetadata } from '../wallet/useRefreshMetadata';
import { useCallback } from 'react';
import { VetDomainsReverseRegistrar__factory } from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useVeChainKitConfig, VeChainKitConfig } from '@/providers';
import { ethers } from 'ethers';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import { getKitSponsoredDelegatorUrl, humanAddress } from '@/utils';
import { Wallet } from '@/types';
import { TransactionClause } from '@vechain/sdk-core';

type useClaimVetDomainProps = {
    domain: string;
    onSuccess?: () => void;
    onError?: () => void;
    onSuccessMessageTitle?: number;
    alreadyOwned?: boolean;
};

type useClaimVetDomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

export const buildVetDomainClauses = (
    domain: string,
    alreadyOwned: boolean,
    account: Wallet,
    network: VeChainKitConfig['network'],
): TransactionClause[] => {
    const clausesArray: any[] = [];

    if (!domain) throw new Error('Invalid domain');

    if (alreadyOwned) {
        // For already owned domains, set the name in the reverse registrar
        clausesArray.push({
            to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
            value: '0x0',
            data: ReverseRegistrarInterface.encodeFunctionData('setName', [
                domain,
            ]),
            comment: `Setting your VeChain nickname to ${domain}`,
            abi: ReverseRegistrarInterface.getFunction('setName'),
        });

        // Also set the address in the public resolver
        const PublicResolverInterface = new ethers.Interface([
            'function setAddr(bytes32 node, address addr)',
        ]);

        // Calculate the namehash for the domain
        const domainNode = ethers.namehash(domain);

        clausesArray.push({
            to: getConfig(network.type).vetDomainsPublicResolverAddress,
            value: '0x0',
            data: PublicResolverInterface.encodeFunctionData('setAddr', [
                domainNode,
                account?.address || '',
            ]),
            comment: `Setting the address for ${domain} to ${humanAddress(
                account?.address ?? '',
                4,
                4,
            )}`,
            abi: PublicResolverInterface.getFunction('setAddr'),
        });
    } else {
        throw new Error('Primary .vet domains are not supported yet');
    }

    return clausesArray;
};

/**
 * Hook for claiming a .vet domain
 *
 * This hook specializes in handling primary .vet domains
 */
export const useClaimVetDomain = ({
    domain,
    onSuccess,
    onError,
    alreadyOwned = false,
}: useClaimVetDomainProps): useClaimVetDomainReturnValue => {
    const { network } = useVeChainKitConfig();
    const queryClient = useQueryClient();
    const { account } = useWallet();

    const { refresh: refreshMetadata } = useRefreshMetadata(
        domain,
        account?.address ?? '',
    );

    const clauses = useCallback(
        () => buildVetDomainClauses(domain, alreadyOwned, account, network),
        [domain, alreadyOwned, account, network],
    );

    // Refetch queries to update UI after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const address = account?.address ?? '';

        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            domain,
            '', // No subdomain for primary domains
            domain.endsWith('.vet') ? domain : `${domain}.vet`,
            network.type,
        );

        // Use the dedicated metadata refresh utility
        refreshMetadata();

        onSuccess?.();
    }, [
        onSuccess,
        domain,
        queryClient,
        account,
        network.type,
        refreshMetadata,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to claim your VeChain nickname',
            description: `Claim ${domain} as your VeChain nickname`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: onError,
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            // Route through VeChain's sponsored delegator so new users without
            // VTHO / B3TR can still claim a domain.
            return result.sendTransaction(
                clauses(),
                getKitSponsoredDelegatorUrl(),
            );
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useEnsRecordExists.ts`

````typescript
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { VetDomainsRegistry__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@vechain/sdk-network';
import { concat, keccak256, toBytes } from 'viem';

const getEnsRecordExists = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    name: string,
): Promise<boolean> => {
    // .veworld.vet
    const hashedNode =
        '0x571e15b4bbf879cf28e5075190137be8e18500e3d38543bf0cbcdb54e00b02cc';

    // First hash the label using keccak256(bytes(name))
    const labelHash = keccak256(toBytes(name));

    // Then combine node and label exactly as in the contract:
    // bytes32 subnode = keccak256(abi.encodePacked(node, label));
    const subnode = keccak256(concat([hashedNode, labelHash]));

    const res = await thor.contracts
        .load(
            getConfig(network).vetDomainsContractAddress,
            VetDomainsRegistry__factory.abi,
        )
        .read.recordExists(subnode);

    if (!res) throw new Error(`Failed to get ENS record exists for ${name}`);

    return res[0] as boolean;
};

export const getEnsRecordExistsQueryKey = (name: string) => [
    'VECHAIN_KIT_ENS_RECORD_VE_WORLD_EXISTS',
    name,
];

export const useEnsRecordExists = (name: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getEnsRecordExistsQueryKey(name),
        queryFn: () => getEnsRecordExists(thor, network.type, name),
        enabled: !!name,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetAvatar.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getAvatar  } from '@vechain/contract-getters';

export const getAvatarQueryKey = (name: string, networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT',
    'VET_DOMAINS',
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

            return getAvatar(name, {
                networkUrl: network.nodeUrl,
            });
        },
        enabled: !!name && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });

    return avatarQuery;
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetAvatarLegacy.ts`

````typescript
/**
 * LEGACY IMPLEMENTATION
 *
 * This file contains the original implementation of the avatar fetching logic
 * which directly interacts with the VeChain blockchain to resolve avatars.
 *
 * The problem with this implementation was that some tokenURI aren't configured
 * to allow cross-origin requests from your localhost application.
 * To solve this we need a proxy server that allows us to fetch the metadata from the tokenURI
 * without having to deal with CORS issues.
 *
 * This implementation is preserved for documentation and reference purposes but is no longer
 * the active implementation. The current implementation uses the vet.domains API to fetch the avatar.
 */

import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import {
    Interface,
    namehash,
    toUtf8String,
    zeroPadValue,
    toBeHex,
} from 'ethers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { convertUriToUrl } from '@/utils/uri';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) returns (string avatar)',
]);

const erc721Interface = new Interface([
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function uri(uint256 id) view returns (string)',
]);

/**
 * Fetches the avatar for a given VET domain name
 * @param networkType - The network type ('main' or 'test')
 * @param nodeUrl - The node URL
 * @param name - The VET domain name
 * @returns The avatar URL from the response
 */

export const getAvatarLegacy = async (
    networkType: NETWORK_TYPE,
    nodeUrl: string,
    name: string,
): Promise<string | null> => {
    if (!name) throw new Error('Name is required');

    const node = namehash(name);

    try {
        // Get resolver address
        const accountsUrl = new URL('accounts/*', nodeUrl);
        const resolverResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: getConfig(networkType).vetDomainsContractAddress,
                        data: nameInterface.encodeFunctionData('resolver', [
                            node,
                        ]),
                    },
                ],
            }),
        });

        const [{ data: resolverData, reverted: noResolver }] =
            await resolverResponse.json();

        if (noResolver) {
            return null;
        }

        const { resolverAddress } = nameInterface.decodeFunctionResult(
            'resolver',
            resolverData,
        );

        // Get avatar
        const avatarResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: resolverAddress,
                        data: nameInterface.encodeFunctionData('text', [
                            node,
                            'avatar',
                        ]),
                    },
                ],
            }),
        });

        const [{ data: lookupData, reverted: noLookup }] =
            await avatarResponse.json();

        if (noLookup || lookupData === '0x') {
            return null;
        }

        try {
            const { avatar } = nameInterface.decodeFunctionResult(
                'text',
                lookupData,
            );
            const avatarRecord = avatar === '' ? null : avatar;

            if (!avatarRecord) return null;

            return parseAvatarRecord(avatarRecord, networkType, nodeUrl);
        } catch (decodeError) {
            console.error('Failed to decode avatar data:', decodeError);
            return null;
        }
    } catch (error) {
        console.error('Error fetching avatar using legacy API:', error);
        throw error;
    }
};

export const getAvatarLegacyQueryKey = (
    name: string,
    networkType: NETWORK_TYPE,
) => ['VECHAIN_KIT', 'VET_DOMAINS', 'AVATAR', 'LEGACY', name, networkType];

async function parseAvatarRecord(
    record: string,
    networkType: NETWORK_TYPE,
    nodeUrl: string,
): Promise<string | null> {
    try {
        // Use the existing URI converter for direct URL handling
        if (
            record.startsWith('http') ||
            record.startsWith('ipfs://') ||
            record.startsWith('ar://')
        ) {
            return convertUriToUrl(record, networkType) || null;
        }

        // Handle NFT avatar (ENS-12)
        const match = record.match(
            /eip155:(\d+)\/(?:erc721|erc1155):([^/]+)\/(\d+)/,
        );
        if (match) {
            const [, chainId, contractAddress, tokenId] = match;
            const isErc1155 = record.includes('erc1155');

            if (!chainId || !contractAddress || tokenId === undefined) {
                return null;
            }

            // ... rest of NFT handling logic ...
            const clauses = [
                {
                    to: contractAddress,
                    data: erc721Interface.encodeFunctionData(
                        isErc1155 ? 'uri' : 'tokenURI',
                        [BigInt(tokenId || 0)],
                    ),
                },
            ];

            const accountsUrl = new URL('accounts/*', nodeUrl);
            const [{ data, reverted }] = await fetch(accountsUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ clauses }),
            }).then((res) => res.json());

            if (reverted) {
                console.error('Failed to fetch tokenURI');
                return null;
            }

            let tokenUri = '';
            try {
                tokenUri = erc721Interface.decodeFunctionResult(
                    isErc1155 ? 'uri' : 'tokenURI',
                    data,
                )[0];
            } catch (e) {
                console.error('Failed to decode avatar data:', e);
                tokenUri = toUtf8String(data);
            }

            // Use the existing URI converter
            tokenUri = convertUriToUrl(tokenUri, networkType) || tokenUri;

            if (isErc1155) {
                tokenUri = tokenUri.replace(
                    '{id}',
                    zeroPadValue(toBeHex(BigInt(tokenId || 0)), 32).slice(2),
                );
            }

            const metadataResponse = await fetch(tokenUri);
            if (!metadataResponse.ok) {
                console.error('Failed to fetch metadata');
                return null;
            }

            const metadata = await metadataResponse.json();
            const imageUrl =
                metadata.image || metadata.image_url || metadata.image_data;

            if (!imageUrl) {
                console.error('No image URL in metadata');
                return null;
            }

            // Use the existing URI converter for the final image URL
            return convertUriToUrl(imageUrl, networkType) || imageUrl;
        }

        return null;
    } catch (error) {
        console.error('Error parsing avatar record:', error);
        return null;
    }
}

/**
 * Hook to fetch the avatar URL for a VET domain name
 * @param name - The VET domain name
 * @returns The resolved avatar URL
 */
export const useGetAvatarLegacy = (name: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    const avatarQuery = useQuery({
        queryKey: getAvatarLegacyQueryKey(name ?? '', network.type),
        queryFn: async () => {
            if (!name) return null;

            return getAvatarLegacy(network.type, nodeUrl, name);
        },
        enabled: !!name && !!nodeUrl && !!network.type,
    });

    return avatarQuery;
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetAvatarOfAddress.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { getPicassoImage } from '@/utils';
import { getAddressDomain, getAvatar } from '@vechain/contract-getters';
import { useVeChainKitConfig } from '@/providers';
import { getLocalStorageItem } from '@/utils/ssrUtils';
import { CrossAppConnectionCache } from '@/types';
import { VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL } from '@/constants';

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
        new URL('mugshot.png', VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL).toString(),
    Greencart:
        new URL('greencart.png', VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL).toString(),
    Cleanify:
        new URL('cleanify.png', VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL).toString(),
    EVearn: new URL('evearn.png', VECHAIN_KIT_DOCS_IMAGES_S3_BASE_URL).toString(),
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

// Lowercase the key so mixed-case and lowercase callers share the cache.
export const getAvatarOfAddressQueryKey = (address?: string) => [
    'VECHAIN_KIT',
    'VET_DOMAINS',
    'AVATAR_OF_ADDRESS',
    address?.toLowerCase() ?? address,
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

            // VNS contracts only exist on mainnet and testnet
            if (network.type !== 'main' && network.type !== 'test') {
                const crossAppAvatar = getCrossAppAvatar();
                return crossAppAvatar ?? getPicassoImage(address);
            }

            // Lowercase to bypass ethers' strict EIP-55 check.
            const addressDomain = await getAddressDomain(address.toLowerCase(), {
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetDomainsOfAddress.ts`

````typescript
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// Schema for the domain response
const DomainSchema = z.object({
    name: z.string(),
});

const DomainsResponseSchema = z.object({
    domains: z.array(DomainSchema),
});

export type Domain = z.infer<typeof DomainSchema>;
export type DomainsResponse = z.infer<typeof DomainsResponseSchema>;

/**
 * Fetches all domains owned by an address
 * @param networkType The network type
 * @param address The owner's address
 * @param parentDomain The parent domain (e.g., "veworld.vet")
 * @returns The domains owned by the address
 */
export const getDomainsOfAddress = async (
    networkType: NETWORK_TYPE,
    address?: string,
    parentDomain?: string,
): Promise<DomainsResponse> => {
    if (!address) throw new Error('Address is required');

    const graphQlIndexerUrl = getConfig(networkType).graphQlIndexerUrl;

    const whereCondition = parentDomain
        ? `{owner: "${address.toLowerCase()}", parent_: {name: "${parentDomain}"}}`
        : `{owner: "${address.toLowerCase()}"}`;

    const query = `query Registrations {
        domains(
            where: ${whereCondition}
        ) {
            name
        }
    }`;

    const response = await fetch(graphQlIndexerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            operationName: 'Registrations',
            query,
            extensions: {},
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch domains');
    }

    const json = await response.json();

    // Filter out domains ending with "addr.reverse" before parsing
    if (json.data && json.data.domains) {
        json.data.domains = json.data.domains.filter(
            (domain: any) => !domain.name.endsWith('addr.reverse'),
        );
    }

    return DomainsResponseSchema.parse(json.data);
};

export const getDomainsOfAddressQueryKey = (
    address?: string,
    parentDomain?: string,
) => ['VECHAIN_KIT', 'VET_DOMAINS', address, parentDomain];

/**
 * Hook to fetch all domains owned by an address
 * @param address The owner's address
 * @param parentDomain The parent domain (e.g., "veworld.vet")
 * @returns The domains owned by the address
 */
export const useGetDomainsOfAddress = (
    address?: string,
    parentDomain?: string,
) => {
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getDomainsOfAddressQueryKey(address, parentDomain),
        queryFn: () => getDomainsOfAddress(network.type, address, parentDomain),
        enabled: !!address && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') ||
                    errorMessage.includes('abort') ||
                    errorMessage === 'address is required') {
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetResolverAddress.ts`

````typescript
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCallClause } from '@/hooks';
import { namehash } from 'viem';
import { VetDomainsRegistry__factory } from '@vechain/vechain-contract-types';


export const getResolverAddressQueryKey = (domain?: string) => [
    'VECHAIN_KIT',
    'RESOLVER_ADDRESS',
    domain,
];

/**
 * Hook to get resolver address for a VET domain
 * @param domain The domain to get resolver for
 * @returns The resolver address for the domain
 */
export const useGetResolverAddress = (domain?: string) => {
    const { network } = useVeChainKitConfig();

    return useCallClause({
        address: getConfig(network.type).vetDomainsContractAddress,
        abi: VetDomainsRegistry__factory.abi,
        method: 'resolver',
        args: [domain ? namehash(domain) : '0x'],
        queryOptions: {
            select: (data) => data[0],
            enabled: !!domain,
        },
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useGetTextRecords.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { Interface, namehash } from 'ethers';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { ENS_TEXT_RECORDS, TextRecords } from '@/types';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function text(bytes32 node, string key) view returns (string)',
]);

/**
 * Get text records for a VET domain from the contract
 * @param nodeUrl The node URL to query
 * @param network The network type
 * @param domain The domain to get text records for. If not provided, will return empty object
 * @returns Object containing text records in the form of {@link TextRecords}
 */
export const getTextRecords = async (
    nodeUrl: string,
    network: NETWORK_TYPE,
    domain?: string,
): Promise<TextRecords> => {
    if (!domain) return {};

    const node = namehash(domain);

    try {
        // First get the resolver address
        const accountsUrl = new URL('accounts/*', nodeUrl);
        const resolverResponse = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: [
                    {
                        to: getConfig(network).vetDomainsContractAddress,
                        data: nameInterface.encodeFunctionData('resolver', [
                            node,
                        ]),
                    },
                ],
            }),
        });

        const [{ data: resolverData, reverted: noResolver }] =
            await resolverResponse.json();

        if (noResolver) {
            return {};
        }

        const { resolverAddress } = nameInterface.decodeFunctionResult(
            'resolver',
            resolverData,
        );

        // Then get all text records from the resolver
        const response = await fetch(accountsUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                clauses: ENS_TEXT_RECORDS.map((key) => ({
                    to: resolverAddress,
                    data: nameInterface.encodeFunctionData('text', [node, key]),
                })),
            }),
        });

        const results = await response.json();

        return results.reduce(
            (acc: TextRecords, { data, reverted }: any, index: number) => {
                if (!reverted && data && data !== '0x') {
                    try {
                        const value = nameInterface.decodeFunctionResult(
                            'text',
                            data,
                        )[0];
                        if (value) {
                            acc[ENS_TEXT_RECORDS[index]] = value;
                        }
                    } catch (error) {
                        console.error(
                            `Failed to decode text record for ${ENS_TEXT_RECORDS[index]}:`,
                            error,
                        );
                    }
                }

                return acc;
            },
            {},
        );
    } catch (error) {
        console.error('Error fetching text records:', error);
        throw error;
    }
};

export const getTextRecordsQueryKey = (
    domain?: string,
    network?: NETWORK_TYPE,
) => ['VECHAIN_KIT_TEXT_RECORDS', domain, network];

export const useGetTextRecords = (domain?: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = network.nodeUrl ?? getConfig(network.type).nodeUrl;

    return useQuery({
        queryKey: getTextRecordsQueryKey(domain, network.type),
        queryFn: () => getTextRecords(nodeUrl, network.type, domain),
        enabled: !!domain && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useIsDomainProtected.ts`

````typescript
import { getConfig } from '@/config';
import { VeworldSubdomainClaimer__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import { useQuery } from '@tanstack/react-query';
import { ABIContract } from '@vechain/sdk-core';

export const getIsDomainProtectedQueryKey = (domain?: string) => [
    'VECHAIN_KIT_DOMAIN',
    domain,
    'IS_DOMAIN_PROTECTED',
];

// Convert readonly ABI to mutable Abi type
const subdomainClaimerABI = ABIContract.ofAbi(VeworldSubdomainClaimer__factory.abi as any);

const getIsDomainProtected = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    domain?: string,
) => {
    const contractAddress =
        getConfig(network).veWorldSubdomainClaimerContractAddress;

    const res = await thor.contracts
        .load(contractAddress, subdomainClaimerABI.abi)
        .read.isDomainProtected(domain);

    return res[0] as boolean;
};

/**
 * Custom hook to fetch the protection status of a VeChain domain.
 *
 * @param {string} [domain] - The domain to fetch the protection status for.
 * @param {boolean} [enabled=true] - Flag to enable or disable the hook.
 * @returns The result of the useQuery hook, with the protection status.
 */
export const useIsDomainProtected = (domain?: string, enabled = true) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getIsDomainProtectedQueryKey(domain),
        queryFn: () => getIsDomainProtected(thor, network.type, domain),
        enabled: !!domain && enabled && !!network.type,
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useUnsetDomain.ts`

````typescript
import {
    UseSendTransactionReturnValue,
    useSendTransaction,
    useWallet,
} from '@/hooks';
import { useCallback } from 'react';
import { VetDomainsReverseRegistrar__factory } from '@vechain/vechain-contract-types';
import { useQueryClient } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useVeChainKitConfig, VeChainKitConfig } from '@/providers';
import { humanAddress } from '@/utils';
import { invalidateAndRefetchDomainQueries } from './utils/domainQueryUtils';
import { Wallet } from '@/types';
import { TransactionClause } from '@vechain/sdk-core';

type useUnsetDomainProps = {
    onSuccess?: () => void;
    onError?: () => void;
};

type useUnsetDomainReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: () => TransactionClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ReverseRegistrarInterface = VetDomainsReverseRegistrar__factory.createInterface();

const buildUnsetDomainClauses = (account: Wallet, network: VeChainKitConfig['network']): TransactionClause[] => {
    const clausesArray: any[] = [];

    // When unsetting domain, we only need to call setName with an empty string
    clausesArray.push({
        to: getConfig(network.type).vetDomainsReverseRegistrarAddress,
        value: '0x0',
        data: ReverseRegistrarInterface.encodeFunctionData('setName', ['']),
        comment: `Unsetting your current VeChain nickname of the account ${humanAddress(
            account?.address ?? '',
            4,
            4,
        )}`,
        abi: ReverseRegistrarInterface.getFunction('setName'),
    });

    return clausesArray;
};

/**
 * Hook for unsetting any domain name (both .veworld.vet and .vet domains)
 *
 * This hook is a dedicated implementation for the unset functionality
 * that was previously part of the claim hooks.
 */
export const useUnsetDomain = ({
    onSuccess,
    onError,
}: useUnsetDomainProps): useUnsetDomainReturnValue => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();

    const clauses = useCallback(() => buildUnsetDomainClauses(account, network), [account, network]);

    // Refetch queries to update UI after the tx is confirmed
    const handleOnSuccess = useCallback(async () => {
        const address = account?.address ?? '';

        // Invalidate all domain-related queries
        await invalidateAndRefetchDomainQueries(
            queryClient,
            address,
            '', // No domain being set
            '', // No subdomain
            '', // No full domain
            network.type,
        );

        onSuccess?.();
    }, [onSuccess, queryClient, account, network.type]);

    const result = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: 'Sign to unset your VeChain nickname',
            description: 'Unset your current VeChain nickname',
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: handleOnSuccess,
        onTxFailedOrCancelled: onError,
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            return result.sendTransaction(clauses());
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useUpdateTextRecord.ts`

````typescript
import { Interface, namehash } from 'ethers';
import { useCallback } from 'react';
import { UseSendTransactionReturnValue, useSendTransaction } from '@/hooks';
import { TransactionClause } from '@vechain/sdk-core';
import { getKitSponsoredDelegatorUrl } from '@/utils';

const nameInterface = new Interface([
    'function resolver(bytes32 node) returns (address resolverAddress)',
    'function setText(bytes32 node, string key, string value) external',
]);

type UpdateTextRecordVariables = {
    domain: string;
    key: string;
    value: string;
};

type UseUpdateTextRecordProps = {
    onSuccess?: () => void | Promise<void>;
    onError?: (error?: Error) => void | Promise<void>;
    signerAccountAddress?: string;
    resolverAddress?: string;
};

type UseUpdateTextRecordReturnValue = {
    sendTransaction: (params: UpdateTextRecordVariables[]) => Promise<void> | undefined;
    clauses: (params: UpdateTextRecordVariables[]) => TransactionClause[]; // Synchronous!
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

export const buildClauses = (resolverAddress: string, params: UpdateTextRecordVariables[]): TransactionClause[] => {
    const clauses = [];

    for (const { domain, key, value } of params) {
        if (!domain) throw new Error('Domain is required');
        if (!resolverAddress)
            throw new Error('Resolver address is required');

        const node = namehash(domain);

        clauses.push({
            to: resolverAddress,
            data: nameInterface.encodeFunctionData('setText', [
                node,
                key,
                value,
            ]),
            value: '0',
            comment: `Update ${key} record`,
        });
    }
    return clauses;
};

export const useUpdateTextRecord = ({
    onSuccess,
    onError,
    signerAccountAddress,
    resolverAddress,
}: UseUpdateTextRecordProps = {}): UseUpdateTextRecordReturnValue => {
    // Always call useCallback unconditionally - keep it synchronous!
    const buildClausesCallback = useCallback(
        (params: UpdateTextRecordVariables[]) => {
            if (!resolverAddress) {
                throw new Error('Resolver address is required');
            }
            return buildClauses(resolverAddress, params);
        },
        [resolverAddress]
    );

    const result = useSendTransaction({
        signerAccountAddress,
        onTxConfirmed: async () => {
            await onSuccess?.();
        },
        onTxFailedOrCancelled: async () => {
            await onError?.();
        },
        privyUIOptions: {
            title: 'Update Profile Information',
            description:
                'Update the profile information associated with your domain',
            buttonText: 'Sign to continue',
        },
    });

    return {
        ...result,
        clauses: buildClausesCallback, // Return the callback directly
        sendTransaction: async (params: UpdateTextRecordVariables[]) => {
            // Route through VeChain's sponsored delegator so users without
            // VTHO / B3TR can still update their profile records.
            return result.sendTransaction(
                buildClausesCallback(params),
                getKitSponsoredDelegatorUrl(),
            );
        },
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/useVechainDomain.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getAddressDomain, getDomainAddress, isValidDomain, isPrimaryDomain } from '@vechain/contract-getters';
import { isValidAddress } from '@/utils/addressUtils';

interface VeChainDomainResult {
    address?: string;
    domain?: string;
    isValidAddressOrDomain: boolean;
    isPrimaryDomain: boolean;
}


// Lowercase the key so mixed-case and lowercase callers share the cache.
export const getVechainDomainQueryKey = (addressOrDomain?: string | null) => [
    'VECHAIN_KIT_DOMAIN',
    addressOrDomain?.toLowerCase() ?? addressOrDomain,
];

export const useVechainDomain = (addressOrDomain?: string | null) => {
    const { network } = useVeChainKitConfig();

    return useQuery<VeChainDomainResult>({
        queryKey: getVechainDomainQueryKey(addressOrDomain),
        queryFn: async () => {
            if (!addressOrDomain) throw new Error('Address or domain is required');

            // VNS contracts only exist on mainnet and testnet
            if (network.type !== 'main' && network.type !== 'test') {
                const isAddress = isValidAddress(addressOrDomain);
                return {
                    address: isAddress ? addressOrDomain : undefined,
                    domain: undefined,
                    isValidAddressOrDomain: isAddress,
                    isPrimaryDomain: false,
                };
            }

            // Determine input type
            const isDomain = await isValidDomain(addressOrDomain, {
                networkUrl: network.nodeUrl,
            });
            const isAddress = isValidAddress(addressOrDomain);

            // Validate that input is either a valid domain or valid address
            if (!isDomain && !isAddress) {
                throw new Error('Input must be a valid domain or address');
            }

            let address: string | null = null;
            let domain: string | null = null;
            let isPrimary = false;

            if (isDomain) {
                // Input is a domain, get the corresponding address
                address = await getDomainAddress(addressOrDomain, {
                    networkUrl: network.nodeUrl,
                });
                domain = addressOrDomain;

                // Check if this domain is the primary domain for the address
                if (address) {
                    isPrimary = await isPrimaryDomain(addressOrDomain, address.toLowerCase(), {
                        networkUrl: network.nodeUrl,
                    });
                }
            } else {
                // Lowercase to bypass ethers' strict EIP-55 check in
                // `@vechain/contract-getters` (fails on mixed-case input).
                const normalizedAddress = addressOrDomain.toLowerCase();
                domain = await getAddressDomain(normalizedAddress, {
                    networkUrl: network.nodeUrl,
                });
                address = addressOrDomain;

                // If we found a domain, check if it's the primary domain
                if (domain) {
                    isPrimary = await isPrimaryDomain(domain, normalizedAddress, {
                        networkUrl: network.nodeUrl,
                    });
                }
            }

            return {
                address: address || undefined,
                domain: domain || undefined,
                isValidAddressOrDomain: isDomain || isAddress,
                isPrimaryDomain: isPrimary,
            };
        },
        enabled: !!addressOrDomain && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') ||
                    errorMessage.includes('abort') ||
                    errorMessage === 'address or domain is required' ||
                    errorMessage === 'input must be a valid domain or address') {
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
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/utils/domainQueryUtils.ts`

````typescript
import {
    getAvatarOfAddressQueryKey,
    getDomainsOfAddressQueryKey,
    getEnsRecordExistsQueryKey,
    getTextRecordsQueryKey,
    getVechainDomainQueryKey,
    getAvatarQueryKey,
} from '@/hooks';
import { QueryClient } from '@tanstack/react-query';
import { NETWORK_TYPE } from '@/config/network';

/**
 * Invalidates and refetches all domain-related queries
 *
 * @param queryClient - The React Query client
 * @param address - The user's address
 * @param fullDomain - The full domain name (e.g. 'subdomain.veworld.vet')
 * @param subdomain - The subdomain part
 * @param domain - The domain part (e.g. 'veworld.vet')
 * @param networkType - The network type
 */
export const invalidateAndRefetchDomainQueries = async (
    queryClient: QueryClient,
    address: string,
    fullDomain: string,
    subdomain: string,
    domain: string,
    networkType: NETWORK_TYPE,
): Promise<void> => {
    // First invalidate all related queries
    await Promise.all([
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(address),
        }),
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(fullDomain),
        }),
        queryClient.invalidateQueries({
            queryKey: getEnsRecordExistsQueryKey(subdomain),
        }),
        queryClient.invalidateQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
        }),
        queryClient.invalidateQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
        }),
        queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(fullDomain),
        }),
    ]);

    // Also ensure domains are properly refetched
    await Promise.all([
        queryClient.refetchQueries({
            queryKey: getVechainDomainQueryKey(address),
        }),
        queryClient.refetchQueries({
            queryKey: getVechainDomainQueryKey(fullDomain),
        }),
        queryClient.refetchQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.vet'),
        }),
        queryClient.refetchQueries({
            queryKey: getDomainsOfAddressQueryKey(address, '.veworld.vet'),
        }),
        queryClient.refetchQueries({
            queryKey: getAvatarQueryKey(subdomain + '.' + domain, networkType),
        }),
        queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(fullDomain),
        }),
        queryClient.refetchQueries({
            queryKey: getEnsRecordExistsQueryKey(subdomain),
        }),
        queryClient.refetchQueries({
            queryKey: getAvatarOfAddressQueryKey(address),
        }),
    ]);
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useBalances.ts`

````typescript
/**
 * This file exists only for documentation purposes.
 * The useBalances hook has been refactored into specialized hooks:
 *
 * - useTokenBalances: Get raw token balances
 * - useTokenPrices: Get token prices
 * - useTokensWithValues: Get tokens with their values in different currencies
 * - useTotalBalance: Get total balance across all tokens
 *
 * Please update your imports to use the appropriate specialized hook.
 */

// Re-export from the new specialized hooks
export { useTokenBalances } from './useTokenBalances';
export { useTokenPrices } from './useTokenPrices';
export { useTokensWithValues } from './useTokensWithValues';
export { useTotalBalance } from './useTotalBalance';
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useCurrentAllocationsRoundId.ts`

````typescript
import { getConfig } from '@/config';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

const abi = XAllocationVoting__factory.abi;
const method = 'currentRoundId' as const;

/**
 * Returns the query key for fetching the current allocations round ID.
 * @returns The query key for fetching the current allocations round ID.
 */
export const getCurrentAllocationsRoundIdQueryKey = (address: string) =>
    getCallClauseQueryKey({ abi, address, method });

/**
 * Hook to get the current roundId of allocations voting
 * @returns the current roundId of allocations voting
 */
export const useCurrentAllocationsRoundId = () => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationVotingContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [],
        queryOptions: {
            select: (data) => data[0].toString(),
        },
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useCustomTokens.ts`

````typescript
import { LocalStorageKey, useLocalStorage } from '@/hooks';
import { compareAddresses } from '@/utils';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { type CustomTokenInfo } from '@vechain/contract-getters';

import {  getTokenInfo } from './useGetCustomTokenInfo';

export const useCustomTokens = () => {
    const [customTokens, setCustomTokens] = useLocalStorage<CustomTokenInfo[]>(
        LocalStorageKey.CUSTOM_TOKENS,
        [],
    );
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();

    const addToken = async (address: CustomTokenInfo['address']) => {
        if (!isTokenIncluded(address) && !isDefaultToken(address)) {
            if (!network.nodeUrl) throw new Error('Network node URL is required');
            const tokenInfo = await getTokenInfo( address, network.nodeUrl);

            const token: CustomTokenInfo = {
                ...tokenInfo,
                address,
            };

            setCustomTokens([...customTokens, token]);
        }
    };

    const removeToken = (address: string) => {
        setCustomTokens(
            customTokens.filter((t: CustomTokenInfo) => t.address !== address),
        );
    };

    const isTokenIncluded = (address: string) => {
        return customTokens.some((t: CustomTokenInfo) =>
            compareAddresses(t.address, address),
        );
    };

    const isDefaultToken = (address: string) => {
        // Get contract addresses from config
        const defaultAddresses = {
            vet: '0x', // VET has no contract address since it's the native token
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
        };

        return Object.values(defaultAddresses).includes(address);
    };

    return {
        customTokens,
        addToken,
        removeToken,
        isTokenIncluded,
        isDefaultToken,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetB3trBalance.ts`

````typescript
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { formatTokenBalance } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getErc20Balance } from '@vechain/contract-getters';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getB3trBalanceQueryKey = (address?: string) =>
    VECHAIN_KIT_QUERY_KEYS.balance.b3tr(address);

export const useGetB3trBalance = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { b3trContractAddress } = useAppConfig();

    return useQuery({
        queryKey: getB3trBalanceQueryKey(address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getErc20Balance(
                b3trContractAddress,
                address,
                { networkUrl: network.nodeUrl },
            );

            if (!res) throw new Error('Failed to get b3tr balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: !!address && !!network.type,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetCustomTokenBalances.ts`

````typescript
import { useQueries } from '@tanstack/react-query';
import { useCustomTokens } from '@/hooks';
import {
    type CustomTokenInfo,
    getErc20Balance,
} from '@vechain/contract-getters';
import { TokenBalance } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';
import { formatTokenBalance, isValidAddress } from '@/utils';

export type TokenWithBalance = CustomTokenInfo & TokenBalance;

export const getCustomTokenBalanceQueryKey = (
    tokenAddress?: string,
    address?: string,
    decimals?: number,
) =>
    VECHAIN_KIT_QUERY_KEYS.balance.customToken(
        tokenAddress,
        address,
        Number.isFinite(decimals) ? decimals : 18,
    );

export const useGetCustomTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: customTokens.map((token) => ({
            queryKey: getCustomTokenBalanceQueryKey(
                token.address,
                address,
                Number(token.decimals),
            ),
            queryFn: async () => {
                if (!token.address)
                    throw new Error('Token address is required');
                if (!address) throw new Error('Address is required');
                if (!network.nodeUrl)
                    throw new Error('Network node URL is required');
                const tokenBalanceOriginal = await getErc20Balance(
                    token.address,
                    address,
                    {
                        networkUrl: network.nodeUrl,
                    },
                );
                if (!tokenBalanceOriginal)
                    throw new Error('Failed to get token balance');
                const formattedTokenBalance = formatTokenBalance(
                    tokenBalanceOriginal[0],
                    Number(token.decimals),
                );
                return {
                    ...token,
                    ...formattedTokenBalance,
                };
            },
            enabled:
                !!address &&
                isValidAddress(address) &&
                !!token.address &&
                isValidAddress(token.address) &&
                !!network.nodeUrl,
        })),
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetCustomTokenInfo.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
import { getTokenInfo as getTokenInfoFromContract, type CustomTokenInfo } from '@vechain/contract-getters';

export const getTokenInfo = async (tokenAddress: string, networkUrl: string): Promise<CustomTokenInfo> => {
    return getTokenInfoFromContract(tokenAddress, {
        networkUrl,
    });
};

export const getCustomTokenInfoQueryKey = (tokenAddress: string) => [
    'VECHAIN_KIT_CUSTOM_TOKEN_INFO',
    tokenAddress,
];

export const useGetCustomTokenInfo = (tokenAddress: string) => {
    const { network } = useVeChainKitConfig();

    return useQuery<CustomTokenInfo>({
        queryKey: getCustomTokenInfoQueryKey(tokenAddress),
        queryFn: async () => {
            if (!tokenAddress) throw new Error('Token address is required');
            if (!network.nodeUrl) throw new Error('Network node URL is required');
            return getTokenInfo(tokenAddress, network.nodeUrl);
        },
        enabled: !!network.type && !!tokenAddress,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') ||
                    errorMessage.includes('abort') ||
                    errorMessage === 'token address is required' ||
                    errorMessage === 'network node url is required') {
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
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetErc20Balance.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';

import { getErc20Balance } from '@vechain/contract-getters';
import { formatTokenBalance } from '@/utils';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getErc20BalanceQueryKey = (
    tokenAddress: string,
    address?: string,
) => VECHAIN_KIT_QUERY_KEYS.balance.erc20(tokenAddress, address);

export type UseGetErc20BalanceOptions = {
    enabled?: boolean;
};

export const useGetErc20Balance = (
    tokenAddress: string,
    address?: string,
    options?: UseGetErc20BalanceOptions,
) => {
    const { network } = useVeChainKitConfig();
    const baseEnabled = !!address && !!network.type;

    return useQuery({
        queryKey: getErc20BalanceQueryKey(tokenAddress, address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getErc20Balance(tokenAddress, address, {
                networkUrl: network.nodeUrl,
            });

            if (!res) throw new Error('Failed to get vot3 balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: baseEnabled && (options?.enabled ?? true),
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetTokenUsdPrice.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { OracleVechainEnergy__factory } from '@vechain/vechain-contract-types';
import { BigNumber } from 'bignumber.js';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

// Create an enum or object for supported price feed IDs
export const PRICE_FEED_IDS = {
    B3TR: '0x623374722d757364000000000000000000000000000000000000000000000000',
    VET: '0x7665742d75736400000000000000000000000000000000000000000000000000',
    VTHO: '0x7674686f2d757364000000000000000000000000000000000000000000000000',
    GBP: '0x6762702d75736400000000000000000000000000000000000000000000000000',
    EUR: '0x657572742d757364000000000000000000000000000000000000000000000000',
} as const;

export type SupportedToken = keyof typeof PRICE_FEED_IDS;

// Rename and make the function generic
export const getTokenUsdPrice = async (
    thor: ThorClient,
    token: SupportedToken,
    network: NETWORK_TYPE,
): Promise<number> => {
    const res = await thor.contracts
        .load(
            getConfig(network).oracleContractAddress,
            OracleVechainEnergy__factory.abi,
        )
        .read.getLatestValue(PRICE_FEED_IDS[token]);

    if (!res) throw new Error(`Failed to get price of ${token}`);

    return new BigNumber(res[0].toString()).div(1e12).toNumber() as number;
};

export const getTokenUsdPriceQueryKey = (token: SupportedToken) =>
    VECHAIN_KIT_QUERY_KEYS.price.token(token);

export const useGetTokenUsdPrice = (token: SupportedToken) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getTokenUsdPriceQueryKey(token),
        queryFn: async () => getTokenUsdPrice(thor, token, network.type),
        enabled: !!thor && !!network.type,
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
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useGetVot3Balance.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { formatTokenBalance } from '@/utils';
import { getErc20Balance } from '@vechain/contract-getters';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const getVot3BalanceQueryKey = (address?: string) =>
    VECHAIN_KIT_QUERY_KEYS.balance.vot3(address);

export const useGetVot3Balance = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { vot3ContractAddress } = useAppConfig();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => {
            if (!address) throw new Error('Address is required');
            const res = await getErc20Balance(
                vot3ContractAddress,
                address,
                { networkUrl: network.nodeUrl },
            );

            if (!res) throw new Error('Failed to get vot3 balance');

            const original = res[0];
            return formatTokenBalance(original);
        },
        enabled: !!address && !!network.type,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useIsPerson.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers';
import { getIsPerson } from '@vechain/contract-getters';

/**
 * Returns the query key for fetching the isPerson status.
 * @param user - The user address.
 * @param networkType - The network type.
 * @returns The query key for fetching the isPerson status.
 */
export const getIsPersonQueryKey = (user: string, networkType: NETWORK_TYPE) => [
    'VECHAIN_KIT',
    'IS_PERSON',
    user,
    networkType,
];

/**
 * Hook to get the isPerson status from the VeBetterPassport contract.
 * @param user - The user address.
 * @returns The isPerson status.
 */
export const useIsPerson = (user?: string | null) => {
    const { network } = useVeChainKitConfig();

    return useQuery<boolean>({
        queryKey: getIsPersonQueryKey(user ?? '', network.type),
        queryFn: async () => {
            if (!user) throw new Error('User address is required');

            return getIsPerson(user, {
                networkUrl: network.nodeUrl,
            });
        },
        enabled: !!user && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation or validation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') ||
                    errorMessage.includes('abort') ||
                    errorMessage === 'user address is required') {
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
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useMostVotedAppsInRound.ts`

````typescript
import { useMemo } from 'react';
import { useRoundXApps } from './useRoundXApps';
import { useXAppsShares } from './useXAppShares';

export type XApp = {
    id: string;
    teamWalletAddress: string;
    name: string;
    metadataURI: string;
    createdAtTimestamp: string;
};

export type MostVotedAppsInRoundReturnType = {
    percentage: number;
    id: string;
    app: XApp;
};

/**
 * Get the most voted apps in a round
 *
 * @param roundId the id of the round to get the most voted apps
 * @returns a sorted array of the most voted apps in the round
 */
export const useMostVotedAppsInRound = (
    roundId?: string,
): { data: MostVotedAppsInRoundReturnType[]; isLoading: boolean } => {
    const { data: apps } = useRoundXApps(roundId);

    // get shares of apps
    const xAppsShares = useXAppsShares(
        apps?.map((app) => app.id) ?? [],
        roundId,
    );

    const mostVotedApps = useMemo(
        () =>
            xAppsShares.data
                ?.map((appShares) => ({
                    percentage: appShares.share + appShares.unallocatedShare,
                    id: apps?.find((xa) => xa.id === appShares.app)?.id ?? '',
                    app:
                        apps?.find((xa) => xa.id === appShares.app) ??
                        ({} as XApp),
                }))
                .sort((a, b) => Number(b.percentage) - Number(a.percentage)) ??
            [],
        [xAppsShares.data, apps],
    );

    return {
        data: mostVotedApps,
        isLoading: xAppsShares.isLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useOraclePriceChanges24h.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { OracleVechainEnergy__factory } from '@vechain/vechain-contract-types';
import { BigNumber } from 'bignumber.js';
import { decodeEventLog as viemDecodeEventLog, Hex as ViemHex } from 'viem';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { getEventLogs } from '@/hooks/thor/logs/logUtils';
import { PRICE_FEED_IDS, SupportedToken } from './useGetTokenUsdPrice';

// VeChain block time is ~10s → 8640 blocks/day.
const BLOCKS_PER_DAY = 8640;
const PRICE_SCALE_DECIMALS = 12;

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

export type PricePoint = { timestamp: number; value: number };

export type OracleHistory24h = {
    /** All emitted ValueUpdate observations per token, ascending by time. */
    history: Partial<Record<SupportedToken, PricePoint[]>>;
    /** Current spot value per token (USD). */
    latest: Partial<Record<SupportedToken, number>>;
};

export type PriceChanges24h = Partial<Record<SupportedToken, number>>;

const scaleToUsd = (raw: bigint) =>
    new BigNumber(raw.toString()).shiftedBy(-PRICE_SCALE_DECIMALS).toNumber();

/**
 * Shared 24h oracle scan: fetches every `ValueUpdate` emitted by
 * `OracleVechainEnergy` over the last day plus the current spot for each
 * supported feed. Multiple downstream hooks (`useOraclePriceChanges24h`,
 * `useTokenPriceHistory24h`, the portfolio chart) all derive from this single
 * query so we never run the same RPC scan twice in a session.
 */
export const useOracleHistory24h = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const oracleAddress = getConfig(network.type).oracleContractAddress;

    return useQuery<OracleHistory24h>({
        queryKey: [
            'VECHAIN_KIT',
            'ORACLE_HISTORY_24H',
            network.type,
            oracleAddress,
        ],
        enabled: !!thor && !!oracleAddress,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        queryFn: async () => {
            const head = await thor.blocks.getBestBlockExpanded();
            if (!head) return { history: {}, latest: {} };

            const oracle = thor.contracts.load(
                oracleAddress,
                OracleVechainEnergy__factory.abi,
            );

            const feedEntries = Object.entries(PRICE_FEED_IDS) as Array<
                [SupportedToken, string]
            >;

            // Spot values for the latest point on every chart.
            const latestEntries = await Promise.all(
                feedEntries.map(async ([token, feedId]) => {
                    try {
                        const res = await oracle.read.getLatestValue(
                            feedId as `0x${string}`,
                        );
                        const raw = (res as readonly bigint[])[0];
                        return [token, scaleToUsd(raw)] as const;
                    } catch {
                        return [token, null] as const;
                    }
                }),
            );
            const latest: OracleHistory24h['latest'] = {};
            for (const [token, value] of latestEntries) {
                if (value != null) latest[token] = value;
            }

            // Scan ValueUpdate over the past 24h. Density is low enough
            // (~30 events across all feeds per day) that 256 is plenty.
            const fromBlock = Math.max(0, head.number - BLOCKS_PER_DAY);
            const eventAbi = oracle.getEventAbi('ValueUpdate');
            const events = await getEventLogs({
                thor,
                nodeUrl: network.nodeUrl,
                from: fromBlock,
                to: head.number,
                order: 'asc',
                limit: 256,
                filterCriteria: [
                    {
                        criteria: { address: oracleAddress },
                        eventAbi,
                    },
                ],
            });

            const byFeedId = new Map<string, PricePoint[]>();
            for (const event of events) {
                try {
                    const decoded = viemDecodeEventLog({
                        abi: OracleVechainEnergy__factory.abi,
                        data: event.data.toString() as ViemHex,
                        topics: event.topics.map((t) => t.toString()) as Topics,
                    });
                    if (decoded.eventName !== 'ValueUpdate') continue;
                    const args = decoded.args as unknown as {
                        id: string;
                        value: bigint;
                    };
                    const key = args.id.toLowerCase();
                    const list = byFeedId.get(key) ?? [];
                    list.push({
                        timestamp: Number(event.meta.blockTimestamp),
                        value: scaleToUsd(args.value),
                    });
                    byFeedId.set(key, list);
                } catch {
                    // ignore malformed entries
                }
            }

            const history: OracleHistory24h['history'] = {};
            const now = Math.floor(Date.now() / 1000);
            for (const [token, feedId] of feedEntries) {
                const points = byFeedId.get(feedId.toLowerCase()) ?? [];
                // Pin the current value as the closing point so the chart
                // always extends to "now" even if there hasn't been an
                // event for hours.
                const latestValue = latest[token];
                const closing: PricePoint | null =
                    latestValue != null
                        ? { timestamp: now, value: latestValue }
                        : null;
                const merged = closing ? [...points, closing] : points;
                if (merged.length) history[token] = merged;
            }

            return { history, latest };
        },
    });
};

export const useOraclePriceChanges24h = () => {
    const { data } = useOracleHistory24h();
    const result: PriceChanges24h = {};
    if (data?.history) {
        for (const [token, points] of Object.entries(data.history) as Array<
            [SupportedToken, PricePoint[]]
        >) {
            if (!points || points.length < 2) continue;
            const first = points[0].value;
            const last = points[points.length - 1].value;
            if (!first) continue;
            const change = ((last - first) / first) * 100;
            if (Number.isFinite(change)) result[token] = change;
        }
    }
    return { data: result };
};

/** Per-token sparkline points (ascending by timestamp). */
export const useTokenPriceHistory24h = (token?: SupportedToken) => {
    const { data, isLoading } = useOracleHistory24h();
    const points = token ? (data?.history?.[token] ?? []) : [];
    return { points, isLoading };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/usePortfolioPriceHistory24h.ts`

````typescript
import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import {
    PricePoint,
    useOracleHistory24h,
} from './useOraclePriceChanges24h';
import { useAppConfig } from '@/providers';
import { useStargatePositions } from '../staking/useStargatePositions';
import { useNavigatorPosition } from '../staking/useNavigatorPosition';
import { useJuicyPosition } from '../staking/useJuicyPosition';
import { useBetterSwapLpPositions } from '../staking/useBetterSwapLpPositions';

type Holdings = {
    vet: number;
    vtho: number;
    b3tr: number; // includes B3TR + VOT3 + veDelegate (same price feed)
    /**
     * USD value that doesn't have a clean per-feed mapping (e.g. BetterSwap
     * LP positions whose underlying split varies per pair). Treated as a
     * flat offset on every point — not perfectly accurate in motion but
     * keeps the chart's totals matching the wallet's headline number.
     */
    flatUsdOffset: number;
};

const VET_SENTINEL = '0x';

const liveBalance = (raw: string | undefined) => Number(raw ?? '0') || 0;

const buildPortfolioPoints = (
    holdings: Holdings,
    feeds: {
        vet?: PricePoint[];
        vtho?: PricePoint[];
        b3tr?: PricePoint[];
    },
): PricePoint[] => {
    const vet = feeds.vet ?? [];
    const vtho = feeds.vtho ?? [];
    const b3tr = feeds.b3tr ?? [];
    if (!vet.length && !vtho.length && !b3tr.length) return [];

    const timestamps = Array.from(
        new Set([
            ...vet.map((p) => p.timestamp),
            ...vtho.map((p) => p.timestamp),
            ...b3tr.map((p) => p.timestamp),
        ]),
    ).sort((a, b) => a - b);

    let vetIdx = 0;
    let vthoIdx = 0;
    let b3trIdx = 0;
    let vetValue = vet[0]?.value ?? 0;
    let vthoValue = vtho[0]?.value ?? 0;
    let b3trValue = b3tr[0]?.value ?? 0;

    const points: PricePoint[] = [];
    for (const ts of timestamps) {
        while (vetIdx < vet.length && vet[vetIdx].timestamp <= ts) {
            vetValue = vet[vetIdx].value;
            vetIdx++;
        }
        while (vthoIdx < vtho.length && vtho[vthoIdx].timestamp <= ts) {
            vthoValue = vtho[vthoIdx].value;
            vthoIdx++;
        }
        while (b3trIdx < b3tr.length && b3tr[b3trIdx].timestamp <= ts) {
            b3trValue = b3tr[b3trIdx].value;
            b3trIdx++;
        }
        const total =
            holdings.vet * vetValue +
            holdings.vtho * vthoValue +
            holdings.b3tr * b3trValue +
            holdings.flatUsdOffset;
        points.push({ timestamp: ts, value: total });
    }
    return points;
};

export const usePortfolioPriceHistory24h = (address?: string) => {
    const config = useAppConfig();
    const { data, isLoading: historyLoading } = useOracleHistory24h();
    const { balances, isLoading: balancesLoading } = useTokenBalances(address);
    const stargate = useStargatePositions(address);
    const navigator = useNavigatorPosition(address);
    const juicy = useJuicyPosition(address);
    const lp = useBetterSwapLpPositions(address);

    const holdings = useMemo<Holdings>(() => {
        // Balances are pre-scaled (string of human units, e.g. "12.34").
        const find = (addr: string) =>
            balances.find(
                (b) => b.address.toLowerCase() === addr.toLowerCase(),
            )?.balance;
        const liquidVet = liveBalance(find(VET_SENTINEL));
        const liquidVtho = liveBalance(find(config.vthoContractAddress));
        const liquidVvet = liveBalance(find(config.vvetContractAddress));
        const liquidB3tr = liveBalance(find(config.b3trContractAddress));
        const liquidVot3 = liveBalance(find(config.vot3ContractAddress));
        const liquidVeDelegate = liveBalance(find(config.veDelegate));

        // Stargate stakes are denominated in VET.
        const stargateVet = stargate.positions.reduce(
            (sum, p) => sum + p.vetAmountFormatted,
            0,
        );

        // Navigators: B3TR feed for both staked (navigator) and delegated
        // (citizen) positions — the contract operates on B3TR amounts.
        const navigatorB3tr =
            (navigator.isNavigator ? navigator.stakedB3TR : 0) +
            (navigator.isDelegated ? navigator.delegatedAmount : 0);

        // Juicy: per-asset net = supplied - borrowed, matched against the
        // canonical token addresses for VET (via VVET), VTHO, B3TR.
        const vvetLower = config.vvetContractAddress.toLowerCase();
        const vthoLower = config.vthoContractAddress.toLowerCase();
        const b3trLower = config.b3trContractAddress.toLowerCase();
        const juicyNetByFeed = { vet: 0, vtho: 0, b3tr: 0 };
        for (const p of juicy.supplied) {
            const a = p.asset.toLowerCase();
            if (a === vvetLower) juicyNetByFeed.vet += p.amount;
            else if (a === vthoLower) juicyNetByFeed.vtho += p.amount;
            else if (a === b3trLower) juicyNetByFeed.b3tr += p.amount;
        }
        for (const p of juicy.borrowed) {
            const a = p.asset.toLowerCase();
            if (a === vvetLower) juicyNetByFeed.vet -= p.amount;
            else if (a === vthoLower) juicyNetByFeed.vtho -= p.amount;
            else if (a === b3trLower) juicyNetByFeed.b3tr -= p.amount;
        }

        // BetterSwap LP positions split across two arbitrary assets — treat
        // their current USD value as a flat offset rather than try to
        // attribute amounts to specific feeds.
        const flatUsdOffset = lp.totalValueUsd;

        return {
            vet: liquidVet + liquidVvet + stargateVet + juicyNetByFeed.vet,
            vtho: liquidVtho + juicyNetByFeed.vtho,
            b3tr:
                liquidB3tr +
                liquidVot3 +
                liquidVeDelegate +
                navigatorB3tr +
                juicyNetByFeed.b3tr,
            flatUsdOffset,
        };
    }, [
        balances,
        config.vthoContractAddress,
        config.vvetContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        stargate.positions,
        navigator.isNavigator,
        navigator.isDelegated,
        navigator.stakedB3TR,
        navigator.delegatedAmount,
        juicy.supplied,
        juicy.borrowed,
        lp.totalValueUsd,
    ]);

    const points = useMemo(
        () =>
            buildPortfolioPoints(holdings, {
                vet: data?.history?.VET,
                vtho: data?.history?.VTHO,
                b3tr: data?.history?.B3TR,
            }),
        [holdings, data?.history],
    );

    return {
        points,
        isLoading:
            historyLoading ||
            balancesLoading ||
            stargate.isLoading ||
            navigator.isLoading ||
            juicy.isLoading ||
            lp.isLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useRefreshBalances.ts`

````typescript
import { useQueryClient } from '@tanstack/react-query';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export const useRefreshBalances = () => {
    const queryClient = useQueryClient();

    const refresh = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: VECHAIN_KIT_QUERY_KEYS.balance.all,
            }),
            queryClient.invalidateQueries({
                queryKey: VECHAIN_KIT_QUERY_KEYS.price.all,
            }),
        ]);
    };

    return { refresh };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useRefreshMetadata.ts`

````typescript
import { useQueryClient } from '@tanstack/react-query';
import {
    getAvatarOfAddressQueryKey,
    getAvatarQueryKey,
    getTextRecordsQueryKey,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

export const useRefreshMetadata = (domain: string, address: string) => {
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const refresh = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: getAvatarQueryKey(domain ?? '', network.type),
            }),
            queryClient.invalidateQueries({
                queryKey: getTextRecordsQueryKey(domain, network.type),
            }),
            queryClient.invalidateQueries({
                queryKey: getAvatarOfAddressQueryKey(address),
            }),
        ]);
    };

    return { refresh };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useRoundXApps.ts`

````typescript
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { XAllocationVoting__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '@/hooks';

const abi = XAllocationVoting__factory.abi;
const method = 'getAppsOfRound' as const;

export const getRoundXAppsQueryKey = (
    roundId: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKeyWithArgs({
        abi,
        address: getConfig(networkType)
            .xAllocationVotingContractAddress as `0x${string}`,
        method,
        args: [BigInt(roundId ?? 0)],
    });

export const useRoundXApps = (roundId?: string) => {
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationVotingContractAddress as `0x${string}`;

    return useCallClause({
        abi,
        address,
        method,
        args: [BigInt(roundId ?? 0)],
        queryOptions: {
            enabled: !!roundId,
            select: (data) =>
                data[0].map((app) => ({
                    id: app.id.toString(),
                    teamWalletAddress: app.teamWalletAddress,
                    name: app.name,
                    metadataURI: app.metadataURI,
                    createdAtTimestamp: app.createdAtTimestamp.toString(),
                })),
        },
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useSwitchWallet.ts`

````typescript
import { useState, useCallback } from 'react';
import { useDAppKitWallet, useWallet } from '@/hooks';
import { useWalletStorage, StoredWallet } from './useWalletStorage';
import { isBrowser } from '@/utils/ssrUtils';

export type UseSwitchWalletReturnType = {
    switchWallet: () => Promise<void>;
    isSwitching: boolean;
    getStoredWallets: () => StoredWallet[];
    setActiveWallet: (address: string) => void;
    removeWallet: (address: string) => void;
    isInAppBrowser: boolean;
    /**
     * Whether the wallet-switch UI should be exposed to the user.
     * - VeWorld in-app browser: requires the wallet to advertise
     *   `thor_switchWallet` (`isSwitchWalletEnabled`).
     * - External browser (desktop or mobile) on dapp-kit: always true except
     *   for WalletConnect, where the session exposes a single account and
     *   doesn't support `wallet_requestPermissions` / `thor_switchWallet`,
     *   so "Switch" would only trigger a full reconnect.
     * - Privy / social-login / cross-app: false (no dapp-kit connection).
     */
    canSwitchWallet: boolean;
};

/**
 * Hook for switching wallets
 * - In VeWorld in-app browser: Uses dapp-kit's switchWallet function
 * - On desktop: Provides wallet storage functions for UI-based switching
 */
export const useSwitchWallet = (): UseSwitchWalletReturnType => {
    const {
        switchWallet: dappKitSwitchWallet,
        isSwitchWalletEnabled,
        source: dappKitSource,
    } = useDAppKitWallet();
    const { connection } = useWallet();
    const [isSwitching, setIsSwitching] = useState(false);
    const {
        getStoredWallets: getStoredWalletsStorage,
        setActiveWallet: setActiveWalletStorage,
        removeWallet: removeWalletStorage,
    } = useWalletStorage();

    const isInAppBrowser = connection.isInAppBrowser;

    const canSwitchWallet = isInAppBrowser
        ? isSwitchWalletEnabled
        : connection.isConnectedWithDappKit &&
          dappKitSource !== 'wallet-connect';

    const switchWallet = useCallback(async () => {
        if (isInAppBrowser) {
            // In-app browser: use dapp-kit's switchWallet
            if (!dappKitSwitchWallet) {
                return;
            }

            setIsSwitching(true);
            try {
                await dappKitSwitchWallet();
            } catch {
                // Silently handle errors - wallet state will update automatically on success
            } finally {
                setIsSwitching(false);
            }
        } else {
            // Desktop: wallet switching is handled via UI (SelectWalletContent)
            // This function is called but navigation is handled by components
            return Promise.resolve();
        }
    }, [dappKitSwitchWallet, isInAppBrowser]);

    const setActiveWallet = useCallback(
        (address: string) => {
            setActiveWalletStorage(address);
            // Dispatch event to trigger wallet change
            if (isBrowser()) {
                window.dispatchEvent(
                    new CustomEvent('wallet_switched', { detail: { address } }),
                );
            }
        },
        [setActiveWalletStorage],
    );

    return {
        switchWallet,
        isSwitching,
        getStoredWallets: getStoredWalletsStorage,
        setActiveWallet,
        removeWallet: removeWalletStorage,
        isInAppBrowser,
        canSwitchWallet,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useTokenBalances.ts`

````typescript
import { useMemo } from 'react';
import {
    useAccountBalance,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetErc20Balance,
    useGetCustomTokenBalances,
} from '@/hooks';
import { useAppConfig, useVeChainKitConfig } from '@/providers';

export type WalletTokenBalance = {
    address: string;
    symbol: string;
    balance: string;
};

export const useTokenBalances = (address?: string) => {
    const { network, allowCommunityTokens } = useVeChainKitConfig();
    const config = useAppConfig();

    // Base token balances
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);
    const { data: b3trBalance, isLoading: b3trLoading } =
        useGetB3trBalance(address);
    const { data: vot3Balance, isLoading: vot3Loading } =
        useGetVot3Balance(address);
    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetErc20Balance(config.veDelegateTokenContractAddress, address);
    const { data: vvetBalance, isLoading: vvetLoading } = useGetErc20Balance(
        config.vvetContractAddress,
        address,
        { enabled: !!config.vvetContractAddress },
    );
    const { data: sassBalance, isLoading: sassLoading } = useGetErc20Balance(
        config.sassContractAddress,
        address,
        { enabled: allowCommunityTokens },
    );

    // Custom token balances
    const customTokenBalancesQueries = useGetCustomTokenBalances(address);
    const customTokenBalances = customTokenBalancesQueries
        .map((query) => query.data)
        .filter(Boolean);
    const customTokensLoading = customTokenBalancesQueries.some(
        (query) => query.isLoading,
    );

    // Get all balances
    const balances = useMemo(() => {
        if (!address) return [];

        // Get contract addresses from config
        const contractAddresses = {
            vet: '0x',
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
            vvet: config.vvetContractAddress,
        };

        // Base tokens
        const baseTokens: WalletTokenBalance[] = [
            {
                address: contractAddresses.vet,
                symbol: 'VET',
                balance: vetData?.balance || '0',
            },
            {
                address: contractAddresses.vtho,
                symbol: 'VTHO',
                balance: vetData?.energy || '0',
            },
            {
                address: contractAddresses.b3tr,
                symbol: 'B3TR',
                balance: b3trBalance?.scaled ?? '0',
            },
            {
                address: contractAddresses.vot3,
                symbol: 'VOT3',
                balance: vot3Balance?.scaled ?? '0',
            },
            {
                address: contractAddresses.veDelegate,
                symbol: 'veDelegate',
                balance: veDelegateBalance?.scaled ?? '0',
            },
        ];

        if (contractAddresses.vvet) {
            baseTokens.push({
                address: contractAddresses.vvet,
                symbol: 'VVET',
                balance: vvetBalance?.scaled ?? '0',
            });
        }

        // Add custom tokens
        const customTokens: WalletTokenBalance[] = customTokenBalances.map(
            (token) => ({
                address: token?.address || '',
                symbol: token?.symbol || '',
                balance: token?.scaled || '0',
            }),
        );

        const communityTokens: WalletTokenBalance[] = allowCommunityTokens
            ? [
                  {
                      address: config.sassContractAddress,
                      symbol: 'SASS',
                      balance: sassBalance?.scaled ?? '0',
                  },
              ]
            : [];

        return [...baseTokens, ...customTokens, ...communityTokens];
    }, [
        address,
        vetData,
        b3trBalance,
        vot3Balance,
        veDelegateBalance,
        vvetBalance,
        customTokenBalances,
        allowCommunityTokens,
        sassBalance,
        config.sassContractAddress,
        config.vvetContractAddress,
        network.type,
    ]);

    const isLoading =
        vetLoading ||
        b3trLoading ||
        vot3Loading ||
        veDelegateLoading ||
        (!!config.vvetContractAddress && vvetLoading) ||
        (allowCommunityTokens && sassLoading) ||
        customTokensLoading;

    return {
        balances,
        isLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useTokenPrices.ts`

````typescript
import { useMemo } from 'react';
import { useAppConfig } from '@/providers';
import { useGetTokenUsdPrice } from './useGetTokenUsdPrice';
import { useOraclePriceChanges24h } from './useOraclePriceChanges24h';

export type ExchangeRates = {
    eurUsdPrice: number;
    gbpUsdPrice: number;
};

export const useTokenPrices = () => {
    const config = useAppConfig();

    // Fetch base token prices
    const { data: vetUsdPrice, isLoading: vetUsdPriceLoading } =
        useGetTokenUsdPrice('VET');
    const { data: vthoUsdPrice, isLoading: vthoUsdPriceLoading } =
        useGetTokenUsdPrice('VTHO');
    const { data: b3trUsdPrice, isLoading: b3trUsdPriceLoading } =
        useGetTokenUsdPrice('B3TR');
    const { data: eurUsdPrice, isLoading: eurToUsdLoading } =
        useGetTokenUsdPrice('EUR');
    const { data: gbpUsdPrice, isLoading: gbpToUsdLoading } =
        useGetTokenUsdPrice('GBP');
    const { data: priceChanges24h } = useOraclePriceChanges24h();

    // Get all prices as a map
    const prices = useMemo(() => {
        const contractAddresses = {
            vet: '0x',
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
            SASS: config.sassContractAddress,
            vvet: config.vvetContractAddress,
        };

        // Original-cased keys (used by useTokensWithValues against the
        // balances' contract addresses, which are also the raw config values).
        const map: Record<string, number> = {
            [contractAddresses.vet]: vetUsdPrice || 0,
            [contractAddresses.vtho]: vthoUsdPrice || 0,
            [contractAddresses.b3tr]: b3trUsdPrice || 0,
            // VOT3 and veDelegate share the same price feed as B3TR
            [contractAddresses.vot3]: b3trUsdPrice || 0,
            [contractAddresses.veDelegate]: b3trUsdPrice || 0,
            [contractAddresses.SASS]: 0,
        };
        // VVET (wrapped VET) is priced 1:1 with VET
        if (contractAddresses.vvet) {
            map[contractAddresses.vvet] = vetUsdPrice || 0;
        }
        // Mirror with lowercase keys so callers that normalize addresses
        // (e.g. indexer responses) can still resolve a price.
        for (const key of Object.keys(map)) {
            const lower = key.toLowerCase();
            if (lower !== key && map[lower] === undefined) {
                map[lower] = map[key];
            }
        }
        return map;
    }, [
        vetUsdPrice,
        vthoUsdPrice,
        b3trUsdPrice,
        config.vthoContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        config.sassContractAddress,
        config.vvetContractAddress,
    ]);

    const priceChanges = useMemo(() => {
        const map: Record<string, number> = {};
        if (!priceChanges24h) return map;
        const vetChange = priceChanges24h.VET;
        const vthoChange = priceChanges24h.VTHO;
        const b3trChange = priceChanges24h.B3TR;
        if (vetChange !== undefined) map['0x'] = vetChange;
        if (vthoChange !== undefined)
            map[config.vthoContractAddress] = vthoChange;
        if (b3trChange !== undefined) {
            map[config.b3trContractAddress] = b3trChange;
            // VOT3 and veDelegate share the same price feed as B3TR.
            map[config.vot3ContractAddress] = b3trChange;
            map[config.veDelegate] = b3trChange;
        }
        if (vetChange !== undefined && config.vvetContractAddress) {
            map[config.vvetContractAddress] = vetChange;
        }
        // Mirror with lowercase keys.
        for (const key of Object.keys(map)) {
            const lower = key.toLowerCase();
            if (lower !== key && map[lower] === undefined) {
                map[lower] = map[key];
            }
        }
        return map;
    }, [
        priceChanges24h,
        config.vthoContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        config.vvetContractAddress,
    ]);

    const exchangeRates: ExchangeRates = useMemo(
        () => ({
            eurUsdPrice: eurUsdPrice || 1,
            gbpUsdPrice: gbpUsdPrice || 1,
        }),
        [eurUsdPrice, gbpUsdPrice],
    );

    const isLoading =
        vetUsdPriceLoading ||
        vthoUsdPriceLoading ||
        b3trUsdPriceLoading ||
        eurToUsdLoading ||
        gbpToUsdLoading;

    return {
        prices,
        priceChanges,
        exchangeRates,
        isLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useTokensWithValues.ts`

````typescript
import { useMemo } from 'react';
import { useTokenBalances, WalletTokenBalance } from './useTokenBalances';
import { useTokenPrices } from './useTokenPrices';
import {
    SupportedCurrency,
    convertToSelectedCurrency,
} from '@/utils/currencyUtils';
import { useCurrency } from '../../utils/useCurrency';

export type TokenWithValue = WalletTokenBalance & {
    priceUsd: number;
    valueUsd: number;
    valueInCurrency: number;
    priceChange24hPct?: number;
};

type UseTokensWithValuesProps = {
    address?: string;
};

export const useTokensWithValues = ({
    address = '',
}: UseTokensWithValuesProps) => {
    const { balances, isLoading: balancesLoading } = useTokenBalances(address);
    const {
        prices,
        priceChanges,
        exchangeRates,
        isLoading: pricesLoading,
    } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const tokensWithValues = useMemo(() => {
        return balances.map((token) => {
            const priceUsd = prices[token.address] || 0;
            const valueUsd = Number(token.balance) * priceUsd;
            const valueInCurrency = convertToSelectedCurrency(
                valueUsd,
                currentCurrency as SupportedCurrency,
                exchangeRates,
            );
            const priceChange24hPct = priceChanges?.[token.address];

            return {
                ...token,
                priceUsd,
                valueUsd,
                valueInCurrency,
                priceChange24hPct,
            };
        });
    }, [balances, prices, priceChanges, currentCurrency, exchangeRates]);

    // Get sorted tokens (by value)
    const sortedTokens = useMemo(() => {
        return [...tokensWithValues].sort(
            (a, b) => b.valueInCurrency - a.valueInCurrency,
        );
    }, [tokensWithValues]);

    // Get tokens with positive balances
    const tokensWithBalance = useMemo(() => {
        return sortedTokens.filter((token) => Number(token.balance) > 0);
    }, [sortedTokens]);

    const isLoading = balancesLoading || pricesLoading;

    return {
        tokens: tokensWithValues,
        sortedTokens,
        tokensWithBalance,
        isLoading,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useTotalBalance.ts`

````typescript
import { useMemo } from 'react';
import { useTokensWithValues } from './useTokensWithValues';
import {
    SupportedCurrency,
    formatCompactCurrency,
} from '@/utils/currencyUtils';
import { useCurrency } from '../../utils/useCurrency';
import { useStargatePositions } from '../staking/useStargatePositions';
import { useNavigatorPosition } from '../staking/useNavigatorPosition';
import { useBetterSwapLpPositions } from '../staking/useBetterSwapLpPositions';
import { useJuicyPosition } from '../staking/useJuicyPosition';

type UseTotalBalanceProps = {
    address?: string;
};

export const useTotalBalance = ({ address = '' }: UseTotalBalanceProps) => {
    const { tokensWithBalance, isLoading: tokensLoading } = useTokensWithValues(
        { address },
    );
    const { currentCurrency } = useCurrency();

    const stargate = useStargatePositions(address);
    const navigator = useNavigatorPosition(address);
    const lp = useBetterSwapLpPositions(address);
    const juicy = useJuicyPosition(address);

    const liquidBalanceInCurrency = useMemo(
        () =>
            tokensWithBalance.reduce(
                (total, token) => total + token.valueInCurrency,
                0,
            ),
        [tokensWithBalance],
    );

    const liquidBalanceUsd = useMemo(
        () =>
            tokensWithBalance.reduce(
                (total, token) => total + token.valueUsd,
                0,
            ),
        [tokensWithBalance],
    );

    // Weighted 24h change across liquid holdings with a known change.
    // Staking positions inherit the same per-token change (Stargate ~ VET,
    // Navigators ~ B3TR, BetterSwap LP averaged via its underlying pair).
    const priceChange24hPct = useMemo(() => {
        let valueWeighted = 0;
        let valueCovered = 0;
        for (const token of tokensWithBalance) {
            if (typeof token.priceChange24hPct !== 'number') continue;
            valueWeighted += token.valueUsd * token.priceChange24hPct;
            valueCovered += token.valueUsd;
        }
        if (valueCovered === 0) return undefined;
        return valueWeighted / valueCovered;
    }, [tokensWithBalance]);

    const stakingInCurrency =
        stargate.totalValueInCurrency +
        navigator.totalValueInCurrency +
        lp.totalValueInCurrency +
        juicy.netValueInCurrency;
    const stakingUsd =
        stargate.totalValueUsd +
        navigator.totalValueUsd +
        lp.totalValueUsd +
        juicy.netValueUsd;

    const totalBalanceInCurrency = liquidBalanceInCurrency + stakingInCurrency;
    const totalBalanceUsd = liquidBalanceUsd + stakingUsd;

    const formattedBalance = useMemo(
        () =>
            formatCompactCurrency(totalBalanceInCurrency, {
                currency: currentCurrency as SupportedCurrency,
            }),
        [totalBalanceInCurrency, currentCurrency],
    );

    const isLoading =
        tokensLoading ||
        stargate.isLoading ||
        navigator.isLoading ||
        lp.isLoading ||
        juicy.isLoading;

    const hasAnyBalance = tokensWithBalance.length > 0 || stakingUsd > 0;

    return {
        totalBalanceInCurrency,
        totalBalanceUsd,
        liquidBalanceInCurrency,
        liquidBalanceUsd,
        stakingInCurrency,
        stakingUsd,
        priceChange24hPct,
        formattedBalance,
        isLoading,
        hasAnyBalance,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useXAppMetadata.tsx`

````tsx
import { getConfig } from '@/config';
import { X2EarnApps__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { useThor } from '@vechain/dapp-kit-react';
import { convertUriToUrl } from '@/utils';
import { NETWORK_TYPE } from '@/config/network';
import { useQuery } from '@tanstack/react-query';

/**
 * The metadata of an xApp from the xApps metadata base uri
 * @property name - The name of the xApp
 * @property description - The description of the xApp
 * @property distribution_strategy - The B3TR distribution strategy of the xApp
 * @property external_url - The external url of the xApp
 * @property logo - The logo of the xApp (ipfs uri)
 * @property banner - The banner of the xApp (ipfs uri)
 * @property screenshots - The screenshots of the xApp (ipfs uri)
 * @property social_urls - The social urls of the xApp
 * @property app_urls - The app urls of the xApp
 * @property categories - The categories of the xApp
 */
export type XAppMetadata = {
    name: string;
    description: string;
    distribution_strategy?: string;
    external_url: string;
    logo: string;
    banner: string;
    screenshots: string[];
    social_urls: {
        name: string;
        url: string;
    }[];
    app_urls: {
        code: string;
        url: string;
    }[];
    tweets: string[];
    ve_world: {
        banner: string;
    };
    categories: string[];
};
/**
  dapp-kit broke the pre-fetching
   * @param uri  - The uri of the xApps metadata
   * @returns  The metadata of the xApp see {@link XAppMetadata}
   */
export const getXAppMetadata = async (
    uri: string,
    networkType: NETWORK_TYPE,
): Promise<XAppMetadata | undefined> => {
    const url = convertUriToUrl(uri, networkType) || '';
    const response = await fetch(url, {
        signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata = await response.json();
    return metadata;
};

const abi = X2EarnApps__factory.abi;

export const useXAppMetadata = (xAppId: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: ['xAppMetaData', xAppId],
        queryFn: async () => {
            const address = getConfig(network.type).x2EarnAppsContractAddress;
            const contract = thor.contracts.load(address, abi);

            const appDetailsResult = await contract.read.app(
                xAppId as `0x${string}`,
            );

            const appDetails = appDetailsResult[0] as unknown as unknown[];
            const metadataURI = appDetails[3]?.toString() || '';

            const [baseUri] = await contract.read.baseURI();
            const metadata = await getXAppMetadata(
                `${baseUri}${metadataURI}`,
                network.type,
            );

            return metadata;
        },
        enabled: !!xAppId,
    });
};
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/useXAppShares.ts`

````typescript
import { useQuery } from '@tanstack/react-query';
import { XAllocationPool__factory } from '@vechain/vechain-contract-types';
import { getConfig } from '@/config';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';

const abi = XAllocationPool__factory.abi;
const method = 'getAppShares' as const;

/**
 *  Returns the query key for the shares of multiple xApps in an allocation round.
 * @param roundId  the roundId the get the shares for
 */
export const getXAppsSharesQueryKey = (roundId?: number | string) => [
    'VECHAIN_KIT',
    'XApps',
    'Shares',
    roundId,
];

/**
 * Fetch shares of multiple xApps in an allocation round
 * @param apps  the xApps to get the shares for
 * @param roundId  the round id to get the shares for
 * @returns  the shares (% of allocation pool) for the xApps in the round { allocated: number, unallocated: number }
 *
 */
export const useXAppsShares = (apps: string[], roundId?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    const address = getConfig(network.type)
        .xAllocationPoolContractAddress as `0x${string}`;

    return useQuery({
        queryKey: getXAppsSharesQueryKey(roundId),
        queryFn: async () => {
            const shares = await executeMultipleClausesCall({
                thor,
                calls: apps.map(
                    (app) =>
                        ({
                            abi,
                            functionName: method,
                            address,
                            args: [roundId, app],
                        } as const),
                ),
            });

            return shares.map((share, index) => {
                return {
                    app: apps[index] as string,
                    share: Number(share[0] || 0) / 100,
                    unallocatedShare: Number(share[1] || 0) / 100,
                };
            });
        },
        enabled: !!roundId && !!apps.length,
    });
};
````

## Source: `packages/vechain-kit/src/utils/swap/README.md`

# Swap Aggregators Configuration

## Overview

The swap aggregator system provides a unified interface for interacting with multiple DEX aggregators on VeChain. Each aggregator implements the `SwapAggregator` interface, allowing the system to fetch quotes, simulate transactions, and build executable transaction clauses.

## Process Flow

### 1. Aggregator Initialization

```typescript
const aggregators = getSwapAggregators(networkType);
```

The `getSwapAggregators` function returns an array of configured aggregators for the specified network (main, test, or solo). Currently supported aggregators:

- **VeTrade.vet**: API-based aggregator that returns complex swap instructions
- **BetterSwap.io**: Uniswap V2 compatible router-based aggregator

### 2. Quote Fetching

For each aggregator, the system calls `getQuote()`:

```typescript
const quote = await aggregator.getQuote(params, thor);
```

**Input Parameters (`SwapParams`):**
- `fromTokenAddress`: Source token address (use `0x` or zero address for native VET)
- `toTokenAddress`: Destination token address
- `amountIn`: Input amount in raw format (Wei)
- `userAddress`: Address of the user making the swap
- `slippageTolerance`: Optional slippage percentage (default: 1%)

**Output (`SwapQuote`):**
- `aggregatorName`: Name of the aggregator
- `aggregator`: Reference to the aggregator instance
- `outputAmount`: Expected output amount (bigint)
- `minimumOutputAmount`: Minimum output considering slippage (bigint)
- `priceImpact`: Optional price impact percentage
- `data`: Aggregator-specific data (clauses, paths, etc.)

### 3. Transaction Simulation

After obtaining quotes, each quote is simulated to estimate gas costs and verify execution:

```typescript
const simulation = await aggregator.simulateSwap(params, quote, thor);
```

**Simulation Process:**
1. Builds transaction clauses using `buildSwapTransaction()`
2. Simulates the transaction on the VeChain network
3. Calculates gas costs (converted to VTHO)
4. Verifies token inflows/outflows match expected amounts
5. Checks for transaction reverts

**Output (`SwapSimulation`):**
- `gasCostVTHO`: Estimated gas cost in VTHO
- `success`: Whether simulation succeeded
- `error`: Error message if simulation failed

### 4. Quote Selection

The system filters and ranks quotes:
- Filters out quotes with zero output amounts
- Filters out quotes that reverted during simulation
- Selects the quote with the highest `outputAmount` among non-reverted quotes

### 5. Transaction Execution

When a user executes a swap:

```typescript
const clauses = await quote.aggregator.buildSwapTransaction(params, quote);
await sendTransaction(clauses);
```

The aggregator builds the final transaction clauses, which are then sent to the network.

## Clause Building

Each aggregator implements `buildSwapTransaction()` to construct VeChain transaction clauses. The implementation varies by aggregator type:

### Uniswap V2 Compatible

Use direct contract calls to a Uniswap V2 compatible router.

**For VET-to-Token swaps:**
1. Single clause: `swapExactETHForTokens`
   - Sends VET as `value` in the clause
   - Parameters: `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → VET swaps:**
1. Approve clause: `approve` on the ERC20 token
   - Approves router to spend `amountIn`
2. Swap clause: `swapExactTokensForETH`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**For Token → Token swaps:**
1. Approve clause: `approve` on the ERC20 token
2. Swap clause: `swapExactTokensForTokens`
   - Parameters: `amountIn`, `amountOutMin`, `path`, `recipient`, `deadline`

**Path Construction:**
- Native VET is replaced with wrapped VET (WVET) address in paths
- Path: `[fromToken, toToken]` (direct swap) or multi-hop paths

**Deadline:**
- Set to 20 minutes from current time (Unix timestamp)

### API-Based

Fetches interface and parameters from an API and encodes function calls locally.

**Process:**
1. Fetches quote from API endpoint
2. Receives clauses with function call specifications (ABI, function name, args)
3. Encodes function calls locally using viem's `encodeFunctionData`
4. Filters clauses to only include those targeting supported addresses to ensure interaction is limited to whitelisted contracts
5. Adds approve clause if swapping from ERC20 token (not VET)

**Clause Structure:**
- Each clause contains: `to`, `value`, `data` (encoded function call), `comment`
- Function calls are encoded using the ABI and arguments provided by the API

**Approve Clause Addition:**
- If `fromTokenAddress` is not VET, an approve clause is prepended
- Approves the router (first supported address) to spend `amountIn`

## Expected API Output

The API returns quotes in the following format:

### Request

Sample from VeTrade.vet:

```text
GET https://vetrade.vet/api/quote/vck?fromAddress={tokenAddress}&toAddress={tokenAddress}&amountIn={amount}&recipient={userAddress}&slippageBps={basisPoints}&network={networkType}
```

**Query Parameters:**
- `fromAddress`: Source token address (hex string)
- `toAddress`: Destination token address (hex string)
- `amountIn`: Input amount as decimal string
- `recipient`: User address receiving output tokens
- `slippageBps`: Slippage in basis points (e.g., 100 = 1%)
- `network`: Network type (`main`, `test`, or `solo`)

### Response

```typescript
interface APIQuoteResponse {
    amountOut: string;              // Expected output amount (decimal string)
    amountOutMin: string;            // Minimum output with slippage (decimal string)
    clauses: Array<{
        to: string;                 // Contract address to call
        value: string;              // VET value to send (hex or decimal string)
        comment?: string;           // Optional description
        functionCall: {
            functionName?: string;  // Function name (or use 'name')
            name?: string;          // Alternative function name field
            abi: Abi | Array<{      // Function ABI or inputs array
                name: string;
                type: string;
                internalType?: string;
                components?: Array<{...}>; // For struct types
            }>;
            args: unknown[];        // Function arguments
        };
    }>;
    path: string[];                 // Token swap path
}
```

### Response Example

```json
{
  "amountOut": "1000000000000000000",
  "amountOutMin": "990000000000000000",
  "clauses": [
    {
      "to": "0xE5fA980a6EfE5B79C2150a529da06AeF455963b6",
      "value": "0",
      "comment": "Swap on VeTrade",
      "functionCall": {
        "functionName": "swapExactTokensForTokens",
        "abi": [
          {
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "name": "path",
            "type": "address[]"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "args": [
          "1000000000000000000",
          "990000000000000000",
          ["0xTokenA", "0xTokenB"],
          "0xUserAddress",
          "1234567890"
        ]
      }
    }
  ],
  "path": ["0xTokenA", "0xTokenB"]
}
```

### ABI Format Handling

The API may provide ABIs in two formats:

1. **Full Function ABI**: Complete function definition with `name`, `type`, `inputs`, `outputs`, `stateMutability`
2. **Inputs Array**: Just the inputs array, which is converted to a full function ABI locally

The system normalizes both formats before encoding function calls.

### Clause Filtering

Only clauses targeting addresses in `supportedAddresses` are used. This ensures security by restricting which contracts can be called.

## Adding New Aggregators

To add a new aggregator:

1. **Create aggregator module** in `packages/vechain-kit/src/utils/swap/`
   - Implement the `SwapAggregator` interface
   - Export a factory function (e.g., `createMyAggregator`)

2. **Import and register** in `swapAggregators.ts`:
   ```typescript
   import { createMyAggregator } from '@/utils/swap/myAggregator';

   export const getSwapAggregators = (networkType: NETWORK_TYPE): SwapAggregator[] => [
       createVeTradeAggregator(networkType),
       createBetterSwapAggregator(networkType),
       createMyAggregator(networkType), // Add here
   ];
   ```

3. **Implement required methods:**
   - `getQuote()`: Fetch or calculate swap quote
   - `simulateSwap()`: Simulate transaction execution
   - `buildSwapTransaction()`: Build transaction clauses
   - `name`: Display name
   - `getIcon()`: React icon component

## Network Configuration

Each aggregator must handle three network types:

- **main**: VeChain mainnet
- **test**: VeChain testnet
- **solo**: Local VeChain Solo network

Network-specific addresses and endpoints are configured within each aggregator module.

## Error Handling

- **Quote failures**: Return quote with `outputAmount: 0n` (filtered out)
- **Simulation failures**: Quote marked with `reverted: true` and `revertReason`
- **Transaction building failures**: Throw error to prevent execution
- **API failures**: Log error and return empty quote

## Gas Estimation

Gas costs are calculated during simulation:
- Base gas: 200,000 units (VeChain transaction base cost)
- Additional gas per clause: `gasUsed` from simulation result
- Conversion: `gasCostVTHO = totalGas / 1e5`

## Token Flow Verification

During simulation, the system verifies:
- **Outflow**: User's token outflow matches `amountIn`
- **Inflow**: User's token inflow meets `minimumOutputAmount` (if specified)

This verification works for both ERC20 tokens and native VET, ensuring swap integrity.

## Source: `packages/vechain-kit/src/utils/swap/apiAggregator.ts`

````typescript
import { TransactionClause } from '@vechain/sdk-core';
import { SwapAggregator, SwapQuote, SwapSimulation, SwapParams } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import { encodeFunctionData } from 'viem';
import type { Abi, AbiFunction } from 'viem';
import { simulateSwapWithClauses } from './simulateSwap';

/**
 * API response structure from VeTrade API
 */
interface APIQuoteResponse {
    amountOut: string;
    amountOutMin: string;
    clauses: Array<{
        to: string;
        value: string;
        comment?: string;
        functionCall: {
            functionName?: string; // API may use functionName
            name?: string; // Or name
            abi: Abi | Array<{
                name: string;
                type: string;
                internalType?: string;
                components?: Array<{
                    name: string;
                    type: string;
                    internalType?: string;
                }>;
            }>; // ABI may be just inputs array or full ABI
            args: unknown[];
        };
    }>;
    path: string[];
}

/**
 * Configuration for an API-based aggregator
 */
export interface ApiAggregatorConfig {
    /**
     * Name of the aggregator (e.g., "VeTrade")
     */
    name: string;
    /**
     * Base URL for the API endpoint
     */
    apiBaseUrl: string;
    /**
     * Network type (main, test, or solo)
     */
    network: NETWORK_TYPE;
    /**
     * Icon component factory function
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
    /**
     * List of supported contract addresses for interaction
     * Clauses will be filtered to only include those targeting these addresses
     */
    supportedAddresses?: string[];
}

/**
 * Convert hex value to decimal string for TransactionClause
 * TransactionClause expects value as a string representation of the number
 */
const hexToDecimalString = (hexValue: string): string => {
    if (!hexValue.startsWith('0x')) {
        return hexValue;
    }
    return BigInt(hexValue).toString();
};

/**
 * Convert inputs array to full function ABI format expected by viem
 */
const buildFunctionABI = (
    functionName: string,
    inputs: Array<{
        name: string;
        type: string;
        internalType?: string;
        components?: Array<{
            name: string;
            type: string;
            internalType?: string;
        }>;
    }>
): AbiFunction => {
    return {
        name: functionName,
        type: 'function',
        inputs: inputs.map(input => ({
            name: input.name,
            type: input.type,
            internalType: input.internalType,
            components: input.components,
        })),
        outputs: [], // Empty outputs array for encoding (not needed for encoding)
        stateMutability: 'nonpayable',
    };
};

/**
 * Normalize ABI to full function format if needed
 */
const normalizeABI = (
    abi: APIQuoteResponse['clauses'][0]['functionCall']['abi'],
    functionName: string
): Abi => {
    // Check if ABI is already in full format (has function definitions)
    if (Array.isArray(abi) && abi.length > 0) {
        const firstItem = abi[0];

        // If it's already a function definition with name and type, return as is
        if (typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem && firstItem.type === 'function') {
            return abi as unknown as Abi;
        }

        // Check if this is an inputs array (has name/type but not function structure)
        // An inputs array item will have name/type but won't have stateMutability or outputs
        if (typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem) {
            const hasFunctionStructure = 'stateMutability' in firstItem || 'outputs' in firstItem;
            if (!hasFunctionStructure) {
                // This is likely just the inputs array, convert to full function ABI
                const inputsArray = abi as unknown as Array<{
                    name: string;
                    type: string;
                    internalType?: string;
                    components?: Array<{
                        name: string;
                        type: string;
                        internalType?: string;
                    }>;
                }>;
                const functionABI = buildFunctionABI(functionName, inputsArray);
                return [functionABI] as Abi;
            }
        }
    }

    // Return as is if already in correct format
    return abi as unknown as Abi;
};

/**
 * Encode function call data using ABI, function name, and arguments
 */
const encodeFunctionCallData = (functionCall: APIQuoteResponse['clauses'][0]['functionCall']): string => {
    try {
        // Get function name from either functionName or name field
        const functionName = functionCall.functionName || functionCall.name;

        if (!functionName) {
            throw new Error('Function name is required (either functionName or name must be provided)');
        }

        // Normalize ABI to full function format
        const normalizedABI = normalizeABI(functionCall.abi, functionName);

        // Use viem's encodeFunctionData to encode the function call
        return encodeFunctionData({
            abi: normalizedABI,
            functionName: functionName,
            args: functionCall.args,
        });
    } catch (error) {
        console.error('Failed to encode function call:', error);
        const functionName = functionCall.functionName || functionCall.name || 'unknown';
        throw new Error(`Failed to encode function call ${functionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Convert API clause format to TransactionClause format
 * Encodes function call data locally using the provided ABI, function name, and arguments
 */
const convertApiClauseToTransactionClause = (apiClause: APIQuoteResponse['clauses'][0]): TransactionClause => {
    // Encode the function call data locally
    const encodedData = encodeFunctionCallData(apiClause.functionCall);

    return {
        to: apiClause.to,
        value: hexToDecimalString(apiClause.value),
        data: encodedData,
        comment: apiClause.comment || `Swap on aggregator`,
    };
};

/**
 * Create a SwapAggregator instance that fetches quotes from an API
 */
export const createApiAggregator = (config: ApiAggregatorConfig): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: config.name,
        getIcon: config.getIcon,

        async getQuote(params: SwapParams, _thor: ThorClient): Promise<SwapQuote> {
            try {
                // Build query parameters
                const queryParams = new URLSearchParams({
                    fromAddress: params.fromTokenAddress,
                    toAddress: params.toTokenAddress,
                    amountIn: params.amountIn,
                    recipient: params.userAddress,
                    slippageBps: String((params.slippageTolerance || 1) * 100), // Convert percentage to basis points
                    network: config.network,
                });

                // Fetch quote from API
                const quoteUrl = new URL(config.apiBaseUrl);
                quoteUrl.search = queryParams.toString();
                const response = await fetch(quoteUrl);

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const quoteData: APIQuoteResponse = await response.json();

                // Convert API clauses to TransactionClause format
                const clauses = quoteData.clauses.map(convertApiClauseToTransactionClause);

                // Convert amounts to bigint
                const outputAmount = BigInt(quoteData.amountOut);
                const minimumOutputAmount = BigInt(quoteData.amountOutMin);

                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount,
                    minimumOutputAmount,
                    priceImpact: 0,
                    data: {
                        clauses,
                        path: quoteData.path,
                    },
                };
            } catch (error) {
                console.error(`${config.name} getQuote failed:`, error);
                // Return empty quote on error
                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount: 0n,
                    priceImpact: 0,
                    minimumOutputAmount: 0n,
                    data: {
                        clauses: [],
                        path: [],
                    },
                };
            }
        },

        async simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation> {
            try {
                // Build transaction clauses using the same logic as buildSwapTransaction
                // This ensures simulation uses the same filtered clauses that will be executed
                const clauses = await this.buildSwapTransaction(params, quote);

                // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
                return simulateSwapWithClauses(params, quote, clauses, thor);
            } catch (error) {
                return {
                    gasCostVTHO: 0,
                    success: false,
                    error: error instanceof Error ? error.message : 'Failed to build swap transaction for simulation',
                };
            }
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]> {

            // Extract clauses from quote data
            if (!quote.data || typeof quote.data !== 'object' || !('clauses' in quote.data)) {
                throw new Error('Invalid quote data: clauses not found');
            }

            let clauses = quote.data.clauses as TransactionClause[];

            if (clauses.length === 0) {
                throw new Error('No clauses found in quote');
            }

            // Filter clauses to only include those targeting supported addresses
            if (config.supportedAddresses && config.supportedAddresses.length > 0) {
                const supportedAddressesLower = config.supportedAddresses.map(addr => addr.toLowerCase());
                clauses = clauses.filter(clause => {
                    if (!clause.to) return false;
                    return supportedAddressesLower.includes(clause.to.toLowerCase());
                });

                if (clauses.length === 0) {
                    throw new Error('No clauses found matching supported addresses');
                }
            }

            // Validate minimum output amount
            if (!quote.minimumOutputAmount || quote.minimumOutputAmount === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is missing or zero');
            }

            // Return the filtered clauses from the API response
            // These clauses are already in the correct format for execution
            return clauses;
        },
    };

    return aggregator;
};
````

## Source: `packages/vechain-kit/src/utils/swap/betterSwap.tsx`

````tsx
import { SwapAggregator } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { zeroAddress, type Address } from 'viem';
import { createUniswapV2Aggregator } from './uniswapV2Aggregator';
import { BetterSwapLogo } from '@/assets/icons';
import React from 'react';

/**
 * BetterSwap router and wrapped VET addresses for different networks
 */
const BETTERSWAP_ADDRESSES: Record<NETWORK_TYPE, { routerAddress: Address; wrappedVET: Address }> = {
    main: {
        routerAddress: '0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89' as Address,
        wrappedVET: '0xf9b02b47694fd635A413F16dC7B38aF06Cc16fe5' as Address,
    },
    test: {
        routerAddress: zeroAddress,
        wrappedVET: zeroAddress,
    },
    solo: {
        routerAddress: zeroAddress,
        wrappedVET: zeroAddress,
    },
};

/**
 * Create BetterSwap aggregator instance for a specific network
 *
 * BetterSwap Router Contract addresses vary by network
 * Uses Uniswap V2 compatible interface
 *
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createBetterSwapAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    const addresses = BETTERSWAP_ADDRESSES[networkType] ?? BETTERSWAP_ADDRESSES['main'];

    return createUniswapV2Aggregator({
        name: 'BetterSwap.io',
        routerAddress: addresses.routerAddress,
        wrappedVET: addresses.wrappedVET,
        getIcon: (boxSize = '20px') => React.createElement(BetterSwapLogo, { boxSize }),
    });
};
````

## Source: `packages/vechain-kit/src/utils/swap/extractSwapAmounts.ts`

````typescript
import { decodeEventLog, zeroAddress } from 'viem';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import type { TransactionReceipt, Event, Transfer } from '@vechain/sdk-network';

/**
 * Check if address is native VET token
 */
const isVET = (address: string): boolean => {
    return address === '0x' || address === zeroAddress || !address;
};

/**
 * Extract swap amounts from transaction receipt by parsing Transfer events
 * @param receipt Transaction receipt containing events
 * @param userAddress User's wallet address
 * @param fromTokenAddress Address of the token being swapped from
 * @param toTokenAddress Address of the token being swapped to
 * @returns Object containing formatted amounts and symbols, or null if not found
 */
export const extractSwapAmounts = (
    receipt: TransactionReceipt,
    userAddress: string,
    fromTokenAddress: string,
    toTokenAddress: string,
): {
    fromAmount: bigint;
    toAmount: bigint;
} | null => {
    if (!receipt || !userAddress || !fromTokenAddress || !toTokenAddress) {
        return null;
    }

    const userAddressLower = userAddress.toLowerCase();
    const fromTokenAddressLower = fromTokenAddress.toLowerCase();
    const toTokenAddressLower = toTokenAddress.toLowerCase();
    const isFromTokenVET = isVET(fromTokenAddress);
    const isToTokenVET = isVET(toTokenAddress);

    // Get all events and transfers from receipt outputs
    const allEvents: Event[] = [];
    const allTransfers: Transfer[] = [];

    if (receipt.outputs && Array.isArray(receipt.outputs)) {
        for (const output of receipt.outputs) {
            // Events can be direct array or nested - handle both cases
            if (output.events && Array.isArray(output.events)) {
                allEvents.push(...output.events);
            }
            // Collect native VET transfers
            if (output.transfers && Array.isArray(output.transfers)) {
                allTransfers.push(...output.transfers);
            }
        }
    }

    // Get ERC20 ABI for decoding (only needed if we have ERC20 tokens)
    const ERC20Interface = IERC20__factory.createInterface();
    const transferEventAbi = ERC20Interface.getEvent('Transfer');
    const transferEventTopicHash = transferEventAbi?.topicHash.toLowerCase();

    // Filter for Transfer events (only needed for ERC20 tokens)
    const transferEvents = allEvents.filter((event) => {
        // Check if topic[0] matches Transfer event signature
        return (
            event.topics &&
            event.topics.length > 0 &&
            event.topics[0]?.toString().toLowerCase() === transferEventTopicHash
        );
    });

    // Decode transfer events and find relevant ones
    let fromAmount: bigint | null = null;
    let toAmount: bigint | null = null;

    // Handle native VET transfers from transfers array
    if (isFromTokenVET) {
        // Find VET transfer FROM the user
        for (const transfer of allTransfers) {
            if (
                transfer.sender?.toLowerCase() === userAddressLower &&
                transfer.amount &&
                transfer.amount !== '0x0' &&
                transfer.amount !== '0x'
            ) {
                const amount = BigInt(transfer.amount);
                if (amount > 0n) {
                    fromAmount = amount;
                    break; // Take the first matching transfer
                }
            }
        }
    }

    if (isToTokenVET) {
        // Find VET transfer TO the user
        for (const transfer of allTransfers) {
            if (
                transfer.recipient?.toLowerCase() === userAddressLower &&
                transfer.amount &&
                transfer.amount !== '0x0' &&
                transfer.amount !== '0x'
            ) {
                const amount = BigInt(transfer.amount);
                if (amount > 0n) {
                    toAmount = amount;
                    break; // Take the first matching transfer
                }
            }
        }
    }

    // Handle ERC20 token transfers from Transfer events (only if we have ERC20 tokens)
    if (transferEvents.length > 0) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });

                // Type guard for Transfer event args
                if (
                    !decoded.args ||
                    !('from' in decoded.args) ||
                    !('to' in decoded.args) ||
                    !('value' in decoded.args)
                ) {
                    continue;
                }

                const from = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).from
                    ?.toString()
                    .toLowerCase();
                const to = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).to
                    ?.toString()
                    .toLowerCase();
                const value = (
                    decoded.args as {
                        from: `0x${string}`;
                        to: `0x${string}`;
                        value: bigint;
                    }
                ).value as bigint;

                // Get contract address from event
                // Event type from TransactionReceipt has address as string
                const eventContractAddress = event.address.toLowerCase();

                // Check if this is a transfer FROM the user for the fromToken (skip if already found from VET transfers)
                if (
                    !isFromTokenVET &&
                    from === userAddressLower &&
                    eventContractAddress &&
                    eventContractAddress === fromTokenAddressLower &&
                    value > 0n &&
                    fromAmount === null
                ) {
                    fromAmount = value;
                }

                // Check if this is a transfer TO the user for the toToken (skip if already found from VET transfers)
                if (
                    !isToTokenVET &&
                    to === userAddressLower &&
                    eventContractAddress &&
                    eventContractAddress === toTokenAddressLower &&
                    value > 0n &&
                    toAmount === null
                ) {
                    toAmount = value;
                }
            } catch (error) {
                // Skip events that can't be decoded
                console.warn('Failed to decode transfer event:', error);
                continue;
            }
        }
    }

    // Strict matching can miss one side when a swap goes through a smart-
    // account / router intermediation chain: the user is the originator
    // but the actual Transfer-event `from` / `to` is an intermediate
    // contract. Fall back to "the largest non-zero Transfer value on the
    // relevant token contract" — across all routing patterns we see, that
    // movement is the user's net inflow / outflow on that token.
    if (fromAmount === null && !isFromTokenVET) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });
                if (!decoded.args || !('value' in decoded.args)) continue;
                const value = (decoded.args as { value: bigint }).value;
                if (
                    event.address.toLowerCase() === fromTokenAddressLower &&
                    value > 0n &&
                    (fromAmount === null || value > fromAmount)
                ) {
                    fromAmount = value;
                }
            } catch {
                /* ignore undecodable */
            }
        }
    }
    if (toAmount === null && !isToTokenVET) {
        for (const event of transferEvents) {
            try {
                const decoded = decodeEventLog({
                    abi: [transferEventAbi],
                    data: event.data.toString() as `0x${string}`,
                    topics: event.topics.map((t: any) => t.toString()) as [
                        `0x${string}`,
                        ...`0x${string}`[],
                    ],
                });
                if (!decoded.args || !('value' in decoded.args)) continue;
                const value = (decoded.args as { value: bigint }).value;
                if (
                    event.address.toLowerCase() === toTokenAddressLower &&
                    value > 0n &&
                    (toAmount === null || value > toAmount)
                ) {
                    toAmount = value;
                }
            } catch {
                /* ignore undecodable */
            }
        }
    }

    // Honor the documented contract: signal "couldn't extract" with null
    // rather than returning 0n placeholders that the UI then renders as
    // "swapped 0 B3TR for …". The caller falls back to a generic message.
    if (fromAmount === null || toAmount === null) return null;
    if (fromAmount === 0n || toAmount === 0n) return null;

    return { fromAmount, toAmount };
};
````

## Source: `packages/vechain-kit/src/utils/swap/simulateSwap.ts`

````typescript
import { ERC20_ABI, TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { decodeEventLog, zeroAddress, type Hex } from 'viem';
import { SwapParams, SwapQuote, SwapSimulation } from '@/types/swap';

/**
 * Helper to detect VeChain native token (VET) placeholder addresses.
 */
const isVETAddress = (address: string): boolean => {
    return address === '0x' || address === zeroAddress;
};

/**
 * Calculate asset inflow and outflow per token (including native VET) for a given user address.
 * - ERC20 flows are derived from Transfer events.
 * - VET flows are derived from clause value (outflow) and transfers array (inflow).
 * The result is a map: tokenAddress -> { inflow, outflow }.
 * For VET, the tokenAddress key is the zeroAddress.
 */
const calculateTokenFlowsFromEvents = (
    events: {
        address: string;
        topics: string[];
        data: string;
    }[],
    transfers: {
        sender: string;
        recipient: string;
        amount: string;
    }[],
    clauseValue: string | number | bigint | undefined,
    userAddress: string,
): Record<string, { inflow: bigint; outflow: bigint }> => {
    const flowsByToken: Record<string, { inflow: bigint; outflow: bigint }> =
        {};
    const user = userAddress.toLowerCase();

    // ERC20 token flows from Transfer events
    for (const event of events) {
        try {
            const decoded = decodeEventLog({
                abi: ERC20_ABI,
                eventName: 'Transfer',
                topics: event.topics as unknown as [Hex, ...Hex[]],
                data: event.data as Hex,
            }) as {
                args: {
                    from: string;
                    to: string;
                    value: bigint | string;
                };
            };

            const from = decoded.args.from.toLowerCase();
            const to = decoded.args.to.toLowerCase();
            const rawValue = decoded.args.value;
            const value =
                typeof rawValue === 'bigint' ? rawValue : BigInt(rawValue);

            // Only consider flows where the user is directly involved
            if (from !== user && to !== user) {
                continue;
            }

            const tokenAddress = event.address.toLowerCase();
            const current = flowsByToken[tokenAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (from === user) {
                current.outflow += value;
            }

            if (to === user) {
                current.inflow += value;
            }

            flowsByToken[tokenAddress] = current;
        } catch {
            // Not an ERC20 Transfer event, ignore
            continue;
        }
    }

    // VET outflow: value (VET) sent by the user in the clause
    if (clauseValue !== undefined) {
        const valueBigInt = BigInt(clauseValue);
        if (valueBigInt > 0n) {
            const current = flowsByToken[zeroAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };
            current.outflow += valueBigInt;
            flowsByToken[zeroAddress] = current;
        }
    }

    // VET inflow: transfers where the recipient is the user
    for (const transfer of transfers) {
        const recipient = transfer.recipient.toLowerCase();

        if (recipient !== user) {
            continue;
        }

        const amount = BigInt(transfer.amount);
        if (amount <= 0n) {
            continue;
        }

        const current = flowsByToken[zeroAddress] ?? {
            inflow: 0n,
            outflow: 0n,
        };
        current.inflow += amount;
        flowsByToken[zeroAddress] = current;
    }

    return flowsByToken;
};

/**
 * Shared swap simulation logic used by all aggregators.
 * It:
 * - simulates the provided clauses
 * - computes gas cost
 * - accumulates ERC20 inflow/outflow for the user
 * - verifies that flows match amountIn and minimumOutputAmount when applicable
 * - verifies that no unexpected token outflows occur (only fromToken should have outflow)
 */
export const simulateSwapWithClauses = async (
    params: SwapParams,
    quote: SwapQuote,
    clauses: TransactionClause[],
    thor: ThorClient,
): Promise<SwapSimulation> => {
    try {
        if (clauses.length === 0) {
            return {
                gasCostVTHO: 0,
                success: false,
                error: 'No clauses found for simulation',
            };
        }

        const simulatedTx = await thor.transactions.simulateTransaction(
            clauses,
            {
                caller: params.userAddress,
            },
        );

        let reverted = false;
        let revertReason: string | undefined;
        // Base gas cost for transaction overhead (VeChain transaction base cost)
        let totalGas = 200_000;

        const aggregatedFlows: Record<
            string,
            { inflow: bigint; outflow: bigint }
        > = {};

        for (let i = 0; i < simulatedTx.length; i++) {
            const result = simulatedTx[i];
            if (result.reverted) {
                reverted = true;
                revertReason = result.vmError || 'Transaction reverted';
            }

            totalGas += result.gasUsed;

            const clause = clauses[i];
            const flowsByToken = calculateTokenFlowsFromEvents(
                result.events,
                result.transfers,
                clause?.value,
                params.userAddress,
            );

            // Merge per-clause flows into the aggregated map
            for (const [token, flows] of Object.entries(flowsByToken)) {
                const current = aggregatedFlows[token] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };
                aggregatedFlows[token] = {
                    inflow: current.inflow + flows.inflow,
                    outflow: current.outflow + flows.outflow,
                };
            }
        }

        // If any clause reverted, keep behaviour consistent with previous implementation
        if (reverted) {
            return {
                gasCostVTHO: 0,
                success: false,
                error: revertReason || 'Transaction reverted',
            };
        }

        // Convert gas units to VTHO
        const gasCostVTHO = totalGas / 1e5;

        // Verify inflow/outflow for both ERC20 tokens and native VET.
        const fromIsVET = isVETAddress(params.fromTokenAddress);
        const toIsVET = isVETAddress(params.toTokenAddress);

        const expectedOutflow = BigInt(params.amountIn);

        // Outflow check: verify expected token outflow and ensure no other tokens have outflow
        if (fromIsVET) {
            const vetFlows = aggregatedFlows[zeroAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (vetFlows.outflow > expectedOutflow) {
                return {
                    gasCostVTHO,
                    success: false,
                    error: `VET outflow mismatch: expected ${expectedOutflow.toString()}, got ${vetFlows.outflow.toString()}`,
                };
            }

            // Verify no other tokens have outflow, in case an approval was granted in a different transaction
            for (const [tokenAddress, flows] of Object.entries(
                aggregatedFlows,
            )) {
                if (tokenAddress !== zeroAddress && flows.outflow > 0n) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Unexpected token outflow: token ${tokenAddress} has outflow ${flows.outflow.toString()}, expected 0`,
                    };
                }
            }
        } else {
            const fromTokenAddress = params.fromTokenAddress.toLowerCase();
            const tokenFlows = aggregatedFlows[fromTokenAddress] ?? {
                inflow: 0n,
                outflow: 0n,
            };

            if (tokenFlows.outflow > expectedOutflow) {
                return {
                    gasCostVTHO,
                    success: false,
                    error: `Token outflow mismatch: expected ${expectedOutflow.toString()}, got ${tokenFlows.outflow.toString()}`,
                };
            }

            // Verify no other tokens (including VET) have outflow
            for (const [tokenAddress, flows] of Object.entries(
                aggregatedFlows,
            )) {
                if (tokenAddress !== fromTokenAddress && flows.outflow > 0n) {
                    const tokenName =
                        tokenAddress === zeroAddress ? 'VET' : tokenAddress;
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Unexpected token outflow: ${tokenName} has outflow ${flows.outflow.toString()}, expected 0`,
                    };
                }
            }
        }

        // Inflow check (only when minimumOutputAmount is present)
        if (quote.minimumOutputAmount && quote.minimumOutputAmount > 0n) {
            if (toIsVET) {
                const vetFlows = aggregatedFlows[zeroAddress] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };

                if (vetFlows.inflow < quote.minimumOutputAmount) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `VET inflow mismatch: expected ${quote.minimumOutputAmount.toString()}, got ${vetFlows.inflow.toString()}`,
                    };
                }
            } else {
                const toTokenAddress = params.toTokenAddress.toLowerCase();
                const tokenFlows = aggregatedFlows[toTokenAddress] ?? {
                    inflow: 0n,
                    outflow: 0n,
                };

                if (tokenFlows.inflow < quote.minimumOutputAmount) {
                    return {
                        gasCostVTHO,
                        success: false,
                        error: `Token inflow mismatch: expected ${quote.minimumOutputAmount.toString()}, got ${tokenFlows.inflow.toString()}`,
                    };
                }
            }
        }

        return {
            gasCostVTHO,
            success: true,
        };
    } catch (error) {
        return {
            gasCostVTHO: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Simulation failed',
        };
    }
};
````

## Source: `packages/vechain-kit/src/utils/swap/uniswapV2Aggregator.ts`

````typescript
import {
    SwapAggregator,
    SwapParams,
    SwapQuote,
    SwapSimulation,
} from '@/types/swap';
import {
    IERC20__factory,
    UniswapV2Router02__factory as UniswapV2Router__factory,
} from '@vechain/vechain-contract-types';
import {
    ABIContract,
    Clause,
    TransactionClause,
    Units,
    Address as VeChainAddress,
    VET,
} from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import { Address } from 'viem';
import { simulateSwapWithClauses } from './simulateSwap';

/**
 * Helper to check if token is VET (native token)
 */
const isVET = (address: string): boolean => {
    return (
        address === '0x' ||
        address === '0x0000000000000000000000000000000000000000'
    );
};

/**
 * Helper to get deadline (20 minutes from now)
 */
const getDeadline = (): bigint => {
    return BigInt(Math.floor(Date.now() / 1000) + 20 * 60);
};

/**
 * Configuration for a Uniswap V2 compatible aggregator
 */
export interface UniswapV2AggregatorConfig {
    /**
     * Name of the aggregator (e.g., "BetterSwap", "VeTrade")
     */
    name: string;
    /**
     * Router contract address
     */
    routerAddress: Address;
    /**
     * Wrapped VET (WVET) contract address
     * Used in swap paths instead of native VET address
     */
    wrappedVET: Address;
    /**
     * Icon component factory function
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
}

/**
 * Create a SwapAggregator instance for a Uniswap V2 compatible router
 */
export const createUniswapV2Aggregator = (
    config: UniswapV2AggregatorConfig,
): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: config.name,
        getIcon: config.getIcon,

        async getQuote(
            params: SwapParams,
            thor: ThorClient,
        ): Promise<SwapQuote> {
            // Use wrapped VET in paths instead of native VET address
            const path: Address[] = [
                isVET(params.fromTokenAddress)
                    ? config.wrappedVET
                    : (params.fromTokenAddress as Address),
                isVET(params.toTokenAddress)
                    ? config.wrappedVET
                    : (params.toTokenAddress as Address),
            ];

            const amountInBigInt = BigInt(params.amountIn);

            try {
                // Call getAmountsOut on the router contract
                const contract = thor.contracts.load(
                    config.routerAddress,
                    UniswapV2Router__factory.abi,
                );
                const [amounts] = await contract.read.getAmountsOut(
                    amountInBigInt,
                    path,
                );

                // Handle both array and single value responses
                const amountsArray = Array.isArray(amounts)
                    ? amounts
                    : [amounts];
                const outputAmount = amountsArray[amountsArray.length - 1];

                // Ensure we have a valid output amount
                if (!outputAmount || outputAmount === 0n) {
                    throw new Error('Output amount is zero or invalid');
                }

                // Validate that outputAmount is a bigint
                if (typeof outputAmount !== 'bigint') {
                    throw new Error('Output amount is not a valid bigint');
                }

                // Calculate minimum output with slippage
                // slippageTolerance is in percentage (e.g., 1 = 1%)
                // For 1% slippage: multiplier = 10000 - 100 = 9900 (99% of output)
                const slippageTolerancePercent = params.slippageTolerance || 1;
                const slippageMultiplier = BigInt(
                    10000 - slippageTolerancePercent * 100,
                );
                const minimumOutputAmount =
                    (outputAmount * slippageMultiplier) / BigInt(10000);

                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount,
                    priceImpact: 0,
                    minimumOutputAmount,
                    data: {
                        path,
                        routerAddress: config.routerAddress,
                    },
                };
            } catch (error) {
                console.error(`${config.name} getQuote failed:`, error);
                // Return empty quote on error
                return {
                    aggregatorName: config.name,
                    aggregator,
                    outputAmount: 0n,
                    priceImpact: 0,
                    minimumOutputAmount: 0n,
                    data: {
                        path,
                        routerAddress: config.routerAddress,
                    },
                };
            }
        },

        async simulateSwap(
            params: SwapParams,
            quote: SwapQuote,
            thor: ThorClient,
        ): Promise<SwapSimulation> {
            // Build transaction clauses using existing logic
            const clauses = await this.buildSwapTransaction(params, quote);

            // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
            return simulateSwapWithClauses(params, quote, clauses, thor);
        },

        async buildSwapTransaction(
            params: SwapParams,
            quote: SwapQuote,
        ): Promise<TransactionClause[]> {
            if (
                !quote.data ||
                typeof quote.data !== 'object' ||
                !('path' in quote.data)
            ) {
                throw new Error('Invalid quote data');
            }

            const deadline = getDeadline();

            // Ensure minimumOutputAmount is set and not zero
            if (
                !quote.minimumOutputAmount ||
                quote.minimumOutputAmount === 0n
            ) {
                throw new Error(
                    'Invalid quote: minimumOutputAmount is missing or zero',
                );
            }

            const amountOutMin = quote.minimumOutputAmount;
            const amountIn = BigInt(params.amountIn);

            // Additional validation: amountOutMin should be positive
            if (amountOutMin === 0n) {
                throw new Error('Invalid quote: minimumOutputAmount is zero');
            }

            const isFromVET = isVET(params.fromTokenAddress);
            const isToVET = isVET(params.toTokenAddress);

            const routerABI = ABIContract.ofAbi(UniswapV2Router__factory.abi);
            const clauses: TransactionClause[] = [];

            if (isFromVET) {
                // Swap VET (native) for tokens using swapExactETHForTokens
                // Note: amountIn is sent as value (VET), amountOutMin is first parameter
                clauses.push(
                    Clause.callFunction(
                        VeChainAddress.of(config.routerAddress),
                        routerABI.getFunction('swapExactETHForTokens'),
                        [
                            amountOutMin.toString(),
                            quote.data.path,
                            params.userAddress,
                            deadline.toString(),
                        ],
                        VET.of(amountIn, Units.wei),
                        {
                            comment: `Swap on ${quote.aggregatorName}`,
                        },
                    ),
                );
            } else {
                // From token is an ERC20 token, need to approve the router first
                const tokenABI = ABIContract.ofAbi(IERC20__factory.abi);
                const fromTokenAddress = VeChainAddress.of(
                    params.fromTokenAddress,
                );
                const routerAddress = VeChainAddress.of(config.routerAddress);

                // Add approval clause: approve router to spend amountIn
                clauses.push(
                    Clause.callFunction(
                        fromTokenAddress,
                        tokenABI.getFunction('approve'),
                        [routerAddress.toString(), amountIn.toString()],
                        VET.of(0n, Units.wei),
                        {
                            comment: `Swap on ${quote.aggregatorName}`,
                        },
                    ),
                );

                // Swap tokens: either for other tokens or for VET
                if (isToVET) {
                    // Swap tokens for VET using swapExactTokensForETH
                    clauses.push(
                        Clause.callFunction(
                            routerAddress,
                            routerABI.getFunction('swapExactTokensForETH'),
                            [
                                amountIn.toString(),
                                amountOutMin.toString(),
                                quote.data.path,
                                params.userAddress,
                                deadline.toString(),
                            ],
                            VET.of(0n, Units.wei),
                            {
                                comment: `Swap on ${quote.aggregatorName}`,
                            },
                        ),
                    );
                } else {
                    // Swap tokens for tokens using swapExactTokensForTokens
                    clauses.push(
                        Clause.callFunction(
                            routerAddress,
                            routerABI.getFunction('swapExactTokensForTokens'),
                            [
                                amountIn.toString(),
                                amountOutMin.toString(),
                                quote.data.path,
                                params.userAddress,
                                deadline.toString(),
                            ],
                            VET.of(0n, Units.wei),
                            {
                                comment: `Swap on ${quote.aggregatorName}`,
                            },
                        ),
                    );
                }
            }

            return clauses;
        },
    };

    return aggregator;
};
````

## Source: `packages/vechain-kit/src/utils/swap/veTrade.tsx`

````tsx
import { SwapAggregator, SwapParams, SwapQuote, SwapSimulation } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { type Address } from 'viem';
import { createApiAggregator } from './apiAggregator';
import { VeTradeLogo } from '@/assets/icons';
import React from 'react';
import { TransactionClause, ABIContract, Clause, Address as VeChainAddress, VET, Units } from '@vechain/sdk-core';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { ThorClient } from '@vechain/sdk-network';
import { simulateSwapWithClauses } from './simulateSwap';
import { VETRADE_BASE_URL } from '@/constants';

/**
 * VeTrade supported addresses for different networks
 * These addresses are used to filter clauses from the API response
 */
const VETRADE_ADDRESSES: Record<NETWORK_TYPE, { supportedAddresses: Address[] }> = {
    main: {
        supportedAddresses: [
            '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6' as Address, // Uniswap compatible Router
            '0x7C755EC0165fCD926cC6faB10E7BB16a72E9f34A' as Address // Custom Router
        ],
    },
    test: {
        supportedAddresses: [],
    },
    solo: {
        supportedAddresses: [],
    },
};

/**
 * Helper to check if token is VET (native token)
 */
const isVET = (address: string): boolean => {
    return address === '0x' || address === '0x0000000000000000000000000000000000000000';
};

/**
 * Get VeTrade API base URL for a specific network
 */
const getVeTradeApiUrl = (_networkType: NETWORK_TYPE): string => {
    // Currently same endpoint across environments; keep signature for future overrides.
    return new URL('api/quote/vck', VETRADE_BASE_URL).toString();
};

/**
 * Create VeTrade aggregator instance for a specific network
 *
 * VeTrade uses an API-based aggregator that returns clauses with function calls
 * that are encoded locally. Only clauses targeting supported addresses are used.
 *
 * @param networkType - The network type (main, test, or solo)
 * @returns SwapAggregator instance configured for the specified network
 */
export const createVeTradeAggregator = (networkType: NETWORK_TYPE): SwapAggregator => {
    const addresses = VETRADE_ADDRESSES[networkType] ?? VETRADE_ADDRESSES['main'];

    // Create base API aggregator with supported addresses
    const baseAggregator = createApiAggregator({
        name: 'VeTrade.vet',
        apiBaseUrl: getVeTradeApiUrl(networkType),
        network: networkType,
        getIcon: (boxSize = '20px') => React.createElement(VeTradeLogo, { boxSize }),
        supportedAddresses: addresses.supportedAddresses,
    });

    // Wrap the aggregator to add approve clause when needed
    const aggregator: SwapAggregator = {
        ...baseAggregator,

        async simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation> {
            try {
                // Build transaction clauses for simulation (includes approve clause if needed)
                // This ensures simulation uses the same clauses that will be executed
                const clauses = await this.buildSwapTransaction(params, quote);

                // Delegate to shared simulation helper that also verifies ERC20 inflow/outflow
                return simulateSwapWithClauses(params, quote, clauses, thor);
            } catch (error) {
                return {
                    gasCostVTHO: 0,
                    success: false,
                    error: error instanceof Error ? error.message : 'Simulation failed',
                };
            }
        },

        async buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]> {
            const clauses: TransactionClause[] = [];

            // Get clauses from base aggregator (already filtered by supported addresses)
            const baseClauses = await baseAggregator.buildSwapTransaction(params, quote);

            if(!baseClauses || baseClauses.length === 0) {
                throw new Error('Failed to build swap transaction');
            }

            // Check if fromToken is VET (native token)
            const isFromVET = isVET(params.fromTokenAddress);

            // If fromToken is not VET, add approve clause as first clause
            if (!isFromVET) {
                // Get the router address from supported addresses (first address is typically the router)
                if (addresses.supportedAddresses.length === 0) {
                    throw new Error('No supported addresses configured for VeTrade on this network');
                }
                const tokenABI = ABIContract.ofAbi(IERC20__factory.abi);
                const fromTokenAddress = VeChainAddress.of(params.fromTokenAddress);
                const amountIn = BigInt(params.amountIn);

                // Add approval clause: approve router to spend amountIn
                clauses.push(
                    Clause.callFunction(
                        fromTokenAddress,
                        tokenABI.getFunction('approve'),
                        [
                            baseClauses[0].to,
                            amountIn.toString(),
                        ],
                        VET.of(0n, Units.wei),
                        {
                            comment: `Approve ${quote.aggregatorName} to access ${params.fromTokenAddress}`,
                        }
                    ),
                );
            }
            else {
                baseClauses[0].value = params.amountIn
            }

            // Add base clauses after approve clause
            clauses.push(...baseClauses);

            return clauses;
        },
    };

    return aggregator;
};
````
