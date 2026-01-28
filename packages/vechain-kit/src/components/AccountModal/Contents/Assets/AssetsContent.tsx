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
    useToken,
} from '@chakra-ui/react';
import { useWallet, useTokensWithValues, TokenWithValue } from '../../../../hooks';
import {
    AssetButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { AccountModalContentTypes } from '../../Types';
import { LuSearch } from 'react-icons/lu';
import { useState } from 'react';
import { useCurrency } from '../../../../hooks';
import { SupportedCurrency } from '../../../../utils/currencyUtils';
import { useAccountModalOptions } from '../../../../hooks/modals/useAccountModalOptions';

export type AssetsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsContent = ({ setCurrentContent }: AssetsContentProps) => {
    const { account } = useWallet();
    const { sortedTokens } = useTokensWithValues({ address: account?.address });
    const { allowCustomTokens, darkMode } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();
    
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const [searchQuery, setSearchQuery] = useState('');

    const handleTokenSelect = (token: TokenWithValue) => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: token,
                onBack: () => setCurrentContent('assets'),
            },
        });
    };

    // Filter tokens by search query
    const filteredTokens = sortedTokens.filter(({ symbol }) =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Assets')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    />
                )}
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
                            data-testid="search-token-input"
                        />
                        <InputLeftElement h="56px" w="56px" pl={4}>
                            <LuSearch
                                color={textTertiary}
                            />
                        </InputLeftElement>
                    </InputGroup>

                    <VStack spacing={2} align="stretch" mt={2}>
                        {filteredTokens.map((token) => {
                            const hasBalance = Number(token.balance) > 0;

                            return (
                                <AssetButton
                                    key={token.address}
                                    symbol={token.symbol}
                                    amount={Number(token.balance)}
                                    currencyValue={token.valueInCurrency}
                                    currentCurrency={
                                        currentCurrency as SupportedCurrency
                                    }
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
                            leftIcon={<Icon as={LuPencil} boxSize={4} />}
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
