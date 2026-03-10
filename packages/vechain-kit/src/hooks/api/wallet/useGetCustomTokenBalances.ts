import { useQueries } from '@tanstack/react-query';
import { useCustomTokens } from '@/hooks';
import {
    type CustomTokenInfo,
    getErc20Balance,
} from '@vechain/contract-getters';
import { TokenBalance } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { formatTokenBalance } from '@/utils';
import { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';

export type TokenWithBalance = CustomTokenInfo & TokenBalance;

export const getCustomTokenBalanceQueryKey = (
    tokenAddress?: string,
    address?: string,
) => VECHAIN_KIT_QUERY_KEYS.balance.customToken(tokenAddress, address);

export const useGetCustomTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: customTokens.map((token) => ({
            queryKey: getCustomTokenBalanceQueryKey(token.address, address),
            queryFn: async () => {
                if (!token.address)
                    throw new Error('Token address is required');
                if (!address) throw new Error('Address is required');
                if (!network.nodeUrl)
                    throw new Error('Network node URL is required');
                const tokenBalanceOriginal = await getErc20Balance(
                    token.address,
                    address,
                    {
                        networkUrl: network.nodeUrl,
                    },
                );
                if (!tokenBalanceOriginal)
                    throw new Error('Failed to get token balance');
                const formattedTokenBalance = formatTokenBalance(
                    tokenBalanceOriginal[0],
                );
                return {
                    ...token,
                    ...formattedTokenBalance,
                };
            },
        })),
    });
};
