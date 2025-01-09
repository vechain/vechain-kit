import { Heading, Spinner } from '@chakra-ui/react';
import { useAccountBalance, useWallet } from '../../../hooks';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = () => {
    const { smartAccount } = useWallet();
    const { data, isLoading } = useAccountBalance(smartAccount?.address);

    if (isLoading) return <Spinner />;

    return (
        <Heading w="full" textAlign="center" fontWeight={'600'}>
            {compactFormatter.format(Number(data?.balance))} VET
        </Heading>
    );
};
