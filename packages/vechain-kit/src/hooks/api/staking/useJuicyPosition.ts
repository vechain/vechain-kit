import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatUnits } from 'ethers';
import { useAppConfig, useVeChainKitConfig } from '@/providers';
import { executeMultipleClausesCall } from '@/utils';
import { useTokenPrices } from '../wallet/useTokenPrices';
import { useCurrency } from '../../utils/useCurrency';
import { getTokenInfo } from '../wallet/useGetCustomTokenInfo';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { JuicyPoolAbi } from './abis';

const ERC20_BALANCE_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export type JuicyAssetPosition = {
    asset: string;
    symbol: string;
    decimals: number;
    amount: number;
    valueUsd: number;
    valueInCurrency: number;
};

export type JuicyPositionResult = {
    supplied: JuicyAssetPosition[];
    borrowed: JuicyAssetPosition[];
    totalSuppliedUsd: number;
    totalSuppliedInCurrency: number;
    totalBorrowedUsd: number;
    totalBorrowedInCurrency: number;
    healthFactor: number | null; // null when no debt
    netValueUsd: number;
    netValueInCurrency: number;
    hasPosition: boolean;
    isLoading: boolean;
    error: unknown;
};

const MAX_UINT256 = (1n << 256n) - 1n;

export const useJuicyPosition = (address?: string): JuicyPositionResult => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = useAppConfig();
    const poolAddress = config.juicyPoolAddress;
    const { prices, exchangeRates } = useTokenPrices();
    const { currentCurrency } = useCurrency();

    const enabled = !!address && !!poolAddress && !!thor;

    const query = useQuery({
        queryKey: [
            'VECHAIN_KIT',
            'JUICY_POSITION',
            network.type,
            address?.toLowerCase(),
            poolAddress,
        ],
        enabled,
        staleTime: 60_000,
        queryFn: async () => {
            if (!address || !poolAddress) {
                return {
                    supplied: [] as JuicyAssetPosition[],
                    borrowed: [] as JuicyAssetPosition[],
                    healthFactor: null as number | null,
                };
            }

            const pool = thor.contracts.load(poolAddress, JuicyPoolAbi);

            const reservesRaw = await pool.read.getReservesList();
            const reserves = (
                reservesRaw[0] as readonly string[] | undefined
            ) ?? (reservesRaw as unknown as readonly string[]);
            const reserveList = Array.from(reserves);

            if (!reserveList.length) {
                return {
                    supplied: [] as JuicyAssetPosition[],
                    borrowed: [] as JuicyAssetPosition[],
                    healthFactor: null as number | null,
                };
            }

            const reserveData = await executeMultipleClausesCall({
                thor,
                calls: reserveList.map((asset) => ({
                    abi: JuicyPoolAbi,
                    functionName: 'getReserveData' as const,
                    address: poolAddress as `0x${string}`,
                    args: [asset as `0x${string}`] as const,
                })),
            });

            type ReserveTokens = {
                asset: string;
                aTokenAddress: string;
                stableDebtTokenAddress: string;
                variableDebtTokenAddress: string;
            };
            const tokens: ReserveTokens[] = reserveList.map((asset, i) => {
                const rd = reserveData[i] as unknown as {
                    aTokenAddress: string;
                    stableDebtTokenAddress: string;
                    variableDebtTokenAddress: string;
                };
                return {
                    asset,
                    aTokenAddress: rd.aTokenAddress,
                    stableDebtTokenAddress: rd.stableDebtTokenAddress,
                    variableDebtTokenAddress: rd.variableDebtTokenAddress,
                };
            });

            // One batched call: balanceOf for aToken + both debt tokens per
            // reserve, plus getUserAccountData on the pool.
            const balanceCalls = tokens.flatMap((t) => [
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.aTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.variableDebtTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
                {
                    abi: ERC20_BALANCE_ABI,
                    functionName: 'balanceOf' as const,
                    address: t.stableDebtTokenAddress as `0x${string}`,
                    args: [address as `0x${string}`] as const,
                },
            ]);

            const balanceResults = await executeMultipleClausesCall({
                thor,
                calls: balanceCalls,
            });

            const userAccountData = await pool.read.getUserAccountData(address);
            const hfRaw = (
                userAccountData as unknown as readonly bigint[]
            )[5];
            const totalDebtBaseRaw = (
                userAccountData as unknown as readonly bigint[]
            )[1];

            // Reserves with non-zero supply/debt we'll need symbols for.
            const interestingAssets: string[] = [];
            const supplyRaw: bigint[] = new Array(tokens.length).fill(0n);
            const variableDebtRaw: bigint[] = new Array(tokens.length).fill(0n);
            const stableDebtRaw: bigint[] = new Array(tokens.length).fill(0n);

            for (let i = 0; i < tokens.length; i++) {
                const aBal = balanceResults[i * 3] as unknown as bigint;
                const vBal = balanceResults[i * 3 + 1] as unknown as bigint;
                const sBal = balanceResults[i * 3 + 2] as unknown as bigint;
                supplyRaw[i] = aBal;
                variableDebtRaw[i] = vBal;
                stableDebtRaw[i] = sBal;
                if (aBal > 0n || vBal > 0n || sBal > 0n) {
                    interestingAssets.push(tokens[i].asset.toLowerCase());
                }
            }

            // Resolve token symbol+decimals for any interesting asset that
            // isn't already priced (or where we don't know decimals).
            const tokenMeta = new Map<
                string,
                { symbol: string; decimals: number }
            >();
            await Promise.all(
                interestingAssets.map(async (addr) => {
                    try {
                        const info = (await getTokenInfo(
                            addr,
                            network.nodeUrl,
                        )) as { symbol?: string; decimals?: number };
                        tokenMeta.set(addr, {
                            symbol: info.symbol ?? addr.slice(0, 6),
                            decimals:
                                typeof info.decimals === 'number'
                                    ? info.decimals
                                    : 18,
                        });
                    } catch {
                        tokenMeta.set(addr, {
                            symbol: addr.slice(0, 6),
                            decimals: 18,
                        });
                    }
                }),
            );

            const supplied: JuicyAssetPosition[] = [];
            const borrowed: JuicyAssetPosition[] = [];

            for (let i = 0; i < tokens.length; i++) {
                const asset = tokens[i].asset;
                const lower = asset.toLowerCase();
                const meta = tokenMeta.get(lower) ?? {
                    symbol: asset.slice(0, 6),
                    decimals: 18,
                };
                const priceUsd = prices[lower] ?? prices[asset] ?? 0;

                const aBal = supplyRaw[i];
                if (aBal > 0n) {
                    const amount = Number(formatUnits(aBal, meta.decimals));
                    const valueUsd = amount * priceUsd;
                    supplied.push({
                        asset,
                        symbol: meta.symbol,
                        decimals: meta.decimals,
                        amount,
                        valueUsd,
                        valueInCurrency: convertToSelectedCurrency(
                            valueUsd,
                            currentCurrency as SupportedCurrency,
                            exchangeRates,
                        ),
                    });
                }

                const debtRaw = variableDebtRaw[i] + stableDebtRaw[i];
                if (debtRaw > 0n) {
                    const amount = Number(
                        formatUnits(debtRaw, meta.decimals),
                    );
                    const valueUsd = amount * priceUsd;
                    borrowed.push({
                        asset,
                        symbol: meta.symbol,
                        decimals: meta.decimals,
                        amount,
                        valueUsd,
                        valueInCurrency: convertToSelectedCurrency(
                            valueUsd,
                            currentCurrency as SupportedCurrency,
                            exchangeRates,
                        ),
                    });
                }
            }

            // healthFactor is 1e18-scaled. When there's no debt the pool
            // returns max uint256 — treat that as "no debt" rather than
            // a numeric value.
            let healthFactor: number | null = null;
            if (totalDebtBaseRaw > 0n && hfRaw < MAX_UINT256) {
                healthFactor = Number(formatUnits(hfRaw, 18));
            }

            return {
                supplied,
                borrowed,
                healthFactor,
            };
        },
    });

    const data = query.data;
    const supplied = data?.supplied ?? [];
    const borrowed = data?.borrowed ?? [];
    const totalSuppliedUsd = supplied.reduce((s, p) => s + p.valueUsd, 0);
    const totalSuppliedInCurrency = supplied.reduce(
        (s, p) => s + p.valueInCurrency,
        0,
    );
    const totalBorrowedUsd = borrowed.reduce((s, p) => s + p.valueUsd, 0);
    const totalBorrowedInCurrency = borrowed.reduce(
        (s, p) => s + p.valueInCurrency,
        0,
    );

    return {
        supplied,
        borrowed,
        totalSuppliedUsd,
        totalSuppliedInCurrency,
        totalBorrowedUsd,
        totalBorrowedInCurrency,
        healthFactor: data?.healthFactor ?? null,
        netValueUsd: totalSuppliedUsd - totalBorrowedUsd,
        netValueInCurrency:
            totalSuppliedInCurrency - totalBorrowedInCurrency,
        hasPosition: supplied.length > 0 || borrowed.length > 0,
        isLoading: query.isLoading,
        error: query.error,
    };
};
