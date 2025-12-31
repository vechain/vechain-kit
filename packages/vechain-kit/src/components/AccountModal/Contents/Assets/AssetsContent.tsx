import {
    Container,
    Heading,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { useWallet, useTokensWithValues, TokenWithValue } from '@/hooks';
import {
    AssetButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';
import { useCurrency, useTotalBalance } from '@/hooks';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { SupportedCurrency } from '@/utils/currencyUtils';

export type AssetsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsContent = ({ setCurrentContent }: AssetsContentProps) => {
    const { account } = useWallet();
    const { sortedTokens } = useTokensWithValues({ address: account?.address });
    const { currentCurrency } = useCurrency();
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const { formattedBalance } = useTotalBalance({
        address: account?.address ?? '',
    });
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
    const displayedTokens = sortedTokens.filter((token) =>
        ['B3TR', 'VET', 'VTHO'].includes(token.symbol),
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
                    <VStack
                        spacing={2}
                        w="full"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        mt={4}
                        mb={4}
                    >
                        <Heading
                            color={textPrimary}
                            size={'2xl'}
                            fontWeight={'700'}
                        >
                            {formattedBalance}
                        </Heading>
                    </VStack>
                    <Tabs variant="unstyled">
                        <TabList>
                            <Tab
                                color={textSecondary}
                                _selected={{ color: textPrimary }}
                            >
                                Token
                            </Tab>
                            <Tab
                                color={textSecondary}
                                _selected={{ color: textPrimary }}
                            >
                                DeFi
                            </Tab>
                            <Tab
                                color={textSecondary}
                                _selected={{ color: textPrimary }}
                            >
                                NFTs
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel w="full">
                                {displayedTokens.map((token) => {
                                    const hasBalance =
                                        Number(token.balance.scaled) > 0;

                                    return (
                                        <AssetButton
                                            key={token.address}
                                            symbol={token.symbol}
                                            amount={Number(
                                                token.balance.scaled,
                                            )}
                                            currencyValue={
                                                token.valueInCurrency
                                            }
                                            currentCurrency={
                                                currentCurrency as SupportedCurrency
                                            }
                                            icon={token.icon}
                                            onClick={() =>
                                                handleTokenSelect(token)
                                            }
                                            isDisabled={!hasBalance}
                                        />
                                    );
                                })}
                            </TabPanel>
                            <TabPanel>
                                <p>two!</p>
                            </TabPanel>
                            <TabPanel>
                                <p>three!</p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </Container>
        </>
    );
};
{
    /* <InputGroup size="lg">
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
    const hasBalance = Number(token.balance.scaled) > 0;

    return (
        <AssetButton
            key={token.address}
            symbol={token.symbol}
            amount={Number(token.balance.scaled)}
            currencyValue={token.valueInCurrency}
            currentCurrency={
                currentCurrency as SupportedCurrency
            }
            icon={token.icon}
            onClick={() => handleTokenSelect(token)}
            isDisabled={!hasBalance}
        />
    );
})}
</VStack> */
}
