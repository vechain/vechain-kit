'use client';

import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { useWallet, useGetB3trBalance } from '@vechain/vechain-kit/hooks';

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
                    <Text data-testid="smart-account-address">
                        Smart Account: {smartAccount.address}
                    </Text>
                    <Text data-testid="is-sa-deployed">
                        Deployed: {smartAccount.isDeployed.toString()}
                    </Text>
                    {b3trBalanceLoading ? (
                        <Spinner />
                    ) : (
                        <Text data-testid="b3tr-balance">
                            B3TR Balance: {b3trBalance?.formatted}
                        </Text>
                    )}
                </Box>
            )}

            <Box>
                <Heading size={'md'}>
                    <b>Wallet</b>
                </Heading>
                <Text data-testid="connected-wallet-address">
                    Address: {connectedWallet?.address}
                </Text>
            </Box>
        </>
    );
}
