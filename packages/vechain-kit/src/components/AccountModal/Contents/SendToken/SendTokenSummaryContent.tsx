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
    Divider,
    Alert,
    AlertIcon,
    ModalFooter,
    useDisclosure,
    Center,
    Icon,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage, humanAddress } from '@/utils';
import { useWallet } from '@/hooks';
import { useTransferERC20, useTransferVET } from '@/hooks';
import { TransactionModal } from '../../../TransactionModal';
import { FiArrowRight } from 'react-icons/fi';

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
    const { account, connection } = useWallet();
    const transactionModal = useDisclosure();

    const transferERC20 = useTransferERC20({
        fromAddress: account.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
    });

    const transferVET = useTransferVET({
        fromAddress: account.address ?? '',
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

            <FadeInViewFromBottom>
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
                            <VStack spacing={4} w="full">
                                <HStack
                                    alignItems="center"
                                    spacing={4}
                                    wordBreak={'break-all'}
                                    w="full"
                                    justifyContent="space-between"
                                >
                                    {/* From Section */}
                                    <Box w="50%" justifyContent="flex-start">
                                        <Text fontSize="sm" mb={2}>
                                            From
                                        </Text>
                                        <HStack minH={'50px'}>
                                            <Image
                                                src={account.image ?? ''}
                                                alt="From account"
                                                boxSize="20px"
                                                borderRadius="xl"
                                            />
                                            <VStack align="start" spacing={0}>
                                                {account.domain && (
                                                    <>
                                                        <Text
                                                            fontWeight="medium"
                                                            fontSize="sm"
                                                        >
                                                            {account.domain}
                                                        </Text>

                                                        <Text
                                                            fontSize="xs"
                                                            opacity={0.5}
                                                        >
                                                            {humanAddress(
                                                                account.address ??
                                                                    '',
                                                            )}
                                                        </Text>
                                                    </>
                                                )}

                                                {!account.domain && (
                                                    <Text
                                                        fontWeight="medium"
                                                        fontSize="sm"
                                                    >
                                                        {humanAddress(
                                                            account.address ??
                                                                '',
                                                            4,
                                                            4,
                                                        )}
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>
                                    </Box>

                                    {/* Arrow Icon */}
                                    <Center
                                        bg={isDark ? '#262626' : 'gray.100'}
                                        borderRadius="xl"
                                        mt={7}
                                        w="40px"
                                        h="35px"
                                        zIndex={2}
                                    >
                                        <Icon
                                            as={FiArrowRight}
                                            boxSize={4}
                                            opacity={0.5}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'gray.600'
                                            }
                                        />
                                    </Center>

                                    {/* To Section */}
                                    <Box w="50%" justifyContent="flex-end">
                                        <Text
                                            fontSize="sm"
                                            mb={2}
                                            textAlign="right"
                                        >
                                            To
                                        </Text>
                                        <HStack
                                            minH={'50px'}
                                            justifyContent="flex-end"
                                        >
                                            <VStack align="end" spacing={0}>
                                                {resolvedDomain && (
                                                    <>
                                                        <Text
                                                            fontWeight="medium"
                                                            fontSize="sm"
                                                        >
                                                            {resolvedDomain}
                                                        </Text>
                                                        <Text
                                                            fontSize="xs"
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
                                                    <Text
                                                        fontWeight="medium"
                                                        fontSize="sm"
                                                    >
                                                        {resolvedAddress ||
                                                            toAddressOrDomain}
                                                    </Text>
                                                )}
                                            </VStack>
                                            <Image
                                                src={getPicassoImage(
                                                    resolvedAddress ||
                                                        toAddressOrDomain,
                                                )}
                                                alt="To account"
                                                boxSize="20px"
                                                borderRadius="xl"
                                            />
                                        </HStack>
                                    </Box>
                                </HStack>
                                <Divider />
                                <Box w="full" justifyContent="flex-start">
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
            </FadeInViewFromBottom>

            {/* <StickyFooterContainer> */}
            <ModalFooter>
                <Button
                    px={4}
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
            {/* </StickyFooterContainer> */}

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
