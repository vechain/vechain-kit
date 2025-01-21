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
import { AccountModalContentTypes, AssetButton } from '@/components';
import { useBalances } from '@/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

export type Token = {
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
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { balances, prices } = useBalances();
    const [searchQuery, setSearchQuery] = useState('');

    const { network } = useVeChainKitConfig();

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
            address: getConfig(network.type).vthoContractAddress,
            numericBalance: balances.vtho,
            price: prices.vtho,
        },
        {
            symbol: 'B3TR',
            balance: balances.b3tr.toString(),
            address: getConfig(network.type).b3trContractAddress,
            numericBalance: balances.b3tr,
            price: prices.b3tr,
        },
        {
            symbol: 'VOT3',
            balance: balances.vot3.toString(),
            address: getConfig(network.type).vot3ContractAddress,
            numericBalance: balances.vot3,
            price: prices.b3tr,
        },
        {
            symbol: 'veDelegate',
            balance: balances.veDelegate.toString(),
            address: getConfig(network.type).veDelegate,
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
                    {t('Select Token')}
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
                            {t('Your tokens')}
                        </Text>

                        {filteredTokens.length === 0 ? (
                            <VStack
                                spacing={2}
                                py={8}
                                color={isDark ? 'whiteAlpha.600' : 'gray.500'}
                            >
                                <Icon as={FiSlash} boxSize={12} opacity={0.5} />
                                <Text fontSize="lg">
                                    {t('No tokens found')}
                                </Text>
                                <Text fontSize="md">
                                    {t('Try searching with a different term')}
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
