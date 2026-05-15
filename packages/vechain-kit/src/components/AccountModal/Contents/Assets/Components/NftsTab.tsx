import {
    Box,
    Button,
    Skeleton,
    SimpleGrid,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OwnedNft, useOwnedNftsFiltered } from '@/hooks/api/nfts';
import { useWallet } from '@/hooks';
import { CollectionCard } from './CollectionCard';

type Props = {
    onSelectCollection: (collectionAddress: string, tokens: OwnedNft[]) => void;
};

type CollectionGroup = {
    address: string;
    tokens: OwnedNft[];
};

const groupByCollection = (items: OwnedNft[]): CollectionGroup[] => {
    const map = new Map<string, OwnedNft[]>();
    for (const item of items) {
        const key = item.collectionAddress.toLowerCase();
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }
    return Array.from(map.entries())
        .map(([address, tokens]) => ({ address, tokens }))
        .sort((a, b) => b.tokens.length - a.tokens.length);
};

export const NftsTab = ({ onSelectCollection }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const {
        items,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isUnsupportedNetwork,
    } = useOwnedNftsFiltered(account?.address);

    const groups = useMemo(() => groupByCollection(items), [items]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting) && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '120px' },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isUnsupportedNetwork) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>
                    {t('NFTs are not available on this network')}
                </Text>
            </Box>
        );
    }

    if (isLoading && groups.length === 0) {
        return (
            <SimpleGrid columns={2} spacing={3} w="full">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} h="160px" borderRadius="xl" />
                ))}
            </SimpleGrid>
        );
    }

    if (!groups.length) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>{t('No NFTs yet')}</Text>
            </Box>
        );
    }

    return (
        <VStack spacing={3} align="stretch" w="full">
            <SimpleGrid columns={2} spacing={3} w="full">
                {groups.map((g) => (
                    <CollectionCard
                        key={g.address}
                        collectionAddress={g.address}
                        tokens={g.tokens}
                        onClick={() => onSelectCollection(g.address, g.tokens)}
                    />
                ))}
            </SimpleGrid>

            {hasNextPage && (
                <Box ref={sentinelRef} py={2} textAlign="center">
                    <Button
                        variant="vechainKitSecondary"
                        size="sm"
                        isLoading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        {t('Load more')}
                    </Button>
                </Box>
            )}
        </VStack>
    );
};
