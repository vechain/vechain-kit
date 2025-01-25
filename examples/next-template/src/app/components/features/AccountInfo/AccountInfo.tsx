'use client';

import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { useWallet, useGetB3trBalance } from '@vechain/vechain-kit';

export function AccountInfo() {
    const { smartAccount, connectedWallet } = useWallet();
    const { data: b3trBalance, isLoading: b3trBalanceLoading } =
        useGetB3trBalance(smartAccount.address ?? undefined);

    return (
        <>
            {smartAccount.address && (
                <Box>
                    <Heading size={'md'}>
                        <b>Smart Account</b>
                    </Heading>
                    <Text>Smart Account: {smartAccount.address}</Text>
                    <Text>Deployed: {smartAccount.isDeployed.toString()}</Text>
                    {b3trBalanceLoading ? (
                        <Spinner />
                    ) : (
                        <Text>B3TR Balance: {b3trBalance?.formatted}</Text>
                    )}
                </Box>
            )}

            <Box>
                <Heading size={'md'}>
                    <b>Wallet</b>
                </Heading>
                <Text>Address: {connectedWallet?.address}</Text>
            </Box>
        </>
    );
}
