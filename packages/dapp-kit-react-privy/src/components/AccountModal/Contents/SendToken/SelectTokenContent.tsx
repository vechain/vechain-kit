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
    InputLeftElement,
    HStack,
    Icon,
    Image,
    Box,
} from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { FiSlash } from 'react-icons/fi';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '../../../common';
import { AccountModalContentTypes } from '../../AccountModal';
import { useBalances } from '../../../../hooks';
import { TOKEN_LOGOS } from '../../../../utils';
import { useState } from 'react';

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
    onSelectToken: (token: Token) => void;
    onBack: () => void;
};

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const SelectTokenContent = ({ onSelectToken, onBack }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { balances, prices } = useBalances();
    const [searchQuery, setSearchQuery] = useState('');

    // Transform balances into tokens array with numeric values
    const tokens: Token[] = [
        {
            symbol: 'VET',
            balance: balances.vet.toString(),
            address: '0x',
            numericBalance: balances.vet,
            price: prices.vet,
        },
        {
            symbol: 'VTHO',
            balance: balances.vtho.toString(),
            address: '0x0000000000000000000000000000456E65726779',
            numericBalance: balances.vtho,
            price: prices.vtho,
        },
        {
            symbol: 'B3TR',
            balance: balances.b3tr.toString(),
            address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
            numericBalance: balances.b3tr,
            price: prices.b3tr,
        },
        {
            symbol: 'VOT3',
            balance: balances.vot3.toString(),
            address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
            numericBalance: balances.vot3,
            price: prices.b3tr,
        },
        {
            symbol: 'veB3TR',
            balance: balances.veB3tr.toString(),
            address: '0x420dFe6B7Bc605Ce61E9839c8c0E745870A6CDE0',
            numericBalance: balances.veB3tr,
            price: prices.b3tr,
        },
    ];

    // Filter tokens based on search query
    const filteredTokens = tokens.filter((token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Select Token
                </ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <InputGroup size="lg">
                            <Input
                                placeholder="Search token"
                                bg={isDark ? '#1a1a1a' : 'gray.50'}
                                borderRadius="xl"
                                height="56px"
                                pl={12}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <InputLeftElement h="56px" w="56px" pl={4}>
                                <CiSearch
                                    color={
                                        isDark ? 'whiteAlpha.400' : 'gray.400'
                                    }
                                />
                            </InputLeftElement>
                        </InputGroup>

                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color={isDark ? 'whiteAlpha.800' : 'gray.700'}
                            mt={4}
                        >
                            Your tokens
                        </Text>

                        {filteredTokens.length === 0 ? (
                            <VStack
                                spacing={2}
                                py={8}
                                color={isDark ? 'whiteAlpha.600' : 'gray.500'}
                            >
                                <Icon as={FiSlash} boxSize={12} opacity={0.5} />
                                <Text fontSize="lg">No tokens found</Text>
                                <Text fontSize="md">
                                    Try searching with a different term
                                </Text>
                            </VStack>
                        ) : (
                            <VStack spacing={2} align="stretch">
                                {filteredTokens.map((token) => {
                                    const hasBalance = token.numericBalance > 0;
                                    const usdValue =
                                        token.numericBalance * token.price;

                                    return (
                                        <Button
                                            key={token.symbol}
                                            height="72px"
                                            variant="ghost"
                                            justifyContent="space-between"
                                            p={4}
                                            onClick={() => onSelectToken(token)}
                                            isDisabled={!hasBalance}
                                            opacity={hasBalance ? 1 : 0.5}
                                            _disabled={{
                                                cursor: 'not-allowed',
                                                opacity: 0.5,
                                            }}
                                        >
                                            <HStack>
                                                <Image
                                                    src={
                                                        TOKEN_LOGOS[
                                                            token.symbol
                                                        ]
                                                    }
                                                    alt={`${token.symbol} logo`}
                                                    boxSize="24px"
                                                    borderRadius="full"
                                                    fallback={
                                                        <Box
                                                            boxSize="24px"
                                                            borderRadius="full"
                                                            bg="whiteAlpha.200"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                fontSize="10px"
                                                                fontWeight="bold"
                                                            >
                                                                {token.symbol.slice(
                                                                    0,
                                                                    3,
                                                                )}
                                                            </Text>
                                                        </Box>
                                                    }
                                                />
                                                <Text>{token.symbol}</Text>
                                            </HStack>
                                            <VStack
                                                align="flex-end"
                                                spacing={0}
                                            >
                                                <Text>
                                                    {compactFormatter.format(
                                                        token.numericBalance,
                                                    )}
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    $
                                                    {compactFormatter.format(
                                                        usdValue,
                                                    )}
                                                </Text>
                                            </VStack>
                                        </Button>
                                    );
                                })}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </Container>
        </FadeInViewFromBottom>
    );
};
