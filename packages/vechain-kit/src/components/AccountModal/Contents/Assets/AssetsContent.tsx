import {
    Button,
    Container,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
} from '@chakra-ui/react';
import { useBalances, useWallet } from '@/hooks';
import {
    AssetButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useCustomTokens } from '@/hooks/api/wallet/useCustomTokens';
import { useTranslation } from 'react-i18next';
import { RiEdit2Line } from 'react-icons/ri';
import { AccountModalContentTypes } from '../../Types';
import { CiSearch } from 'react-icons/ci';
import { useState } from 'react';
import { useCurrency } from '@/hooks/api/wallet';
export type AssetsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsContent = ({ setCurrentContent }: AssetsContentProps) => {
    const { account } = useWallet();
    const { tokens } = useBalances({ address: account?.address });
    const { allowCustomTokens, darkMode } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();
    const { getTokenValue, currentCurrency } = useCurrency();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const handleTokenSelect = (token: {
        symbol: string;
        address: string;
        balance: string;
        usdPrice: number;
        valueInUsd: number;
        valueInGbp: number;
        valueInEur: number;
        gbpUsdPrice: number;
        eurUsdPrice: number;
    }) => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                isNavigatingFromMain: false,
                preselectedToken: {
                    symbol: token.symbol,
                    address: token.address,
                    usdPrice: token.usdPrice,
                    valueInUsd: token.valueInUsd,
                    valueInGbp: token.valueInGbp,
                    valueInEur: token.valueInEur,
                    balance: token.balance,
                    gbpUsdPrice: token.gbpUsdPrice,
                    eurUsdPrice: token.eurUsdPrice,
                },
                onBack: () => setCurrentContent('assets'),
            },
        });
    };

    // Combine base tokens and custom tokens
    const allTokens = [
        ...Object.values(tokens),
        ...customTokens
            .filter((token) => !tokens[token.symbol]) // Only add custom tokens not in base tokens
            .map((token) => ({
                ...token,
                balance: tokens[token.symbol]?.balance ?? 0,
                usdPrice: tokens[token.symbol]?.usdPrice ?? 0,
                valueInUsd: tokens[token.symbol]?.valueInUsd ?? 0,
                valueInGbp: tokens[token.symbol]?.valueInGbp ?? 0,
                valueInEur: tokens[token.symbol]?.valueInEur ?? 0,
                gbpUsdPrice: tokens[token.symbol]?.gbpUsdPrice ?? 0,
                eurUsdPrice: tokens[token.symbol]?.eurUsdPrice ?? 0,
            })),
    ].sort((a, b) => getTokenValue(b) - getTokenValue(a));

    // Filter and sort tokens
    const filteredTokens = allTokens
        .filter(({ symbol }) =>
            symbol.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
            if (Number(a.balance) > 0 !== Number(b.balance) > 0) {
                return Number(b.balance) > 0 ? 1 : -1;
            }
            return Number(b.balance) * b.usdPrice - Number(a.balance) * a.usdPrice;
        });

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Assets')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <InputGroup size="lg">
                        <Input
                            placeholder="Search token"
                            bg={darkMode ? '#00000038' : 'gray.50'}
                            borderRadius="xl"
                            height="56px"
                            pl={12}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <InputLeftElement h="56px" w="56px" pl={4}>
                            <CiSearch
                                color={darkMode ? 'whiteAlpha.400' : 'gray.400'}
                            />
                        </InputLeftElement>
                    </InputGroup>

                    <VStack spacing={2} align="stretch" mt={2}>
                        {filteredTokens.map((token) => {
                            const hasBalance = Number(token.balance) > 0;
                            const valueInCurrency = getTokenValue(token);

                            return (
                                <AssetButton
                                    key={token.address}
                                    symbol={token.symbol}
                                    amount={Number(token.balance)}
                                    currencyValue={valueInCurrency}
                                    currentCurrency={currentCurrency}
                                    onClick={() => handleTokenSelect(token)}
                                    isDisabled={!hasBalance}
                                />
                            );
                        })}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    {allowCustomTokens && (
                        <Button
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={RiEdit2Line} boxSize={4} />}
                            onClick={() =>
                                setCurrentContent('add-custom-token')
                            }
                        >
                            {t('Manage Custom Tokens')}
                        </Button>
                    )}
                </ModalFooter>
            </Container>
        </>
    );
};
