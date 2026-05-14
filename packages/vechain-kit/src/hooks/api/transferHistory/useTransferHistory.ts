import { useInfiniteQuery } from '@tanstack/react-query';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { useTokenBalances } from '../wallet/useTokenBalances';
import {
    IndexerTransfer,
    TransferHistoryItem,
    VET_TOKEN_SENTINEL,
    VTHO_TOKEN_ADDRESS,
} from './types';

const PAGE_SIZE = 25;

type IndexerResponse = {
    data: IndexerTransfer[];
    pagination?: { hasNext?: boolean };
};

const isVetTokenAddress = (address?: string | null) =>
    !address || address === VET_TOKEN_SENTINEL;

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
    symbolByAddress.set(VET_TOKEN_SENTINEL.toLowerCase(), {
        symbol: 'VET',
        decimals: 18,
    });
    symbolByAddress.set(VTHO_TOKEN_ADDRESS.toLowerCase(), {
        symbol: 'VTHO',
        decimals: 18,
    });
    for (const b of balances) {
        if (b.address && b.symbol) {
            symbolByAddress.set(b.address.toLowerCase(), {
                symbol: b.symbol,
                decimals: 18,
            });
        }
    }

    const indexerUrl = config.indexerUrl;
    const filteringByVet = isVetTokenAddress(tokenAddress);
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
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasNext ? allPages.length * PAGE_SIZE : undefined,
        queryFn: async ({ pageParam = 0 }): Promise<TransferPage> => {
            if (!address) {
                return { items: [] as TransferHistoryItem[], hasNext: false };
            }

            const params = new URLSearchParams({
                address: address.toLowerCase(),
                limit: String(PAGE_SIZE),
                offset: String(pageParam),
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

            const items: TransferHistoryItem[] = (body.data ?? [])
                .filter((t) => t.eventType !== 'NFT')
                .filter((t) => {
                    if (!tokenAddress) return true;
                    if (filteringByVet) {
                        return t.eventType === 'VET';
                    }
                    return eqLower(t.tokenAddress, tokenAddress);
                })
                .map((t) => {
                    const isVet = t.eventType === 'VET';
                    const tokenAddrKey = isVet
                        ? VET_TOKEN_SENTINEL.toLowerCase()
                        : (t.tokenAddress ?? '').toLowerCase();
                    const meta = symbolByAddress.get(tokenAddrKey);
                    const decimals = meta?.decimals ?? 18;
                    const symbol =
                        meta?.symbol ??
                        (isVet ? 'VET' : t.tokenAddress?.slice(0, 6) ?? '');
                    const direction =
                        eqLower(t.from, address) ? 'sent' : 'received';
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
