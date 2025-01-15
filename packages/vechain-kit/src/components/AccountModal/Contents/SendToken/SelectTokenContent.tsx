import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Text,
    useColorMode,
    InputGroup,
    InputLeftElement,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { FiSlash } from 'react-icons/fi';
import {
    FadeInViewFromBottom,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '@/components';
import { useBalances } from '@/hooks';
import { useState } from 'react';
import { AssetButton } from '@/components/common';

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
            symbol: 'veDelegate',
            balance: balances.veDelegate.toString(),
            address: '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
            numericBalance: balances.veDelegate,
            price: prices.b3tr,
        },
    ];

    // Filter tokens based on search query
    const filteredTokens = tokens
        .filter((token) =>
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            // Sort by balance first (tokens with balance > 0 come first)
            if (a.numericBalance > 0 !== b.numericBalance > 0) {
                return b.numericBalance > 0 ? 1 : -1;
            }
            // If both have or don't have balance, sort by USD value
            return b.numericBalance * b.price - a.numericBalance * a.price;
        });

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

            <FadeInViewFromBottom>
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
                                        <AssetButton
                                            key={token.symbol}
                                            symbol={token.symbol}
                                            amount={token.numericBalance}
                                            usdValue={usdValue}
                                            onClick={() => onSelectToken(token)}
                                            isDisabled={!hasBalance}
                                        />
                                    );
                                })}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter />
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
