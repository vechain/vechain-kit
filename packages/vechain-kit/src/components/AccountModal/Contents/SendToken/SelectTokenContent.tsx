import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Text,
    InputGroup,
    InputLeftElement,
    Icon,
    ModalFooter,
    Container,
} from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { FiSlash } from 'react-icons/fi';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes, AssetButton } from '@/components';
import { useBalances, useWallet } from '@/hooks';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type Token = {
    symbol: string;
    balance: string;
    address: string;
    numericBalance: string;
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
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();
    const { tokens } = useBalances({ address: account?.address ?? '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Convert tokens object to array and add custom tokens
    const allTokens: Token[] = [
        ...Object.entries(tokens).map(([symbol, data]) => ({
            symbol,
            balance: data.value.toString(),
            address: data.address,
            numericBalance: data.value,
            price: data.price,
        })),
    ];

    // Filter and sort tokens
    const filteredTokens = allTokens
        .filter(({ symbol }) =>
            symbol.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            if (Number(a.numericBalance) > 0 !== Number(b.numericBalance) > 0) {
                return Number(b.numericBalance) > 0 ? 1 : -1;
            }
            return (
                Number(b.numericBalance) * b.price -
                Number(a.numericBalance) * a.price
            );
        });

    useEffect(() => {
        if (searchQuery) {
            Analytics.send.tokenSearchPerformed(searchQuery);
        }
    }, [searchQuery, filteredTokens.length]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select Token')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <InputGroup size="lg">
                            <Input
                                placeholder="Search token"
                                bg={isDark ? '#00000038' : 'gray.50'}
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
                                color={
                                    isDark ? 'whiteAlpha.600' : 'blackAlpha.600'
                                }
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
                                    const hasBalance =
                                        Number(token.numericBalance) > 0;
                                    const usdValue =
                                        Number(token.numericBalance) *
                                        token.price;

                                    return (
                                        <AssetButton
                                            key={token.address}
                                            symbol={token.symbol}
                                            amount={Number(
                                                token.numericBalance,
                                            )}
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
            </Container>
            <ModalFooter pt={0} />
        </>
    );
};
