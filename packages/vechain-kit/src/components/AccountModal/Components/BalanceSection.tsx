import {
    Heading,
    Spinner,
    VStack,
    Text,
    Button,
    HStack,
    Icon,
} from '@chakra-ui/react';
import { useBalances, useRefreshBalances } from '@/hooks';
import { useState } from 'react';
import { IoRefresh } from 'react-icons/io5';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = ({ mb }: { mb?: number }) => {
    const { isLoading, totalBalance } = useBalances();

    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    if (isLoading) return <Spinner mt={4} mb={mb} />;

    return (
        <VStack w="full" spacing={2} mt={4} mb={mb}>
            <Heading textAlign="center" size={'2xl'} fontWeight={'500'}>
                ${compactFormatter.format(totalBalance)}
            </Heading>
            <HStack justify="center" px={2} mt={2} position="absolute">
                <Button
                    aria-label="Refresh balances"
                    size="sm"
                    variant="link"
                    onClick={handleRefresh}
                    leftIcon={<Icon as={IoRefresh} />}
                    isLoading={isRefreshing}
                    loadingText="Refreshing"
                >
                    <Text fontSize="xs" opacity={0.7} lineHeight={1}>
                        Refresh Balances
                    </Text>
                </Button>
            </HStack>
        </VStack>
    );
};
