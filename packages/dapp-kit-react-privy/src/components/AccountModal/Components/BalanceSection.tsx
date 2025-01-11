import { Heading, Spinner, VStack, Text } from '@chakra-ui/react';
import { useAccountBalance, useWallet } from '../../../hooks';
import { useGetB3trBalance } from '../../../hooks/api/useGetB3trBalance';
import { useGetVot3Balance } from '../../../hooks/api/useGetVot3Balance';
import { ethers } from 'ethers';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

export const BalanceSection = () => {
    const { smartAccount } = useWallet();
    const { data: vetData, isLoading } = useAccountBalance(
        smartAccount?.address,
    );
    const { data: b3trBalance, isLoading: b3trLoading } = useGetB3trBalance(
        smartAccount?.address,
    );
    const { data: vot3Balance, isLoading: vot3Loading } = useGetVot3Balance(
        smartAccount?.address,
    );

    if (isLoading || b3trLoading || vot3Loading) return <Spinner />;

    // Convert all balances to numbers and sum them up
    const vetAmount = Number(vetData?.balance || 0);
    const vthoAmount = Number(vetData?.energy || 0);
    const b3trAmount = Number(ethers.formatEther(b3trBalance || '0'));
    const vot3Amount = Number(ethers.formatEther(vot3Balance || '0'));

    const totalBalance = vetAmount + b3trAmount + vot3Amount + vthoAmount;

    return (
        <VStack w="full" spacing={2}>
            <Heading textAlign="center" fontWeight={'500'}>
                ${compactFormatter.format(totalBalance)}
            </Heading>
            <Text fontSize="sm" opacity={0.7}>
                Total
            </Text>
            <VStack spacing={1} opacity={0.7}>
                <Text fontSize="sm">
                    {compactFormatter.format(vetAmount)} VET
                </Text>
                <Text fontSize="sm">
                    {compactFormatter.format(vthoAmount)} VTHO
                </Text>
                <Text fontSize="sm">
                    {compactFormatter.format(b3trAmount)} B3TR
                </Text>
                <Text fontSize="sm">
                    {compactFormatter.format(vot3Amount)} VOT3
                </Text>
            </VStack>
        </VStack>
    );
};
