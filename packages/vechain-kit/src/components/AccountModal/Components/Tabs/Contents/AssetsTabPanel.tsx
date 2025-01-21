import { VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useBalances } from '@/hooks';
import { AssetButton } from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

const MotionVStack = motion(VStack);

export type AssetsTabPanelProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsTabPanel = ({ setCurrentContent }: AssetsTabPanelProps) => {
    const { balances, prices } = useBalances();
    const { network } = useVeChainKitConfig();

    const handleTokenSelect = (token: {
        symbol: string;
        amount: number;
        price: number;
    }) => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                isNavigatingFromMain: false,
                preselectedToken: {
                    symbol: token.symbol,
                    balance: token.amount.toString(),
                    address:
                        token.symbol === 'VET'
                            ? '0x'
                            : token.symbol === 'VTHO'
                            ? getConfig(network.type).vthoContractAddress
                            : token.symbol === 'B3TR'
                            ? getConfig(network.type).b3trContractAddress
                            : token.symbol === 'VOT3'
                            ? getConfig(network.type).vot3ContractAddress
                            : token.symbol === 'veDelegate'
                            ? getConfig(network.type).veDelegate
                            : '',
                    numericBalance: token.amount,
                    price: token.price,
                },
            },
        });
    };

    // Create array of base assets
    const baseAssets = [
        {
            symbol: 'VET',
            amount: balances.vet,
            usdValue: balances.vet * prices.vet,
            price: prices.vet,
        },
        {
            symbol: 'VTHO',
            amount: balances.vtho,
            usdValue: balances.vtho * prices.vtho,
            price: prices.vtho,
        },
        {
            symbol: 'B3TR',
            amount: balances.b3tr,
            usdValue: balances.b3tr * prices.b3tr,
            price: prices.b3tr,
        },
    ].sort((a, b) => b.usdValue - a.usdValue);

    return (
        <MotionVStack
            spacing={2}
            align="stretch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            mt={2}
        >
            {baseAssets.map((token) => (
                <AssetButton
                    key={token.symbol}
                    symbol={token.symbol}
                    amount={token.amount}
                    usdValue={token.usdValue}
                    onClick={() => handleTokenSelect(token)}
                />
            ))}
            {balances.vot3 > 0 && (
                <AssetButton
                    symbol="VOT3"
                    amount={balances.vot3}
                    usdValue={balances.vot3 * prices.b3tr}
                    onClick={() =>
                        handleTokenSelect({
                            symbol: 'VOT3',
                            amount: balances.vot3,
                            price: prices.b3tr,
                        })
                    }
                />
            )}
            {balances.veDelegate > 0 && (
                <AssetButton
                    symbol="veDelegate"
                    amount={balances.veDelegate}
                    usdValue={balances.veDelegate * prices.b3tr}
                    onClick={() =>
                        handleTokenSelect({
                            symbol: 'veDelegate',
                            amount: balances.veDelegate,
                            price: prices.b3tr,
                        })
                    }
                />
            )}
        </MotionVStack>
    );
};
