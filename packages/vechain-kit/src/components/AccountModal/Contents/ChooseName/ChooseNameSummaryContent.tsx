import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    useColorMode,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { TransactionModal } from '@/components/TransactionModal';
import { useClaimVeWorldSubdomain } from '@/hooks/api/vetDomains/useClaimVeWorldSubdomain';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
    name: string;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    name,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { account } = useWallet();
    const transactionModal = useDisclosure();

    const { sendTransaction, status, txReceipt, error } =
        useClaimVeWorldSubdomain({
            subdomain: name,
            domain: 'veworld.vet',
        });

    const handleConfirm = async () => {
        transactionModal.onOpen();
        try {
            await sendTransaction();
        } catch (error) {
            console.error('Transaction failed:', error);
            transactionModal.onClose();
        }
    };

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Confirm Name
                </ModalHeader>
                <ModalBackButton
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                name,
                                setCurrentContent,
                            },
                        })
                    }
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack spacing={4} w="full">
                        <AddressDisplayCard
                            label="Current"
                            address={account.address ?? ''}
                            domain={account.domain}
                            imageSrc={account.image ?? ''}
                            imageAlt="Current account"
                            hideAddress={true}
                        />

                        <AddressDisplayCard
                            label="New Name"
                            address={account.address ?? ''}
                            domain={`${name}.veworld.vet`}
                            imageSrc={account.image ?? ''}
                            imageAlt="Account"
                            hideAddress={true}
                        />
                    </VStack>
                </ModalBody>
            </FadeInViewFromBottom>

            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    colorScheme="blue"
                    onClick={handleConfirm}
                >
                    CONFIRM
                </Button>
            </ModalFooter>

            <TransactionModal
                isOpen={transactionModal.isOpen}
                onClose={() => {
                    transactionModal.onClose();
                    setCurrentContent('main');
                }}
                status={status}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showExplorerButton={true}
                showSocialButtons={true}
                showTryAgainButton={true}
            />
        </FadeInViewFromBottom>
    );
};
