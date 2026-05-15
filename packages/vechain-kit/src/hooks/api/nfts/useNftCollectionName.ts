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
