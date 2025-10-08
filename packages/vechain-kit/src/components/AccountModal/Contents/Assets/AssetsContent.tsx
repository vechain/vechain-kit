import {
    Container,
    Input,
    InputGroup,
    InputLeftElement,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    IconButton,
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
                isNavigatingFromMain: false,
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

            <Container
                h={['540px', 'auto']}
                p={0}
                display="flex"
                flexDirection="column"
                position="relative"
            >
                <ModalBody pb={0}>
                    <Text
                        fontSize="xs"
                        color={darkMode ? 'whiteAlpha.500' : 'blackAlpha.500'}
                        mb={2}
                        textAlign="center"
                    >
                        All tokens are VIP-180 compatible on VeChain
                    </Text>
                    <InputGroup
                        size="lg"
                        position="sticky"
                        top={0}
                        bg={darkMode ? 'gray.800' : 'white'}
                        zIndex={1}
                        mb={3}
                    >
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

                    <VStack
                        spacing={2}
                        align="stretch"
                        overflowY="auto"
                        maxH="350px"
                        pr={2}
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: darkMode ? '#1a202c' : '#f1f1f1',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: darkMode ? '#4a5568' : '#888',
                                borderRadius: '4px',
                            },
                        }}
                    >
                        {filteredTokens.map((token) => {
                            const hasBalance = Number(token.balance) > 0;

                            return (
                                <AssetButton
                                    key={token.address}
                                    symbol={token.symbol}
                                    address={token.address}
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
                {allowCustomTokens && (
                    <IconButton
                        aria-label={t('Manage Custom Tokens')}
                        icon={<RiEdit2Line />}
                        position="absolute"
                        bottom={4}
                        right={4}
                        size="lg"
                        borderRadius="full"
                        bg={darkMode ? 'blue.500' : 'blue.500'}
                        color="white"
                        _hover={{
                            bg: darkMode ? 'blue.600' : 'blue.600',
                            transform: 'scale(1.05)',
                        }}
                        boxShadow="lg"
                        onClick={() => setCurrentContent('add-custom-token')}
                    />
                )}
            </Container>
        </>
    );
};
