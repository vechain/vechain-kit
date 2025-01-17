import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    useColorMode,
    Box,
    HStack,
    Image,
    ModalFooter,
    useDisclosure,
    Icon,
    Center,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { TransactionModal } from '@/components/TransactionModal';
import { FiArrowDown } from 'react-icons/fi';
import { humanAddress } from '@/utils';
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
            onSuccess: () => {
                transactionModal.onClose();
                setCurrentContent('main');
            },
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
                    <Box
                        w="full"
                        p={4}
                        borderRadius="xl"
                        bg={isDark ? '#00000021' : 'gray.50'}
                    >
                        <VStack spacing={6} w="full" textAlign={'center'}>
                            {/* Current Section */}
                            <VStack
                                w="full"
                                justifyContent={'center'}
                                spacing={0}
                            >
                                <Text fontSize="sm">Current</Text>
                                <HStack
                                    minH={'50px'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <Image
                                        src={account.image ?? ''}
                                        alt="Current account"
                                        boxSize="20px"
                                        borderRadius="xl"
                                    />
                                    <Text fontWeight="medium" fontSize="sm">
                                        {humanAddress(
                                            account.address ?? '',
                                            6,
                                            4,
                                        )}
                                    </Text>
                                </HStack>
                            </VStack>

                            {/* Arrow Icon */}
                            <Center
                                position="relative"
                                marginX="auto"
                                bg={isDark ? '#262626' : 'gray.100'}
                                borderRadius="xl"
                                w="40px"
                                h="40px"
                                zIndex={2}
                            >
                                <Icon
                                    as={FiArrowDown}
                                    boxSize={5}
                                    opacity={0.5}
                                    color={
                                        isDark ? 'whiteAlpha.700' : 'gray.600'
                                    }
                                />
                            </Center>

                            {/* New Name Section */}
                            <VStack
                                w="full"
                                justifyContent={'center'}
                                spacing={0}
                            >
                                <Text fontSize="sm">New Name</Text>
                                <HStack
                                    minH={'50px'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <Image
                                        src={account.image ?? ''}
                                        alt="Account"
                                        boxSize="20px"
                                        borderRadius="xl"
                                    />
                                    <Text fontWeight="medium" fontSize="sm">
                                        {name}.veworld.vet
                                    </Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
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
