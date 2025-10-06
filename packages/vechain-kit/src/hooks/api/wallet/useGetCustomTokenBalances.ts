import { useQueries } from '@tanstack/react-query';
import { useCustomTokens } from '@/hooks';
import { type CustomTokenInfo, getErc20Balance } from '@vechain/contract-getters';
import { TokenBalance } from '@/types';
import { useVeChainKitConfig } from '@/providers';

export type TokenWithBalance = CustomTokenInfo & TokenBalance;


export const getCustomTokenBalanceQueryKey = (
    tokenAddress?: string,
    address?: string,
) => ['VECHAIN_KIT_BALANCE', address, 'CUSTOM_TOKEN', tokenAddress];

export const useGetCustomTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: customTokens.map((token) => ({
            queryKey: getCustomTokenBalanceQueryKey(token.address, address),
            queryFn: async () => {
                if (!token.address) throw new Error('Token address is required');
                if (!address) throw new Error('Address is required');
                if (!network.nodeUrl) throw new Error('Network node URL is required');
                return await getErc20Balance(token.address, address, {
                    networkUrl: network.nodeUrl,
                });
            },
        })),
    });
};
