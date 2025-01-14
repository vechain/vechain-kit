import { HStack, Icon, Text, Button, VStack } from '@chakra-ui/react';
import { IoRefresh } from 'react-icons/io5';
import { useBalances, useRefreshBalances } from '@/hooks';
import { motion } from 'framer-motion';
import { AssetRow } from './AssetRow';
import { useState } from 'react';

const MotionVStack = motion(VStack);

export const AssetsTabPanel = () => {
    const { balances, prices } = useBalances();
    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

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
            <AssetRow
                symbol="VET"
                amount={balances.vet}
                usdValue={balances.vet * prices.vet}
            />
            <AssetRow
                symbol="VTHO"
                amount={balances.vtho}
                usdValue={balances.vtho * prices.vtho}
            />
            <AssetRow
                symbol="B3TR"
                amount={balances.b3tr}
                usdValue={balances.b3tr * prices.b3tr}
            />
            {balances.vot3 > 0 && (
                <AssetRow
                    symbol="VOT3"
                    amount={balances.vot3}
                    usdValue={balances.vot3 * prices.b3tr}
                />
            )}
            {balances.veDelegate > 0 && (
                <AssetRow
                    symbol="veDelegate"
                    amount={balances.veDelegate}
                    usdValue={balances.veDelegate * prices.b3tr}
                />
            )}
            <HStack justify="flex-end" px={2}>
                <Button
                    aria-label="Refresh balances"
                    size="sm"
                    variant="link"
                    onClick={handleRefresh}
                    leftIcon={<Icon as={IoRefresh} />}
                    isLoading={isRefreshing}
                    loadingText="Refreshing"
                >
                    <Text fontSize="sm" fontWeight="bold">
                        Refresh
                    </Text>
                </Button>
            </HStack>
        </MotionVStack>
    );
};
