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
import { useWallet, useTokensWithValues, TokenWithValue } from '@/hooks';
import {
    AssetButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useTranslation } from 'react-i18next';
import { RiEdit2Line } from 'react-icons/ri';
import { AccountModalContentTypes } from '../../Types';
import { CiSearch } from 'react-icons/ci';
import { useState } from 'react';
import { useCurrency } from '@/hooks';
import { SupportedCurrency } from '@/utils/currencyUtils';

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
    const { t } = useTranslation();
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
                            data-testid="search-token-input"
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
