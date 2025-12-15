import { useMemo } from 'react';
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

export type WalletTokenBalance = TokenRegistryInfo & {
    balance: string;
};

export const useTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();

    // Get VET balance (includes VTHO as energy)
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);

    // Get all tokens from registry
    const { data: registryTokens, isLoading: registryLoading } =
        useTokenRegistry();

    // Fetch balances for all registry tokens
    const tokenBalanceQueries = useQueries({
        queries: (registryTokens || []).map((token) => ({
            queryKey: getErc20BalanceQueryKey(token.address, address),
            queryFn: async () => {
                if (!address) throw new Error('Address is required');
                const res = await getErc20Balance(token.address, address, {
                    networkUrl: network.nodeUrl,
                });

                if (!res) throw new Error('Failed to get token balance');

                const original = res[0];
                return {
                    ...formatTokenBalance(original),
                    tokenInfo: token,
                };
            },
            enabled: !!address && !!network.type,
        })),
    });

    // Get all balances
    const balances = useMemo(() => {
        if (!address) return [];

        const allBalances: WalletTokenBalance[] = [];

        // Add VET balance
        allBalances.push({
            address: '0x',
            symbol: 'VET',
            name: 'VeChain',
            balance: vetData?.balance || '0',
            decimals: 18,
        });

        // Add all other token balances from registry
        tokenBalanceQueries.forEach((query) => {
            if (query.data && query.data.tokenInfo) {
                const { tokenInfo, scaled } = query.data;
                allBalances.push({
                    address: tokenInfo.address,
                    symbol: tokenInfo.symbol,
                    name: tokenInfo.name,
                    balance: scaled || '0',
                    decimals: tokenInfo.decimals,
                });
            }
        });

        return allBalances;
    }, [address, vetData, registryTokens, tokenBalanceQueries]);

    const isLoading =
        vetLoading ||
        registryLoading ||
        tokenBalanceQueries.some((query) => query.isLoading);

    return {
        balances,
        isLoading,
    };
};
