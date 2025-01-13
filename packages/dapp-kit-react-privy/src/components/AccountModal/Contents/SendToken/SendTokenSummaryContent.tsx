import {
    Container,
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
    Divider,
    Alert,
    AlertIcon,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
    StickyFooterContainer,
} from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage, humanAddress } from '@/utils';
import { useWallet } from '@/hooks';
import { useTransferERC20, useTransferVET } from '@/hooks';
import { TransactionModal } from '../../../TransactionModal';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onSend: (address: string, amount: string) => void;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
    amount: string;
    selectedToken: {
        symbol: string;
        balance: string;
        address: string;
        numericBalance: number;
        price: number;
    };
};

export const SendTokenSummaryContent = ({
    setCurrentContent,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
    amount,
    selectedToken,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { selectedAccount, connection } = useWallet();
    const transactionModal = useDisclosure();

    const transferERC20 = useTransferERC20({
        fromAddress: selectedAccount.address,
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
    });

    const transferVET = useTransferVET({
        fromAddress: selectedAccount.address,
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
    });

    const handleSend = async () => {
        transactionModal.onOpen();
        try {
            if (selectedToken.symbol === 'VET') {
                await transferVET.sendTransaction();
            } else {
                await transferERC20.sendTransaction();
            }
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    const { status, error, txReceipt } =
        selectedToken.symbol === 'VET' ? transferVET : transferERC20;

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Send
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('send-token')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        {connection.isConnectedWithPrivy && (
                            <Alert
                                status="warning"
                                fontSize={'xs'}
                                borderRadius={'xl'}
                            >
                                <AlertIcon />
                                Sending to OceanX or other exchanges may result
                                in loss of funds. Send the tokens to your
                                VeWorld wallet first.
                            </Alert>
                        )}
                        {/* From/To Card */}
                        <Box
                            p={4}
                            borderRadius="xl"
                            bg={isDark ? '#00000021' : 'gray.50'}
                        >
                            {/* From Section */}
                            <VStack
                                align="stretch"
                                spacing={4}
                                wordBreak={'break-all'}
                            >
                                <Box>
                                    <Text fontSize="sm" mb={2}>
                                        From
                                    </Text>
                                    <HStack>
                                        <Image
                                            src={selectedAccount.image}
                                            alt="From account"
                                            boxSize="40px"
                                            borderRadius="xl"
                                        />
                                        <VStack align="start" spacing={0}>
                                            {selectedAccount.domain && (
                                                <>
                                                    <Text fontWeight="medium">
                                                        {selectedAccount.domain}
                                                    </Text>

                                                    <Text
                                                        fontSize="sm"
                                                        opacity={0.5}
                                                    >
                                                        {humanAddress(
                                                            selectedAccount.address,
                                                        )}
                                                    </Text>
                                                </>
                                            )}

                                            {!selectedAccount.domain && (
                                                <Text fontWeight="medium">
                                                    {selectedAccount.address}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                </Box>

                                <Divider />

                                {/* To Section */}
                                <Box>
                                    <Text fontSize="sm" mb={2}>
                                        To
                                    </Text>
                                    <HStack>
                                        <Image
                                            src={getPicassoImage(
                                                toAddressOrDomain,
                                            )}
                                            alt="To account"
                                            boxSize="40px"
                                            borderRadius="xl"
                                        />
                                        <VStack align="start" spacing={0}>
                                            {resolvedDomain && (
                                                <>
                                                    <Text fontWeight="medium">
                                                        {resolvedDomain}
                                                    </Text>
                                                    <Text
                                                        fontSize="sm"
                                                        opacity={0.5}
                                                    >
                                                        {humanAddress(
                                                            resolvedAddress ||
                                                                toAddressOrDomain,
                                                        )}
                                                    </Text>
                                                </>
                                            )}

                                            {!resolvedDomain && (
                                                <Text fontWeight="medium">
                                                    {resolvedAddress ||
                                                        toAddressOrDomain}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                </Box>

                                <Divider />
                                <Box>
                                    <Text fontSize="sm" mb={2}>
                                        Amount
                                    </Text>
                                    <HStack>
                                        <Text
                                            fontSize="xl"
                                            fontWeight="semibold"
                                        >
                                            {compactFormatter.format(
                                                Number(amount),
                                            )}{' '}
                                            {selectedToken.symbol}
                                        </Text>
                                        <Text fontSize="sm" opacity={0.5}>
                                            ≈ $
                                            {compactFormatter.format(
                                                Number(amount) *
                                                    selectedToken.price,
                                            )}
                                        </Text>
                                    </HStack>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </ModalBody>
            </Container>
            <StickyFooterContainer>
                <ModalFooter px={6} py={0}>
                    <Button
                        width="full"
                        height="60px"
                        variant="solid"
                        borderRadius="xl"
                        colorScheme="blue"
                        onClick={handleSend}
                    >
                        CONFIRM
                    </Button>
                </ModalFooter>
            </StickyFooterContainer>

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
            />
        </FadeInViewFromBottom>
    );
};
