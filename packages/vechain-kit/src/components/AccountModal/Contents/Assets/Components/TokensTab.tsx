import {
    Input,
    InputGroup,
    InputLeftElement,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { useState } from 'react';
import { AssetButton } from '@/components/common';
import {
    TokenWithValue,
    useCurrency,
    useTokensWithValues,
    useWallet,
} from '@/hooks';
import { SupportedCurrency } from '@/utils/currencyUtils';
import { useVeChainKitConfig } from '@/providers';
import { useTranslation } from 'react-i18next';

type Props = {
    onSelect: (token: TokenWithValue) => void;
};

export const TokensTab = ({ onSelect }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { darkMode } = useVeChainKitConfig();
    const { sortedTokens } = useTokensWithValues({ address: account?.address });
    const { currentCurrency } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');

    const filteredTokens = sortedTokens.filter(({ symbol }) =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <VStack spacing={3} align="stretch" w="full">
            <InputGroup size="lg">
                <Input
                    placeholder={t('Search token')}
                    bg={darkMode ? '#00000038' : 'gray.50'}
                    borderRadius="xl"
                    height="56px"
                    pl={12}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="search-token-input"
                />
                <InputLeftElement h="56px" w="56px" pl={4}>
                    <LuSearch color={textTertiary} />
                </InputLeftElement>
            </InputGroup>

            <VStack spacing={2} align="stretch">
                {filteredTokens.map((token) => (
                    <AssetButton
                        key={token.address}
                        symbol={token.symbol}
                        amount={Number(token.balance)}
                        currencyValue={token.valueInCurrency}
                        currentCurrency={
                            currentCurrency as SupportedCurrency
                        }
                        onClick={() => onSelect(token)}
                    />
                ))}
            </VStack>
        </VStack>
    );
};
