import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import {
    Stargate__factory,
    StargateNFT__factory,
} from '@vechain/vechain-contract-types';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

export type StargatePosition = {
    tokenId: string;
    levelId: number;
    vetAmountStaked: string;
    vetAmountFormatted: number;
    valueUsd: number;
    valueInCurrency: number;
    isDelegated: boolean;
};

type StargateRawPosition = Omit<
    StargatePosition,
    'valueUsd' | 'valueInCurrency'
>;

export type StargatePositionsResult = {
    positions: StargatePosition[];
    totalVet: number;
    totalValueUsd: number;
    totalValueInCurrency: number;
    isLoading: boolean;
    error: unknown;
};

const VET_ADDRESS = '0x';

export const useStargatePositions = (
    address?: string,
): StargatePositionsResult => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const stargateAddress = config.stargateContractAddress;
    const stargateNftAddress = config.stargateNftContractAddress;

    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();
    const vetPriceUsd = prices[VET_ADDRESS] || 0;

    const enabled =
        !!address && !!stargateAddress && !!stargateNftAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'STARGATE_POSITIONS',
            network.type,
            address?.toLowerCase(),
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async (): Promise<StargateRawPosition[]> => {
            if (!address) return [];

            const nftAbi = StargateNFT__factory.abi;
            const stargateAbi = Stargate__factory.abi;

            const balanceRes = await thor.contracts
                .load(stargateNftAddress, nftAbi)
                .read.balanceOf(address);
            const balance = Number(
                (balanceRes as readonly bigint[])[0] ?? balanceRes,
            );
            if (!balance) return [];

            const indexes = Array.from({ length: balance }, (_, i) => BigInt(i));

            const tokenIdsRes = await executeMultipleClausesCall({
                thor,
                calls: indexes.map((i) => ({
                    abi: nftAbi,
                    functionName: 'tokenOfOwnerByIndex' as const,
                    address: stargateNftAddress as `0x${string}`,
                    args: [address as `0x${string}`, i] as const,
                })),
            });

            const tokenIds = tokenIdsRes.map((r) => r as unknown as bigint);

            if (!tokenIds.length) return [];

            const detailsRes = await executeMultipleClausesCall({
                thor,
                calls: tokenIds.flatMap((tokenId) => [
                    {
                        abi: nftAbi,
                        functionName: 'getToken' as const,
                        address: stargateNftAddress as `0x${string}`,
                        args: [tokenId] as const,
                    },
                    {
                        abi: stargateAbi,
                        functionName: 'getDelegationStatus' as const,
                        address: stargateAddress as `0x${string}`,
                        args: [tokenId] as const,
                    },
                ]),
            });

            const rawPositions: StargateRawPosition[] = [];
            for (let i = 0; i < tokenIds.length; i++) {
                const tokenStruct = detailsRes[i * 2] as unknown as {
                    tokenId: bigint;
                    levelId: number | bigint;
                    vetAmountStaked: bigint;
                };
                const delegationStatus = Number(
                    detailsRes[i * 2 + 1] as unknown as number | bigint,
                );

                const vetAmountStaked = tokenStruct.vetAmountStaked.toString();
                const vetFormatted = Number(
                    formatUnits(tokenStruct.vetAmountStaked, 18),
                );

                rawPositions.push({
                    tokenId: tokenStruct.tokenId.toString(),
                    levelId: Number(tokenStruct.levelId),
                    vetAmountStaked,
                    vetAmountFormatted: vetFormatted,
                    isDelegated: delegationStatus !== 0,
                });
            }

            return rawPositions;
        },
    });

    // USD/currency are derived from live prices so a late-arriving price
    // query repopulates values without re-running the on-chain query.
    const positions = useMemo<StargatePosition[]>(() => {
        const raw = query.data ?? [];
        return raw.map((p) => {
            const valueUsd = p.vetAmountFormatted * vetPriceUsd;
            return {
                ...p,
                valueUsd,
                valueInCurrency: convertToSelectedCurrency(
                    valueUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                ),
            };
        });
    }, [query.data, vetPriceUsd, currentCurrency, exchangeRates]);

    const totalVet = positions.reduce((acc, p) => acc + p.vetAmountFormatted, 0);
    const totalValueUsd = positions.reduce((acc, p) => acc + p.valueUsd, 0);
    const totalValueInCurrency = positions.reduce(
        (acc, p) => acc + p.valueInCurrency,
        0,
    );

    return {
        positions,
        totalVet,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: query.isLoading,
        error: query.error,
    };
};
