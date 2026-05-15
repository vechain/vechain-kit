import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    SimpleGrid,
    VStack,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { humanAddress } from '@/utils';
import {
    OwnedNft,
    useNftCollectionName,
    useOwnedNftsFiltered,
} from '@/hooks/api/nfts';
import { useWallet } from '@/hooks';
import { useMemo } from 'react';
import { AccountModalContentTypes } from '../../Types';
import { NftCard } from '../Assets/Components/NftCard';

export type NftCollectionContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    collectionAddress: string;
    onBack?: () => void;
};

export const NftCollectionContent = ({
    setCurrentContent,
    collectionAddress,
    onBack,
}: NftCollectionContentProps) => {
    const { isolatedView } = useAccountModalOptions();
    const { account } = useWallet();
    const { items } = useOwnedNftsFiltered(account?.address);
    const { name: onChainName } = useNftCollectionName(collectionAddress);

    const tokens = useMemo(
        () =>
            items.filter(
                (n) =>
                    n.collectionAddress.toLowerCase() ===
                    collectionAddress.toLowerCase(),
            ),
        [items, collectionAddress],
    );

    const headerName = onChainName ?? humanAddress(collectionAddress);

    const backToCollection = () =>
        setCurrentContent({
            type: 'nft-collection',
            props: { setCurrentContent, collectionAddress },
        });

    const handleSelectNft = (nft: OwnedNft) => {
        setCurrentContent({
            type: 'nft-detail',
            props: {
                setCurrentContent,
                nft,
                onBack: backToCollection,
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
                <ModalHeader>{headerName}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={3} align="stretch" w="full">
                        <SimpleGrid columns={2} spacing={3} w="full">
                            {tokens.map((nft) => (
                                <NftCard
                                    key={nft.id}
                                    nft={nft}
                                    onClick={() => handleSelectNft(nft)}
                                />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
