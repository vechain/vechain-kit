import {
    AspectRatio,
    Box,
    Button,
    Container,
    Divider,
    HStack,
    Heading,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl, humanAddress } from '@/utils';
import { OwnedNft, useNftMetadata } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type NftDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    onBack?: () => void;
};

const formatTransferTimestamp = (ts?: number, locale?: string) => {
    if (!ts) return undefined;
    try {
        const date = new Date(ts * 1000);
        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    } catch {
        return undefined;
    }
};

export const NftDetailContent = ({
    setCurrentContent,
    nft,
    onBack,
}: NftDetailContentProps) => {
    const { t, i18n } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();
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

    const collectionName =
        metadata?.name?.split('#')[0]?.trim() ||
        humanAddress(nft.collectionAddress);
    const displayName = metadata?.name ?? `#${nft.tokenId}`;
    const lastTransfer = formatTransferTimestamp(
        nft.lastTransferTimestamp,
        i18n.language,
    );
    const attributes = metadata?.attributes ?? [];

    const backToDetail = () =>
        setCurrentContent({
            type: 'nft-detail',
            props: { setCurrentContent, nft },
        });

    const handleSend = () => {
        setCurrentContent({
            type: 'send-nft',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                onBack: backToDetail,
            },
        });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else setCurrentContent('assets');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{displayName}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={5} align="stretch" w="full">
                        <AspectRatio
                            ratio={1}
                            w="full"
                            borderRadius="xl"
                            overflow="hidden"
                            bg={cardBg}
                        >
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={displayName}
                                    objectFit="cover"
                                    fallback={<Skeleton w="full" h="full" />}
                                />
                            ) : (
                                <Skeleton
                                    isLoaded={!isLoading}
                                    fadeDuration={0}
                                >
                                    <Box w="full" h="full" bg={cardBg} />
                                </Skeleton>
                            )}
                        </AspectRatio>

                        <Box bg={cardBg} borderRadius="xl" p={4}>
                            <VStack spacing={3} align="stretch">
                                <HStack justify="space-between">
                                    <Text
                                        color={textSecondary}
                                        fontSize="sm"
                                    >
                                        {t('Collection')}
                                    </Text>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="600"
                                        noOfLines={1}
                                    >
                                        {collectionName}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text
                                        color={textSecondary}
                                        fontSize="sm"
                                    >
                                        {t('ID')}
                                    </Text>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="600"
                                    >
                                        {nft.tokenId}
                                    </Text>
                                </HStack>
                                {lastTransfer && (
                                    <HStack justify="space-between">
                                        <Text
                                            color={textSecondary}
                                            fontSize="sm"
                                        >
                                            {t('Last transfer on')}
                                        </Text>
                                        <Text
                                            color={textPrimary}
                                            fontSize="sm"
                                            fontWeight="600"
                                        >
                                            {lastTransfer}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Box>

                        {attributes.length > 0 && (
                            <Box>
                                <Heading
                                    size="sm"
                                    mb={3}
                                    color={textPrimary}
                                >
                                    {t('Attributes')}
                                </Heading>
                                <VStack
                                    spacing={2}
                                    align="stretch"
                                    bg={cardBg}
                                    borderRadius="xl"
                                    p={2}
                                >
                                    {attributes.map((attr, i) => (
                                        <Box key={`${attr.trait_type}-${i}`}>
                                            <HStack
                                                justify="space-between"
                                                px={2}
                                                py={1}
                                            >
                                                <Text
                                                    color={textSecondary}
                                                    fontSize="sm"
                                                >
                                                    {attr.trait_type ??
                                                        t('Trait')}
                                                </Text>
                                                <Text
                                                    color={textPrimary}
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    noOfLines={1}
                                                >
                                                    {String(attr.value ?? '—')}
                                                </Text>
                                            </HStack>
                                            {i < attributes.length - 1 && (
                                                <Divider opacity={0.2} />
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        w="full"
                        onClick={handleSend}
                    >
                        {t('Send')}
                    </Button>
                </ModalFooter>
            </Container>
        </>
    );
};
