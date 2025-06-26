'use client';

import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import { useWallet, useTokenBalances } from '@vechain/vechain-kit';

export function AccountInfo() {
    const { smartAccount, connectedWallet } = useWallet();
    const { data: tokenBalances, loading: isLoadingTokenBalances } =
        useTokenBalances(smartAccount.address ?? undefined);
    const b3trBalance = tokenBalances[2];

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
                    {isLoadingTokenBalances ? (
                        <Spinner />
                    ) : (
                        <Text data-testid="b3tr-balance">
                            B3TR Balance: {b3trBalance.balance}
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
