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
    useToken,
} from '@chakra-ui/react';
import { LuSearch, LuSlash } from 'react-icons/lu';
import { ModalBackButton, StickyHeaderContainer } from '../../../common';
import { AccountModalContentTypes } from '../../Types';
import { AssetButton } from '../../../common';
import { useWallet, useTokensWithValues, TokenWithValue } from '../../../../hooks';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// Import from VeChainKitContext to avoid circular dependency with providers barrel
import { useVeChainKitConfig } from '../../../../providers/VeChainKitContext';
import { useCurrency } from '../../../../hooks';
import { SupportedCurrency } from '../../../../utils/currencyUtils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onSelectToken: (token: TokenWithValue) => void;
    onBack: () => void;
    /**
     * If true, shows all tokens (not just tokens with balance) and sorts owned tokens first
     */
    showAllTokens?: boolean;
};

export const SelectTokenContent = ({
    onSelectToken,
    onBack,
    showAllTokens = false,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const { account } = useWallet();
    const { tokensWithBalance, sortedTokens } = useTokensWithValues({
        address: account?.address ?? '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Get the appropriate token list based on showAllTokens prop
    const availableTokens = useMemo(() => {
        if (showAllTokens) {
            // Show all tokens, sorted with owned tokens first (by value), then unowned
            const ownedTokens = sortedTokens.filter(
                (token) => Number(token.balance) > 0,
            );
            const unownedTokens = sortedTokens.filter(
                (token) => Number(token.balance) === 0,
            );

            // Owned tokens are already sorted by value (highest first)
            // Unowned tokens are sorted alphabetically
            const sortedUnowned = [...unownedTokens].sort((a, b) =>
                a.symbol.localeCompare(b.symbol),
            );

            return [...ownedTokens, ...sortedUnowned];
        }
        return tokensWithBalance;
    }, [showAllTokens, sortedTokens, tokensWithBalance]);

    // Filter tokens
    const filteredTokens = availableTokens.filter(({ symbol }) =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

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
                                bg={
                                    isDark
                                        ? 'vechain-kit-overlay'
                                        : 'vechain-kit-card'
                                }
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

                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color={textPrimary}
                            mt={4}
                        >
                            {showAllTokens ? t('All tokens') : t('Your tokens')}
                        </Text>

                        {filteredTokens.length === 0 ? (
                            <VStack spacing={2} py={8}>
                                <Icon
                                    as={LuSlash}
                                    boxSize={12}
                                    color={textTertiary}
                                />
                                <Text fontSize="lg" color={textPrimary}>
                                    {t('No tokens found')}
                                </Text>
                                <Text fontSize="md" color={textSecondary}>
                                    {t('Try searching with a different term')}
                                </Text>
                            </VStack>
                        ) : (
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
                                        onClick={() => onSelectToken(token)}
                                    />
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </Container>
            <ModalFooter pt={0} />
        </>
    );
};
