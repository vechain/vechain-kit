import { Button, Icon, VStack } from '@chakra-ui/react';
import { useBalances, useWallet } from '@/hooks';
import { AssetButton } from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCustomTokens } from '@/hooks/api/wallet/useCustomTokens';
import { useTranslation } from 'react-i18next';
import { RiEdit2Line } from 'react-icons/ri';

export type AssetsTabPanelProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsTabPanel = ({ setCurrentContent }: AssetsTabPanelProps) => {
    const { account } = useWallet();
    const { balances, prices } = useBalances({ address: account?.address });
    const { network, developerMode } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();
    const { t } = useTranslation();

    const openCustomTokenModal = () => {
        setCurrentContent('add-custom-token');
    };

    const handleTokenSelect = (token: {
        address: string;
        amount: number;
        price: number;
    }) => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                isNavigatingFromMain: false,
                preselectedToken: {
                    symbol:
                        customTokens.find((t) => t.address === token.address)
                            ?.symbol ?? 'Unknown',
                    balance: token.amount.toString(),
                    address: token.address,
                    numericBalance: token.amount,
                    price: token.price,
                },
            },
        });
    };
    // Preload contract addresses to avoid redundant calls
    const contractAddresses = {
        VET: '0x', // VET (Native token, no contract)
        VTHO: getConfig(network.type).vthoContractAddress,
        B3TR: getConfig(network.type).b3trContractAddress,
        VOT3: getConfig(network.type).vot3ContractAddress,
    };

    // Convert balances and prices into lookup maps for quick access
    const balanceMap = new Map(
        balances.map(({ address, value }) => [address, value]),
    );
    const priceMap = new Map(
        prices.map(({ address, price }) => [address, price]),
    );

    // Define base assets
    const baseAssets = Object.entries(contractAddresses).map(
        ([symbol, address]) => ({
            address,
            symbol,
            amount: balanceMap.get(address) ?? 0,
            price: priceMap.get(address) ?? 0,
        }),
    );
    //Format the custom tokens
    const otherTokens = customTokens.map((token) => ({
        ...token,
        amount: balanceMap.get(token.address) ?? 0,
        price: priceMap.get(token.address) ?? 0,
    }));

    const allTokens = baseAssets
        .concat(otherTokens)
        .sort((a, b) => b.amount * b.price - a.amount * a.price); // Sort by USD value

    return (
        <VStack spacing={2} align="stretch" mt={2}>
            {allTokens.map((token) => (
                <AssetButton
                    key={token.address}
                    symbol={token.symbol}
                    amount={token.amount}
                    usdValue={token.amount * token.price}
                    isDisabled={token.amount === 0}
                    onClick={() => handleTokenSelect(token)}
                />
            ))}

            {/* Plus Icon to add a new token */}
            {developerMode && (
                <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="gray"
                    leftIcon={<Icon as={RiEdit2Line} boxSize={4} />}
                    onClick={openCustomTokenModal}
                    alignSelf="center" // Centers the button
                >
                    {t('Manage Custom Tokens')}
                </Button>
            )}
        </VStack>
    );
};
