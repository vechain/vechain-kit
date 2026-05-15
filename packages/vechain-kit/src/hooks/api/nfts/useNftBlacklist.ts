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
