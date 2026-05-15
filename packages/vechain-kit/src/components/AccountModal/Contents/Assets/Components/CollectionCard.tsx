import {
    AspectRatio,
    Box,
    Image,
    Skeleton,
    Text,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl, humanAddress } from '@/utils';
import {
    OwnedNft,
    useNftCollectionName,
    useNftMetadata,
} from '@/hooks/api/nfts';

type Props = {
    collectionAddress: string;
    tokens: OwnedNft[];
    onClick: () => void;
};

export const CollectionCard = ({
    collectionAddress,
    tokens,
    onClick,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const previewToken = tokens[0];

    const { metadata, isLoading: isLoadingMetadata } = useNftMetadata(
        previewToken?.collectionAddress,
        previewToken?.tokenId,
    );
    const { name: onChainName } = useNftCollectionName(collectionAddress);

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

    const collectionName =
        onChainName ??
        metadata?.name?.split('#')[0]?.trim() ??
        humanAddress(collectionAddress);

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
                        alt={collectionName}
                        objectFit="cover"
                        fallback={<Skeleton w="full" h="full" />}
                    />
                ) : (
                    <Skeleton isLoaded={!isLoadingMetadata} fadeDuration={0}>
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
                    {collectionName}
                </Text>
                <Text fontSize="xs" color={textSecondary}>
                    {tokens.length === 1
                        ? t('{{count}} item', { count: tokens.length })
                        : t('{{count}} items', { count: tokens.length })}
                </Text>
            </Box>
        </Box>
    );
};
