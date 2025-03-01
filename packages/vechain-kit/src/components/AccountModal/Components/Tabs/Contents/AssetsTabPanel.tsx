import { Button, Icon, VStack } from '@chakra-ui/react';
import { useBalances, useWallet } from '@/hooks';
import { AssetButton } from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useVeChainKitConfig } from '@/providers';
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
    const { tokens } = useBalances({ address: account?.address });
    const { allowCustomTokens } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();
    const { t } = useTranslation();

    const handleTokenSelect = (token: {
        symbol: string;
        address: string;
        value: number;
        price: number;
    }) => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                isNavigatingFromMain: false,
                preselectedToken: {
                    symbol: token.symbol,
                    balance: token.value.toString(),
                    address: token.address,
                    numericBalance: token.value,
                    price: token.price,
                },
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
                value: tokens[token.symbol]?.value ?? 0,
                price: tokens[token.symbol]?.price ?? 0,
            })),
    ].sort((a, b) => b.value * b.price - a.value * a.price);

    return (
        <VStack spacing={2} align="stretch" mt={2}>
            {allTokens.map((token) => (
                <AssetButton
                    key={token.address}
                    symbol={token.symbol}
                    amount={token.value}
                    usdValue={token.value * token.price}
                    isDisabled={token.value === 0}
                    onClick={() => handleTokenSelect(token)}
                />
            ))}

            {allowCustomTokens && (
                <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="gray"
                    leftIcon={<Icon as={RiEdit2Line} boxSize={4} />}
                    onClick={() => setCurrentContent('add-custom-token')}
                    alignSelf="center"
                >
                    {t('Manage Custom Tokens')}
                </Button>
            )}
        </VStack>
    );
};
