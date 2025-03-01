import { formatEther } from 'viem';
import { useAccountBalance, useGetCustomTokenBalances } from '..';
import {
    useGetB3trBalance,
    useGetVot3Balance,
    useGetVeDelegateBalance,
    useGetTokenUsdPrice,
} from '..';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';

type UseBalancesProps = {
    address?: string;
};

export const useBalances = ({ address = '' }: UseBalancesProps) => {
    const { network } = useVeChainKitConfig();

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

    // Get custom token balances
    const customTokenBalancesQueries = useGetCustomTokenBalances(address);

    // Extract balances from queries
    const customTokenBalances = customTokenBalancesQueries
        .map((query) => query.data)
        .filter(Boolean); // Remove undefined results

    // Check if any custom token queries are still loading
    const customTokensLoading = customTokenBalancesQueries.some(
        (query) => query.isLoading,
    );

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
        vet: '0x', // VET has no contract address since it's the native token
        vtho: getConfig(network.type).vthoContractAddress,
        b3tr: getConfig(network.type).b3trContractAddress,
        vot3: getConfig(network.type).vot3ContractAddress,
        veDelegate: getConfig(network.type).veDelegate,
    };

    // Base balances using contract addresses
    const balances = [
        {
            address: contractAddresses.vet,
            value: Number(vetData?.balance || 0),
            symbol: 'VET',
        },
        {
            address: contractAddresses.vtho,
            value: Number(vetData?.energy || 0),
            symbol: 'VTHO',
        },
        {
            address: contractAddresses.b3tr,
            value: Number(formatEther(BigInt(b3trBalance?.original || '0'))),
            symbol: 'B3TR',
        },
        {
            address: contractAddresses.vot3,
            value: Number(formatEther(BigInt(vot3Balance?.original || '0'))),
            symbol: 'VOT3',
        },
        {
            address: contractAddresses.veDelegate,
            value: Number(formatEther(BigInt(veDelegateBalance || '0'))),
            symbol: 'veDelegate',
        },
    ];

    // Add custom token balances using contract addresses
    customTokenBalances.forEach((token) => {
        if (token) {
            balances.push({
                address: token.address,
                value: Number(formatEther(BigInt(token.original))),
                symbol: token.symbol,
            });
        }
    });

    // Prices mapped by address
    const prices = [
        { address: contractAddresses.vet, price: vetUsdPrice || 0 },
        { address: contractAddresses.vtho, price: vthoUsdPrice || 0 },
        { address: contractAddresses.b3tr, price: b3trUsdPrice || 0 },
    ];

    // Dynamically compute total balance using contract addresses
    const totalBalance = balances.reduce((acc, { address, value }) => {
        const price = prices.find((p) => p.address === address)?.price || 0;
        return acc + value * price;
    }, 0);

    // Create a tokens mapping for easier access
    const tokens = balances.reduce(
        (acc, balance) => {
            acc[balance.symbol] = {
                ...balance,
                price:
                    prices.find((p) => p.address === balance.address)?.price ||
                    0,
                usdValue:
                    (prices.find((p) => p.address === balance.address)?.price ||
                        0) * balance.value,
            };
            return acc;
        },
        {} as Record<
            string,
            {
                address: string;
                value: number;
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
        tokens, // New tokens mapping
    };
};
