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
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
    StickyFooterContainer,
} from '../../../common';
import { AccountModalContentTypes } from '../../AccountModal';
import { compareAddresses, getPicassoImage, humanAddress } from '@/utils';
import { useWallet } from '@/hooks';

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
    onSend,
    toAddressOrDomain,
    resolvedDomain,
    amount,
    selectedToken,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { selectedAccount, connection } = useWallet();

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
                            <VStack align="stretch" spacing={4}>
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
                                                <Text fontWeight="medium">
                                                    {selectedAccount.domain}
                                                </Text>
                                            )}
                                            <Text
                                                fontSize="sm"
                                                color="gray.500"
                                            >
                                                {humanAddress(
                                                    selectedAccount.address,
                                                )}
                                            </Text>
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
                                            <Text fontWeight="medium">
                                                {toAddressOrDomain}
                                            </Text>

                                            {resolvedDomain &&
                                                !compareAddresses(
                                                    resolvedDomain,
                                                    toAddressOrDomain,
                                                ) && (
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                    >
                                                        {humanAddress(
                                                            resolvedDomain,
                                                        )}
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
                                        <Text fontSize="sm" color="gray.500">
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
                        onClick={() => onSend(toAddressOrDomain, amount)}
                    >
                        CONFIRM
                    </Button>
                </ModalFooter>
            </StickyFooterContainer>
        </FadeInViewFromBottom>
    );
};
