import { useMemo } from 'react';
import {
    useAccountBalance,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetVeDelegateBalance,
    useGetTokenUsdPrice,
    useGetCustomTokenBalances,
} from '..';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

type UseBalancesProps = {
    address?: string;
};

export const useBalances = ({ address = '' }: UseBalancesProps) => {
    const { network } = useVeChainKitConfig();

    // Base token balances
    const { data: vetData, isLoading: vetLoading } = useAccountBalance(address);
    const { data: vetUsdPrice, isLoading: vetUsdPriceLoading } =
        useGetTokenUsdPrice('VET');
    const { data: vthoUsdPrice, isLoading: vthoUsdPriceLoading } =
        useGetTokenUsdPrice('VTHO');
    const { data: b3trBalance, isLoading: b3trLoading } =
        useGetB3trBalance(address);
    const { data: b3trUsdPrice, isLoading: b3trUsdPriceLoading } =
        useGetTokenUsdPrice('B3TR');
    const { data: vot3Balance, isLoading: vot3Loading } =
        useGetVot3Balance(address);
    const { data: veDelegateBalance, isLoading: veDelegateLoading } =
        useGetVeDelegateBalance(address);

    // Custom token balances
    const customTokenBalancesQueries = useGetCustomTokenBalances(address);
    const customTokenBalances = customTokenBalancesQueries
        .map((query) => query.data)
        .filter(Boolean);
    const customTokensLoading = customTokenBalancesQueries.some(
        (query) => query.isLoading,
    );

    return useMemo(() => {
        const isLoading =
            vetLoading ||
            b3trLoading ||
            vot3Loading ||
            vetUsdPriceLoading ||
            b3trUsdPriceLoading ||
            veDelegateLoading ||
            vthoUsdPriceLoading ||
            customTokensLoading;

        // Get contract addresses from config
        const contractAddresses = {
            vet: '0x',
            vtho: getConfig(network.type).vthoContractAddress,
            b3tr: getConfig(network.type).b3trContractAddress,
            vot3: getConfig(network.type).vot3ContractAddress,
            veDelegate: getConfig(network.type).veDelegate,
        };

        // Base balances using contract addresses
        const balances = [
            {
                address: contractAddresses.vet,
                value: vetData?.balance || '0',
                symbol: 'VET',
                priceAddress: contractAddresses.vet,
            },
            {
                address: contractAddresses.vtho,
                value: vetData?.energy || '0',
                symbol: 'VTHO',
                priceAddress: contractAddresses.vtho,
            },
            {
                address: contractAddresses.b3tr,
                value: b3trBalance?.scaled ?? '0',
                symbol: 'B3TR',
                priceAddress: contractAddresses.b3tr,
            },
            {
                address: contractAddresses.vot3,
                value: vot3Balance?.scaled ?? '0',
                symbol: 'VOT3',
                priceAddress: contractAddresses.b3tr, // using b3tr price for vot3
            },
            {
                address: contractAddresses.veDelegate,
                value: veDelegateBalance?.scaled ?? '0',
                symbol: 'veDelegate',
                priceAddress: contractAddresses.b3tr, // using b3tr price for veDelegate
            },
        ];

        // Add custom token balances
        customTokenBalances.forEach((token) => {
            if (token) {
                balances.push({
                    address: token.address,
                    value: token.scaled,
                    symbol: token.symbol,
                    priceAddress: token.address,
                });
            }
        });

        // Prices mapped by address
        const prices = [
            { address: contractAddresses.vet, price: vetUsdPrice || 0 },
            { address: contractAddresses.vtho, price: vthoUsdPrice || 0 },
            { address: contractAddresses.b3tr, price: b3trUsdPrice || 0 },
        ];

        // Compute total balance
        const totalBalance = balances.reduce((acc, { address, value }) => {
            const price = prices.find((p) => p.address === address)?.price || 0;
            return acc + Number(value) * price;
        }, 0);

        // Create tokens mapping
        const tokens = balances.reduce(
            (acc, balance) => {
                acc[balance.symbol] = {
                    ...balance,
                    value: balance.value,
                    price:
                        prices.find((p) => p.address === balance.priceAddress)
                            ?.price || 0,
                    usdValue:
                        (prices.find((p) => p.address === balance.priceAddress)
                            ?.price || 0) * Number(balance.value),
                };
                return acc;
            },
            {} as Record<
                string,
                {
                    address: string;
                    value: string;
                    symbol: string;
                    price: number;
                    usdValue: number;
                }
            >,
        );

        return {
            isLoading,
            balances,
            prices,
            totalBalance,
            tokens,
        };
    }, [
        vetData,
        vetUsdPrice,
        vthoUsdPrice,
        b3trBalance,
        b3trUsdPrice,
        vot3Balance,
        veDelegateBalance,
        customTokenBalances,
        network.type,
        vetLoading,
        b3trLoading,
        vot3Loading,
        vetUsdPriceLoading,
        b3trUsdPriceLoading,
        veDelegateLoading,
        vthoUsdPriceLoading,
        customTokensLoading,
    ]);
};
