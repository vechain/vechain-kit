import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import {
    UniswapV2Factory__factory,
    UniswapV2Pair__factory,
} from '@vechain/vechain-contract-types';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

export type LpPositionToken = {
    address: string;
    symbol: string;
    amount: number;
};

export type LpPosition = {
    pairAddress: string;
    lpBalance: number;
    sharePct: number;
    token0: LpPositionToken;
    token1: LpPositionToken;
    valueUsd: number;
    valueInCurrency: number;
};

const ERC20_MINI_ABI = [
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

const usePairList = (factoryAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: ['VECHAIN_KIT', 'BETTERSWAP_PAIRS', network.type, factoryAddress],
        enabled: !!factoryAddress && !!thor,
        // Pair list rarely changes; cache for the session.
        staleTime: 24 * 60 * 60 * 1000,
        queryFn: async (): Promise<string[]> => {
            if (!factoryAddress) return [];
            const factoryAbi = UniswapV2Factory__factory.abi;
            const lenRes = await thor.contracts
                .load(factoryAddress, factoryAbi)
                .read.allPairsLength();
            const length = Number(
                (lenRes as readonly bigint[])[0] ?? lenRes,
            );
            if (!length) return [];

            const indexes = Array.from({ length }, (_, i) => BigInt(i));
            const res = await executeMultipleClausesCall({
                thor,
                calls: indexes.map((i) => ({
                    abi: factoryAbi,
                    functionName: 'allPairs' as const,
                    address: factoryAddress as `0x${string}`,
                    args: [i] as const,
                })),
            });

            return res.map((r) => r as unknown as string);
        },
    });
};

export const useBetterSwapLpPositions = (address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const factoryAddress = config.betterSwapFactoryAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const { data: pairs = [], isLoading: pairsLoading } =
        usePairList(factoryAddress);

    const enabled = !!address && !!factoryAddress && !!thor && pairs.length > 0;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'BETTERSWAP_LP_POSITIONS',
            network.type,
            address?.toLowerCase(),
            pairs.length,
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async (): Promise<LpPosition[]> => {
            if (!address || !pairs.length) return [];

            const pairAbi = UniswapV2Pair__factory.abi;

            const balRes = await executeMultipleClausesCall({
                thor,
                calls: pairs.map((p) => ({
                    abi: pairAbi,
                    functionName: 'balanceOf' as const,
                    address: p as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                })),
            });

            const ownedIndexes: number[] = [];
            balRes.forEach((r, i) => {
                const bal = r as unknown as bigint;
                if (bal && bal > 0n) ownedIndexes.push(i);
            });

            if (!ownedIndexes.length) return [];

            const detailRes = await executeMultipleClausesCall({
                thor,
                calls: ownedIndexes.flatMap((i) => {
                    const pair = pairs[i] as `0x${string}`;
                    return [
                        {
                            abi: pairAbi,
                            functionName: 'totalSupply' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'getReserves' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'token0' as const,
                            address: pair,
                            args: [] as const,
                        },
                        {
                            abi: pairAbi,
                            functionName: 'token1' as const,
                            address: pair,
                            args: [] as const,
                        },
                    ];
                }),
            });

            const tokenAddresses = new Set<string>();
            for (let i = 0; i < ownedIndexes.length; i++) {
                const t0 = detailRes[i * 4 + 2] as unknown as string;
                const t1 = detailRes[i * 4 + 3] as unknown as string;
                tokenAddresses.add(t0.toLowerCase());
                tokenAddresses.add(t1.toLowerCase());
            }

            const tokenAddrList = Array.from(tokenAddresses);
            const symbolByAddr = new Map<string, string>();
            if (tokenAddrList.length) {
                const symbolsRes = await executeMultipleClausesCall({
                    thor,
                    calls: tokenAddrList.map((a) => ({
                        abi: ERC20_MINI_ABI,
                        functionName: 'symbol' as const,
                        address: a as `0x${string}`,
                        args: [] as const,
                    })),
                });
                symbolsRes.forEach((r, i) => {
                    const sym = r as unknown as string;
                    symbolByAddr.set(tokenAddrList[i], sym ?? '');
                });
            }

            const positions: LpPosition[] = [];
            for (let i = 0; i < ownedIndexes.length; i++) {
                const pairIndex = ownedIndexes[i];
                const pairAddress = pairs[pairIndex];
                const lpBal = balRes[pairIndex] as unknown as bigint;
                const totalSupply = detailRes[i * 4] as unknown as bigint;
                const reservesTuple = detailRes[
                    i * 4 + 1
                ] as unknown as readonly [bigint, bigint, number];
                const reserve0 = reservesTuple[0];
                const reserve1 = reservesTuple[1];
                const token0Addr = detailRes[i * 4 + 2] as unknown as string;
                const token1Addr = detailRes[i * 4 + 3] as unknown as string;

                const lpBalanceFormatted = Number(formatUnits(lpBal, 18));
                const share =
                    totalSupply > 0n
                        ? Number((lpBal * 1_000_000n) / totalSupply) / 1_000_000
                        : 0;

                const amount0 = Number(formatUnits(reserve0, 18)) * share;
                const amount1 = Number(formatUnits(reserve1, 18)) * share;

                const price0 = prices[token0Addr.toLowerCase()] || 0;
                const price1 = prices[token1Addr.toLowerCase()] || 0;
                const valueUsd = amount0 * price0 + amount1 * price1;
                const valueInCurrency = convertToSelectedCurrency(
                    valueUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                );

                positions.push({
                    pairAddress,
                    lpBalance: lpBalanceFormatted,
                    sharePct: share * 100,
                    token0: {
                        address: token0Addr,
                        symbol:
                            symbolByAddr.get(token0Addr.toLowerCase()) ?? '',
                        amount: amount0,
                    },
                    token1: {
                        address: token1Addr,
                        symbol:
                            symbolByAddr.get(token1Addr.toLowerCase()) ?? '',
                        amount: amount1,
                    },
                    valueUsd,
                    valueInCurrency,
                });
            }

            return positions;
        },
    });

    const positions = query.data ?? [];
    const totalValueUsd = positions.reduce((acc, p) => acc + p.valueUsd, 0);
    const totalValueInCurrency = positions.reduce(
        (acc, p) => acc + p.valueInCurrency,
        0,
    );

    return {
        positions,
        totalValueUsd,
        totalValueInCurrency,
        isLoading: pairsLoading || query.isLoading,
        error: query.error,
    };
};
