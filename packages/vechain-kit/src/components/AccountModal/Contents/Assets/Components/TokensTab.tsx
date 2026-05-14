import {
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Tooltip,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuPencil, LuSearch } from 'react-icons/lu';
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
    onManageTokens?: () => void;
};

export const TokensTab = ({ onSelect, onManageTokens }: Props) => {
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
            <HStack spacing={2}>
                <InputGroup size="md" flex={1}>
                    <Input
                        placeholder={t('Search token')}
                        bg={darkMode ? '#00000038' : 'gray.50'}
                        borderRadius="lg"
                        height="40px"
                        pl={10}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="search-token-input"
                    />
                    <InputLeftElement h="40px" w="40px" pl={3}>
                        <LuSearch color={textTertiary} />
                    </InputLeftElement>
                </InputGroup>
                {onManageTokens && (
                    <Tooltip label={t('Manage Custom Tokens')}>
                        <IconButton
                            aria-label={t('Manage Custom Tokens')}
                            icon={<LuPencil />}
                            variant="vechainKitSecondary"
                            size="md"
                            height="40px"
                            width="40px"
                            minW="40px"
                            borderRadius="lg"
                            onClick={onManageTokens}
                        />
                    </Tooltip>
                )}
            </HStack>

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
                        priceChange24hPct={token.priceChange24hPct}
                    />
                ))}
            </VStack>
        </VStack>
    );
};
