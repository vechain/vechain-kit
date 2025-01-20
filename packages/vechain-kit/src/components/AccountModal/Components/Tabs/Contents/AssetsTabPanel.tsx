import { VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useBalances } from '@/hooks';
import { AssetButton } from '@/components/common';

const MotionVStack = motion(VStack);

export const AssetsTabPanel = () => {
    const { balances, prices } = useBalances();

    // Create array of base assets
    const baseAssets = [
        {
            symbol: 'VET',
            amount: balances.vet,
            usdValue: balances.vet * prices.vet,
        },
        {
            symbol: 'VTHO',
            amount: balances.vtho,
            usdValue: balances.vtho * prices.vtho,
        },
        {
            symbol: 'B3TR',
            amount: balances.b3tr,
            usdValue: balances.b3tr * prices.b3tr,
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
            {baseAssets.map(({ symbol, amount, usdValue }) => (
                <AssetButton
                    key={symbol}
                    symbol={symbol}
                    amount={amount}
                    usdValue={usdValue}
                />
            ))}
            {balances.vot3 > 0 && (
                <AssetButton
                    symbol="VOT3"
                    amount={balances.vot3}
                    usdValue={balances.vot3 * prices.b3tr}
                />
            )}
            {balances.veDelegate > 0 && (
                <AssetButton
                    symbol="veDelegate"
                    amount={balances.veDelegate}
                    usdValue={balances.veDelegate * prices.b3tr}
                />
            )}
        </MotionVStack>
    );
};
