import { useMemo } from 'react';
import {
    useAccountBalance,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetErc20Balance,
    useGetCustomTokenBalances,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useSupportedTokens } from '../tokenRegistry';

export type WalletTokenBalance = {
    address: string;
    symbol: string;
    balance: string;
    name?: string;
    decimals?: number;
    iconUrl?: string;
    isCore?: boolean;
};

export const useTokenBalances = (address?: string) => {
    const { network } = useVeChainKitConfig();
    const config = getConfig(network.type);
    const { tokens: registryTokens, isLoading: registryLoading } = useSupportedTokens();

    // Base token balances
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);
    const { data: b3trBalance, isLoading: b3trLoading } =
        useGetB3trBalance(address);
    const { data: vot3Balance, isLoading: vot3Loading } =
        useGetVot3Balance(address);
    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetErc20Balance(config.veDelegateTokenContractAddress, address);
    const { data: gloDollarBalance, isLoading: gloDollarLoading } =
        useGetErc20Balance(config.gloDollarContractAddress, address);

    // Custom token balances
    const customTokenBalancesQueries = useGetCustomTokenBalances(address);
    const customTokenBalances = customTokenBalancesQueries
        .map((query) => query.data)
        .filter(Boolean);
    const customTokensLoading = customTokenBalancesQueries.some(
        (query) => query.isLoading,
    );

    // Get all balances
    const balances = useMemo(() => {
        if (!address) return [];

        // Create a map of fetched balances for quick lookup
        const fetchedBalances: Record<string, string> = {
            'VET': vetData?.balance || '0',
            'VTHO': vetData?.energy || '0',
            'B3TR': b3trBalance?.scaled ?? '0',
            'VOT3': vot3Balance?.scaled ?? '0',
            'veDelegate': veDelegateBalance?.scaled ?? '0',
            'USDGLO': gloDollarBalance?.scaled ?? '0',
        };

        // Use all tokens from registry
        const baseTokens: WalletTokenBalance[] = registryTokens.map(token => ({
            address: token.address,
            symbol: token.symbol,
            // Use fetched balance if available, otherwise 0
            balance: fetchedBalances[token.symbol] || '0',
            name: token.name,
            decimals: token.decimals,
            iconUrl: token.iconUrl,
            isCore: token.isCore,
        }));

        // Add custom tokens
        const customTokens: WalletTokenBalance[] = customTokenBalances.map(
            (token) => ({
                address: token?.address || '',
                symbol: token?.symbol || '',
                balance: token?.scaled || '0',
            }),
        );

        return [...baseTokens, ...customTokens];
    }, [
        address,
        vetData,
        b3trBalance,
        vot3Balance,
        veDelegateBalance,
        gloDollarBalance,
        customTokenBalances,
        registryTokens,
        network.type,
    ]);

    const isLoading =
        vetLoading ||
        b3trLoading ||
        vot3Loading ||
        veDelegateLoading ||
        gloDollarLoading ||
        registryLoading ||
        customTokensLoading;

    return {
        balances,
        isLoading,
    };
};
