import { useMemo } from 'react';
import {
    useAccountBalance,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetErc20Balance,
    useGetCustomTokenBalances,
} from '@/hooks';
import { useAppConfig, useVeChainKitConfig } from '@/providers';

export type WalletTokenBalance = {
    address: string;
    symbol: string;
    balance: string;
};

export const useTokenBalances = (address?: string) => {
    const { network, allowCommunityTokens } = useVeChainKitConfig();
    const config = useAppConfig();

    // Base token balances
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);
    const { data: b3trBalance, isLoading: b3trLoading } =
        useGetB3trBalance(address);
    const { data: vot3Balance, isLoading: vot3Loading } =
        useGetVot3Balance(address);
    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetErc20Balance(config.veDelegateTokenContractAddress, address);
    const { data: vvetBalance, isLoading: vvetLoading } = useGetErc20Balance(
        config.vvetContractAddress,
        address,
        { enabled: !!config.vvetContractAddress },
    );
    const { data: sassBalance, isLoading: sassLoading } = useGetErc20Balance(
        config.sassContractAddress,
        address,
        { enabled: allowCommunityTokens },
    );

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

        // Get contract addresses from config
        const contractAddresses = {
            vet: '0x',
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
            vvet: config.vvetContractAddress,
        };

        // Base tokens
        const baseTokens: WalletTokenBalance[] = [
            {
                address: contractAddresses.vet,
                symbol: 'VET',
                balance: vetData?.balance || '0',
            },
            {
                address: contractAddresses.vtho,
                symbol: 'VTHO',
                balance: vetData?.energy || '0',
            },
            {
                address: contractAddresses.b3tr,
                symbol: 'B3TR',
                balance: b3trBalance?.scaled ?? '0',
            },
            {
                address: contractAddresses.vot3,
                symbol: 'VOT3',
                balance: vot3Balance?.scaled ?? '0',
            },
            {
                address: contractAddresses.veDelegate,
                symbol: 'veDelegate',
                balance: veDelegateBalance?.scaled ?? '0',
            },
        ];

        if (contractAddresses.vvet) {
            baseTokens.push({
                address: contractAddresses.vvet,
                symbol: 'VVET',
                balance: vvetBalance?.scaled ?? '0',
            });
        }

        // Add custom tokens
        const customTokens: WalletTokenBalance[] = customTokenBalances.map(
            (token) => ({
                address: token?.address || '',
                symbol: token?.symbol || '',
                balance: token?.scaled || '0',
            }),
        );

        const communityTokens: WalletTokenBalance[] = allowCommunityTokens
            ? [
                  {
                      address: config.sassContractAddress,
                      symbol: 'SASS',
                      balance: sassBalance?.scaled ?? '0',
                  },
              ]
            : [];

        return [...baseTokens, ...customTokens, ...communityTokens];
    }, [
        address,
        vetData,
        b3trBalance,
        vot3Balance,
        veDelegateBalance,
        vvetBalance,
        customTokenBalances,
        allowCommunityTokens,
        sassBalance,
        config.sassContractAddress,
        config.vvetContractAddress,
        network.type,
    ]);

    const isLoading =
        vetLoading ||
        b3trLoading ||
        vot3Loading ||
        veDelegateLoading ||
        (!!config.vvetContractAddress && vvetLoading) ||
        (allowCommunityTokens && sassLoading) ||
        customTokensLoading;

    return {
        balances,
        isLoading,
    };
};
