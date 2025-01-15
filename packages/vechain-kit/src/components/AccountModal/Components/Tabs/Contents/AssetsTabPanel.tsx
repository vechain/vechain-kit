import { VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useBalances } from '@/hooks';
import { AssetButton } from '@/components/common';

const MotionVStack = motion(VStack);

export const AssetsTabPanel = () => {
    const { balances, prices } = useBalances();

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
            <AssetButton
                symbol="VET"
                amount={balances.vet}
                usdValue={balances.vet * prices.vet}
            />
            <AssetButton
                symbol="VTHO"
                amount={balances.vtho}
                usdValue={balances.vtho * prices.vtho}
            />
            <AssetButton
                symbol="B3TR"
                amount={balances.b3tr}
                usdValue={balances.b3tr * prices.b3tr}
            />
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
