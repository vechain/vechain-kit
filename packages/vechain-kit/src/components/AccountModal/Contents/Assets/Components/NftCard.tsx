import { AspectRatio, Box, Image, Skeleton, Text, useToken } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl } from '@/utils';
import { OwnedNft, useNftMetadata } from '@/hooks/api/nfts';

type Props = {
    nft: OwnedNft;
    onClick: () => void;
};

export const NftCard = ({ nft, onClick }: Props) => {
    const { network } = useVeChainKitConfig();
    const { metadata, isLoading } = useNftMetadata(
        nft.collectionAddress,
        nft.tokenId,
    );

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const imageUrl = useMemo(() => {
        const raw = metadata?.image;
        if (!raw) return undefined;
        try {
            return convertUriToUrl(raw, network.type) ?? raw;
        } catch {
            return raw;
        }
    }, [metadata?.image, network.type]);

    const displayName = metadata?.name ?? `#${nft.tokenId}`;

    return (
        <Box
            as="button"
            onClick={onClick}
            bg={cardBg}
            borderRadius="xl"
            overflow="hidden"
            textAlign="left"
            w="full"
            _hover={{ opacity: 0.85 }}
            transition="opacity 120ms ease"
        >
            <AspectRatio ratio={1} w="full">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={displayName}
                        objectFit="cover"
                        fallback={<Skeleton w="full" h="full" />}
                    />
                ) : (
                    <Skeleton isLoaded={!isLoading} fadeDuration={0}>
                        <Box w="full" h="full" bg={cardBg} />
                    </Skeleton>
                )}
            </AspectRatio>
            <Box px={2} py={2}>
                <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={textPrimary}
                    noOfLines={1}
                >
                    {displayName}
                </Text>
                <Text fontSize="xs" color={textSecondary} noOfLines={1}>
                    #{nft.tokenId}
                </Text>
            </Box>
        </Box>
    );
};
