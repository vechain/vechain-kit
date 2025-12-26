import { useQueries } from '@tanstack/react-query';
import {
    useAccountBalance,
    useTokenRegistry,
    getErc20BalanceQueryKey,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { getErc20Balance } from '@vechain/contract-getters';
import { formatTokenBalance } from '@/utils';
import { TokenRegistryInfo } from './useTokenRegistry';
import { TokenBalance } from '@/types';
import { useMemo } from 'react';

export type WalletTokenBalance = TokenRegistryInfo & {
    balance: TokenBalance;
};

export const useTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();

    // Get VET balance (includes VTHO as energy)
    const { isLoading: vetLoading } = useAccountBalance(address);

    // Get all tokens from registry
    const { data: registryTokens, isLoading: registryLoading } =
        useTokenRegistry();

    // Fetch balances for all registry tokens
    const tokenBalanceQueries = useQueries({
        queries: (registryTokens || []).map((token) => ({
            queryKey: getErc20BalanceQueryKey(token.address, address),
            queryFn: async (): Promise<WalletTokenBalance> => {
                if (!address) throw new Error('Address is required');
                const res = await getErc20Balance(token.address, address, {
                    networkUrl: network.nodeUrl,
                });

                if (!res) throw new Error('Failed to get token balance');

                const original = res[0];
                return {
                    ...token,
                    balance: formatTokenBalance(original),
                };
            },
            enabled: !!address && !!network.type,
        })),
    });

    const balances = useMemo(() => {
        // Return available balances while filtering out undefined/loading values
        return tokenBalanceQueries
            .map((query) => query.data)
            .filter((data): data is WalletTokenBalance => Boolean(data));
    }, [tokenBalanceQueries]);

    const isLoading =
        vetLoading ||
        registryLoading ||
        tokenBalanceQueries.some((query) => query.isLoading);

    return {
        balances,
        isLoading,
    };
};
