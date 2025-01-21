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
import { useTranslation } from 'react-i18next';
import { VscRefresh } from 'react-icons/vsc';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = ({ mb, mt }: { mb?: number; mt?: number }) => {
    const { t } = useTranslation();
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
        <VStack w="full" spacing={2} mt={mt} mb={mb} onClick={handleRefresh}>
            <Heading textAlign="center" size={'2xl'} fontWeight={'500'}>
                ${compactFormatter.format(totalBalance)}
            </Heading>
            <HStack justify="center" px={2} mt={2}>
                <Button
                    aria-label="Refresh balances"
                    position="absolute"
                    size="sm"
                    variant="link"
                    onClick={handleRefresh}
                    leftIcon={<Icon as={VscRefresh} boxSize={4} />}
                    isLoading={isRefreshing}
                    alignItems="center"
                    loadingText={t('Refreshing')}
                >
                    <Text fontSize="xs" opacity={0.7} lineHeight={1}>
                        {t('Refresh balances')}
                    </Text>
                </Button>
            </HStack>
        </VStack>
    );
};
