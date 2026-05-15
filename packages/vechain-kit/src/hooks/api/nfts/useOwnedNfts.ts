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
