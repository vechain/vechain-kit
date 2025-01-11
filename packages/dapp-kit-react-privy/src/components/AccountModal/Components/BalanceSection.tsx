import { Heading, Spinner, VStack, Text } from '@chakra-ui/react';
import { useBalances } from '../../../hooks';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = () => {
    const { isLoading, totalBalance } = useBalances();

    if (isLoading) return <Spinner mt={4} />;

    return (
        <VStack w="full" spacing={2} mt={4}>
            <Heading textAlign="center" size={'2xl'} fontWeight={'500'}>
                ${compactFormatter.format(totalBalance)}
            </Heading>
            <Text fontSize="xs" opacity={0.7}>
                Total Balance
            </Text>
        </VStack>
    );
};
