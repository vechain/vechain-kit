import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Button,
    Text,
    useColorMode,
    InputGroup,
    Box,
    HStack,
    Center,
    Icon,
    ModalFooter,
    Image,
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '../../../common';
import { AccountModalContentTypes } from '../../AccountModal';
import { FiArrowDown } from 'react-icons/fi';
import { SelectTokenContent } from './SelectTokenContent';
import { TOKEN_LOGOS } from '@/utils';
import { ZeroAddress } from 'ethers';
import { useVechainDomain } from '@vechain/dapp-kit-react';
import { compareAddresses, isValidAddress } from '@/utils';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

type Token = {
    symbol: string;
    balance: string;
    address: string;
    numericBalance: number;
    price: number;
};

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onSend: (address: string, amount: string) => void;
};

export const SendTokenContent = ({ setCurrentContent, onSend }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [toAddressOrDomain, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSelectingToken, setIsSelectingToken] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);

    const { address: resolvedAddress } = useVechainDomain({
        addressOrDomain: toAddressOrDomain,
    });

    const validateAddress = useCallback(
        (value: string) => {
            if (!value) {
                setAddressError('Address is required');
                return false;
            }

            const isValidReceiver =
                !compareAddresses(
                    resolvedAddress ?? ZeroAddress,
                    ZeroAddress,
                ) || isValidAddress(value);

            if (!isValidReceiver) {
                setAddressError('Invalid address or domain');
                return false;
            }

            return true;
        },
        [resolvedAddress],
    );

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = e.target.value;

        // Clear any previous errors
        setError(null);

        // Only allow numbers and decimals
        if (newAmount && !/^\d*\.?\d*$/.test(newAmount)) {
            return;
        }

        setAmount(newAmount);

        // Validate against balance if we have a selected token
        if (selectedToken && newAmount) {
            const numericAmount = parseFloat(newAmount);
            if (numericAmount > selectedToken.numericBalance) {
                setError(`Insufficient ${selectedToken.symbol} balance`);
            }
        }
    };

    const handleSetMaxAmount = () => {
        if (selectedToken) {
            const maxAmount = selectedToken.numericBalance.toString();
            setAmount(maxAmount);
            // Clear any previous errors since we're setting a valid amount
            setError(null);
        }
    };

    const handleSend = () => {
        // Validate address when send is clicked
        const isAddressValid = validateAddress(toAddressOrDomain);

        if (!isAddressValid || !selectedToken) {
            return;
        }

        // Pass the data as state when changing content
        setCurrentContent({
            type: 'send-token-summary',
            props: {
                toAddressOrDomain,
                resolvedDomain: resolvedAddress,
                amount,
                selectedToken,
                onSend,
                setCurrentContent,
            },
        });
    };

    if (isSelectingToken) {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={(token) => {
                    setSelectedToken(token);
                    setIsSelectingToken(false);
                }}
                onBack={() => setIsSelectingToken(false)}
            />
        );
    }

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
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={1} align="stretch" position="relative">
                        <Box
                            p={6}
                            borderRadius="xl"
                            bg={isDark ? '#1a1a1a' : 'gray.50'}
                            height="auto"
                            minHeight="100px"
                        >
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                    <Input
                                        placeholder="0"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        variant="unstyled"
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        border="none"
                                        _focus={{ border: 'none' }}
                                        isInvalid={!!error}
                                    />
                                    {selectedToken ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.800'
                                                    : 'blackAlpha.800',
                                            }}
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                            leftIcon={
                                                <Image
                                                    src={
                                                        TOKEN_LOGOS[
                                                            selectedToken.symbol
                                                        ]
                                                    }
                                                    alt={`${selectedToken.symbol} logo`}
                                                    boxSize="20px"
                                                    borderRadius="full"
                                                    fallback={
                                                        <Box
                                                            boxSize="20px"
                                                            borderRadius="full"
                                                            bg="whiteAlpha.200"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                fontSize="8px"
                                                                fontWeight="bold"
                                                            >
                                                                {selectedToken.symbol.slice(
                                                                    0,
                                                                    3,
                                                                )}
                                                            </Text>
                                                        </Box>
                                                    }
                                                />
                                            }
                                        >
                                            {selectedToken.symbol}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            borderColor={
                                                isDark
                                                    ? 'whiteAlpha.700'
                                                    : 'blackAlpha.700'
                                            }
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.800'
                                                    : 'blackAlpha.800',
                                            }}
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                        >
                                            Select token
                                        </Button>
                                    )}
                                </HStack>
                                {selectedToken && (
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        color={
                                            isDark
                                                ? 'whiteAlpha.700'
                                                : 'blackAlpha.700'
                                        }
                                    >
                                        <Text>Balance:</Text>
                                        <Text
                                            cursor="pointer"
                                            _hover={{
                                                color: isDark
                                                    ? 'blue.300'
                                                    : 'blue.500',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={handleSetMaxAmount}
                                            noOfLines={1}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {compactFormatter.format(
                                                selectedToken.numericBalance,
                                            )}
                                        </Text>
                                    </HStack>
                                )}
                                {error && (
                                    <Text color="red.500" fontSize="sm">
                                        {error}
                                    </Text>
                                )}
                            </VStack>
                        </Box>

                        {/* Arrow Icon */}
                        <Center
                            position="relative"
                            marginTop="-20px"
                            marginBottom="-20px"
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
                                color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                            />
                        </Center>

                        {/* Address Input Section */}
                        <Box
                            borderRadius="xl"
                            bg={isDark ? '#1a1a1a' : 'gray.50'}
                            height="auto"
                            minHeight="100px"
                            display="flex"
                            alignItems="center"
                        >
                            <VStack
                                align="stretch"
                                spacing={2}
                                p={6}
                                width="100%"
                            >
                                <InputGroup size="lg">
                                    <Input
                                        placeholder="Type the receiver address or domain"
                                        value={toAddressOrDomain}
                                        onChange={(e) => {
                                            setToAddress(e.target.value);
                                            setAddressError(null);
                                        }}
                                        fontSize="md"
                                        variant="unstyled"
                                        isInvalid={!!addressError}
                                    />
                                </InputGroup>
                                {addressError && (
                                    <Text color="red.500" fontSize="sm">
                                        {addressError}
                                    </Text>
                                )}
                            </VStack>
                        </Box>

                        <ModalFooter px={0}>
                            <Button
                                width="full"
                                height="60px"
                                variant="solid"
                                borderRadius="xl"
                                colorScheme="blue"
                                isDisabled={
                                    !selectedToken ||
                                    !amount ||
                                    !toAddressOrDomain ||
                                    !!error ||
                                    !!addressError
                                }
                                onClick={handleSend}
                            >
                                {selectedToken ? 'Send' : 'Select Token'}
                            </Button>
                        </ModalFooter>
                    </VStack>
                </ModalBody>
            </Container>
        </FadeInViewFromBottom>
    );
};
