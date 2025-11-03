import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { swapAggregators } from '@/config/swapAggregators';
import { SwapParams, SwapQuote } from '@/types/swap';
import { parseUnits, zeroAddress } from 'viem';
import { useThor } from '@vechain/dapp-kit-react';
import { useGetCustomTokenInfo } from '@/hooks/api/wallet/useGetCustomTokenInfo';
import { TokenWithValue } from '@/hooks';

export type UnifiedSwapQuotesResult = {
    bestQuote: SwapQuote | null;
    quotes: SwapQuote[];
    isLoading: boolean;
    error: unknown;
    from: TokenWithValue & {
        address: string;
        decimals: number;
    } | null;
    to: TokenWithValue & {
        address: string;
        decimals: number;
    } | null;
};

/**
 * Unified hook: fetches quotes from all aggregators, simulates each, returns
 * - bestQuote (filtered against reverts when at least one succeeds)
 * - quotes: full list with revert flags and gas
 */
export const useSwapQuotes = (
    fromToken: TokenWithValue | null,
    toToken: TokenWithValue | null,
    amountIn: string,
    userAddress: string,
    slippageTolerance: number = 1,
    enabled: boolean = true,
): UnifiedSwapQuotesResult => {
    const thor = useThor();

    // Use on-chain token decimals for correct parsing of amountIn, pass empty string to not let it fetch details for VET
    const fromTokenAddress = fromToken?.address ?? null;
    const toTokenAddress = toToken?.address ?? null;
    const { data: fromTokenInfo } = useGetCustomTokenInfo(fromTokenAddress === '0x' || fromTokenAddress === zeroAddress || !fromTokenAddress ? '' : fromTokenAddress);
    const { data: toTokenInfo } = useGetCustomTokenInfo(toTokenAddress === '0x' || toTokenAddress === zeroAddress || !toTokenAddress ? '' : toTokenAddress);

    const fromTokenDecimals = useMemo(() => {
        if (!fromTokenAddress || fromTokenAddress === '0x' || fromTokenAddress === zeroAddress || !fromTokenInfo) return 18;
        return Number(fromTokenInfo?.decimals ?? 18);
    }, [fromTokenAddress, fromTokenInfo?.decimals]);

    const toTokenDecimals = useMemo(() => {
        if (!toTokenAddress || toTokenAddress === '0x' || toTokenAddress === zeroAddress || !toTokenInfo) return 18;
        return Number(toTokenInfo?.decimals ?? 18);
    }, [toTokenAddress, toTokenInfo?.decimals]);

    const params: SwapParams | null = useMemo(() => {
        if (!fromTokenAddress || !toTokenAddress || !amountIn || !userAddress) return null;


        let amountInRaw: bigint;
        try {
            amountInRaw = parseUnits(amountIn, fromTokenDecimals)
        } catch (error) {
            console.error('Failed to parse amount:', amountIn, error);
            return null;
        }

        if (amountInRaw <= 0n) return null;

        return {
            fromTokenAddress,
            toTokenAddress,
            amountIn: amountInRaw.toString(),
            userAddress,
            slippageTolerance,
        };
    }, [fromTokenAddress, toTokenAddress, amountIn, userAddress, slippageTolerance, fromTokenDecimals]);

    const { data, isLoading, error } = useQuery<{ quotes: SwapQuote[]; best: SwapQuote | null }>({
        queryKey: ['unified-swap-quotes', params],
        queryFn: async () => {
            if (!params || !thor) return { quotes: [], best: null };

            const quotePromises = swapAggregators.map(async (aggregator) => {
                try {
                    const quote = await aggregator.getQuote(params, thor);
                    try {
                        const simulation = await aggregator.simulateSwap(params, quote, thor);
                        const enrichedQuote: SwapQuote = {
                            ...quote,
                            aggregator,
                            reverted: !simulation.success,
                            revertReason: simulation.error,
                            gasCostVTHO: simulation.gasCostVTHO,
                        };
                        return enrichedQuote;
                    } catch (simError) {
                        console.error(`Failed to simulate swap for ${aggregator.name}:`, simError);
                        const enrichedQuote: SwapQuote = {
                            ...quote,
                            aggregator,
                            reverted: true,
                            revertReason: simError instanceof Error ? simError.message : 'Simulation failed',
                            gasCostVTHO: 0,
                        };
                        return enrichedQuote;
                    }
                } catch (error) {
                    console.error(`Failed to get quote from ${aggregator.name}:`, error);
                    return null;
                }
            });

            const quotes = (await Promise.all(quotePromises)).filter(
                (q): q is SwapQuote => q !== null && q.outputAmount !== 0n,
            );

            // Decide best quote with revert-aware filtering
            let best: SwapQuote | null = null;
            if (quotes.length > 0) {
                const nonReverted = quotes.filter((q) => !(q.reverted ?? false));
                const candidates = nonReverted.length > 0 ? nonReverted : quotes;
                best = candidates.reduce((acc, cur) => {
                    const a = BigInt(acc.outputAmount || '0');
                    const b = BigInt(cur.outputAmount || '0');
                    return b > a ? cur : acc;
                });
            }

            console.log('Swap Quotes', quotes);
            console.log('Best Swap Quote', best);
            return { quotes, best };
        },
        enabled: enabled && params !== null && thor !== null && thor !== undefined,
        refetchInterval: 10000,
    });

    return {
        bestQuote: data?.best ?? null,
        quotes: data?.quotes ?? [],
        isLoading,
        error,
        from: fromToken ? {
            ...fromToken,
            address: fromTokenAddress ?? '',
            decimals: fromTokenDecimals,
        } : null,
        to: toToken ? {
            ...toToken,
            address: toTokenAddress ?? '',
            decimals: toTokenDecimals,
        } : null,
    };
};


