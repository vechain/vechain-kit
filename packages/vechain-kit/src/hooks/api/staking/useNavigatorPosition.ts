import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { NavigatorRegistryAbi } from './abis';

export type NavigatorPosition = {
    isNavigator: boolean;
    isDelegated: boolean;
    stakedB3TR: number;
    stakedB3TRRaw: string;
    delegatedAmount: number;
    delegatedAmountRaw: string;
    navigatorAddress?: string;
    totalB3TR: number;
    totalValueUsd: number;
    totalValueInCurrency: number;
    isLoading: boolean;
    error: unknown;
};

export const useNavigatorPosition = (address?: string): NavigatorPosition => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const registryAddress = config.navigatorRegistryContractAddress;
    const b3trAddress = config.b3trContractAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();
    const b3trPriceUsd = prices[b3trAddress] || 0;

    const enabled = !!address && !!registryAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'NAVIGATOR_POSITION',
            network.type,
            address?.toLowerCase(),
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async () => {
            if (!address) {
                return {
                    isNavigator: false,
                    isDelegated: false,
                    stakedB3TR: '0',
                    delegatedAmount: '0',
                    navigatorAddress: undefined as string | undefined,
                };
            }

            const res = await executeMultipleClausesCall({
                thor,
                calls: [
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'isNavigator' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getStake' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'isDelegated' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getDelegatedAmount' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                    {
                        abi: NavigatorRegistryAbi,
                        functionName: 'getNavigator' as const,
                        address: registryAddress as `0x${string}`,
                        args: [address as `0x${string}`] as const,
                    },
                ],
            });

            const [isNavRes, stakeRes, isDelegRes, delegAmtRes, navAddrRes] =
                res as unknown as [boolean, bigint, boolean, bigint, string];

            return {
                isNavigator: Boolean(isNavRes),
                isDelegated: Boolean(isDelegRes),
                stakedB3TR: stakeRes.toString(),
                delegatedAmount: delegAmtRes.toString(),
                navigatorAddress: navAddrRes,
            };
        },
    });

    const data = query.data;
    const stakedB3TR = data ? Number(formatUnits(data.stakedB3TR, 18)) : 0;
    const delegatedAmount = data
        ? Number(formatUnits(data.delegatedAmount, 18))
        : 0;
    const totalB3TR = stakedB3TR + delegatedAmount;
    const totalValueUsd = totalB3TR * b3trPriceUsd;
    const totalValueInCurrency = convertToSelectedCurrency(
        totalValueUsd,
        currentCurrency as SupportedCurrency,
        exchangeRates,
    );

    const ZERO_ADDR = '0x0000000000000000000000000000000000000000';
    const navAddr = data?.navigatorAddress;
    const navigatorAddress =
        navAddr && navAddr !== ZERO_ADDR ? navAddr : undefined;

    return {
        isNavigator: Boolean(data?.isNavigator),
        isDelegated: Boolean(data?.isDelegated),
        stakedB3TR,
        stakedB3TRRaw: data?.stakedB3TR ?? '0',
        delegatedAmount,
        delegatedAmountRaw: data?.delegatedAmount ?? '0',
        navigatorAddress,
        totalB3TR,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: query.isLoading,
        error: query.error,
    };
};
