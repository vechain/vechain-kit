import { useMemo } from 'react';
import {
    useAccountBalance,
    useGetB3trBalance,
    useGetVot3Balance,
    useGetVeDelegateBalance,
    useGetTokenUsdPrice,
    useGetCustomTokenBalances,
    useGetErc20Balance,
} from '..';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

type UseBalancesProps = {
    address?: string;
};

export const useBalances = ({ address = '' }: UseBalancesProps) => {
    const { network } = useVeChainKitConfig();
    const config = getConfig(network.type);

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
    const { data: gloDollarBalance, isLoading: gloDollarLoading } =
        useGetErc20Balance(config.gloDollarContractAddress, address);
    const { data: eurUsdPrice, isLoading: eurToUsdLoading } =
        useGetTokenUsdPrice('EUR');
    const { data: gbpUsdPrice, isLoading: gbpToUsdLoading } =
        useGetTokenUsdPrice('GBP');

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
            customTokensLoading ||
            gloDollarLoading ||
            eurToUsdLoading ||
            gbpToUsdLoading;

        // Get contract addresses from config
        const contractAddresses = {
            vet: '0x',
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
            USDGLO: config.gloDollarContractAddress,
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
            {
                address: contractAddresses.USDGLO,
                value: gloDollarBalance?.scaled ?? '0',
                symbol: 'USDGLO',
                priceAddress: contractAddresses.USDGLO,
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
            { address: contractAddresses.USDGLO, price: 1 }, // gloDollar is pegged to 1 USD
        ];

        // Compute total balance in USD
        const totalBalanceUsd = balances.reduce((acc, { priceAddress, value }) => {
            const price =
                prices.find((p) => p.address === priceAddress)?.price || 0;
            return acc + Number(value) * price;
        }, 0);

        // Convert total balance to selected currency
        const totalBalanceGbp = totalBalanceUsd * (1 / (gbpUsdPrice || 1));
        const totalBalanceEur = totalBalanceUsd * (1 / (eurUsdPrice || 1));
        // Create tokens mapping with values in selected currency
        const tokens = balances.reduce(
            (acc, balance) => {
                const usdPrice =
                    prices.find((p) => p.address === balance.priceAddress)?.price || 0;
                const valueInUsd = usdPrice * Number(balance.value);
                
                // Convert USD value to selected currency
                const valueInGbp = valueInUsd * (1 / (gbpUsdPrice || 1));
                const valueInEur = valueInUsd * (1 / (eurUsdPrice || 1));

                acc[balance.symbol] = {
                    ...balance,
                    balance: balance.value,
                    usdPrice,
                    valueInUsd,
                    valueInGbp,
                    valueInEur,
                    gbpUsdPrice: gbpUsdPrice || 1,
                    eurUsdPrice: eurUsdPrice || 1,
                };
                return acc;
            },
            {} as Record<
                string,
                {
                    address: string;
                    balance: string;
                    symbol: string;
                    usdPrice: number;
                    valueInUsd: number;
                    valueInGbp: number;
                    valueInEur: number;
                    gbpUsdPrice: number;
                    eurUsdPrice: number;
                }
            >,
        );

        return {
            isLoading,
            balances,
            prices,
            totalBalanceGbp,
            totalBalanceEur,
            totalBalanceUsd,
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
        eurUsdPrice,
        gbpUsdPrice,
        eurToUsdLoading,
        gbpToUsdLoading,
    ]);
};
