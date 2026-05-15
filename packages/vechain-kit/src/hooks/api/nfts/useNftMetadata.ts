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
