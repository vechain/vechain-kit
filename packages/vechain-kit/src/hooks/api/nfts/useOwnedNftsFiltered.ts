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
