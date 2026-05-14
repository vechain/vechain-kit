import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import {
    PricePoint,
    useOracleHistory24h,
} from './useOraclePriceChanges24h';
import { useAppConfig } from '@/providers';
import { useStargatePositions } from '../staking/useStargatePositions';
import { useNavigatorPosition } from '../staking/useNavigatorPosition';
import { useJuicyPosition } from '../staking/useJuicyPosition';
import { useBetterSwapLpPositions } from '../staking/useBetterSwapLpPositions';

type Holdings = {
    vet: number;
    vtho: number;
    b3tr: number; // includes B3TR + VOT3 + veDelegate (same price feed)
    /**
     * USD value that doesn't have a clean per-feed mapping (e.g. BetterSwap
     * LP positions whose underlying split varies per pair). Treated as a
     * flat offset on every point — not perfectly accurate in motion but
     * keeps the chart's totals matching the wallet's headline number.
     */
    flatUsdOffset: number;
};

const VET_SENTINEL = '0x';

const liveBalance = (raw: string | undefined) => Number(raw ?? '0') || 0;

const buildPortfolioPoints = (
    holdings: Holdings,
    feeds: {
        vet?: PricePoint[];
        vtho?: PricePoint[];
        b3tr?: PricePoint[];
    },
): PricePoint[] => {
    const vet = feeds.vet ?? [];
    const vtho = feeds.vtho ?? [];
    const b3tr = feeds.b3tr ?? [];
    if (!vet.length && !vtho.length && !b3tr.length) return [];

    const timestamps = Array.from(
        new Set([
            ...vet.map((p) => p.timestamp),
            ...vtho.map((p) => p.timestamp),
            ...b3tr.map((p) => p.timestamp),
        ]),
    ).sort((a, b) => a - b);

    let vetIdx = 0;
    let vthoIdx = 0;
    let b3trIdx = 0;
    let vetValue = vet[0]?.value ?? 0;
    let vthoValue = vtho[0]?.value ?? 0;
    let b3trValue = b3tr[0]?.value ?? 0;

    const points: PricePoint[] = [];
    for (const ts of timestamps) {
        while (vetIdx < vet.length && vet[vetIdx].timestamp <= ts) {
            vetValue = vet[vetIdx].value;
            vetIdx++;
        }
        while (vthoIdx < vtho.length && vtho[vthoIdx].timestamp <= ts) {
            vthoValue = vtho[vthoIdx].value;
            vthoIdx++;
        }
        while (b3trIdx < b3tr.length && b3tr[b3trIdx].timestamp <= ts) {
            b3trValue = b3tr[b3trIdx].value;
            b3trIdx++;
        }
        const total =
            holdings.vet * vetValue +
            holdings.vtho * vthoValue +
            holdings.b3tr * b3trValue +
            holdings.flatUsdOffset;
        points.push({ timestamp: ts, value: total });
    }
    return points;
};

export const usePortfolioPriceHistory24h = (address?: string) => {
    const config = useAppConfig();
    const { data, isLoading: historyLoading } = useOracleHistory24h();
    const { balances, isLoading: balancesLoading } = useTokenBalances(address);
    const stargate = useStargatePositions(address);
    const navigator = useNavigatorPosition(address);
    const juicy = useJuicyPosition(address);
    const lp = useBetterSwapLpPositions(address);

    const holdings = useMemo<Holdings>(() => {
        // Balances are pre-scaled (string of human units, e.g. "12.34").
        const find = (addr: string) =>
            balances.find(
                (b) => b.address.toLowerCase() === addr.toLowerCase(),
            )?.balance;
        const liquidVet = liveBalance(find(VET_SENTINEL));
        const liquidVtho = liveBalance(find(config.vthoContractAddress));
        const liquidVvet = liveBalance(find(config.vvetContractAddress));
        const liquidB3tr = liveBalance(find(config.b3trContractAddress));
        const liquidVot3 = liveBalance(find(config.vot3ContractAddress));
        const liquidVeDelegate = liveBalance(find(config.veDelegate));

        // Stargate stakes are denominated in VET.
        const stargateVet = stargate.positions.reduce(
            (sum, p) => sum + p.vetAmountFormatted,
            0,
        );

        // Navigators: B3TR feed for both staked (navigator) and delegated
        // (citizen) positions — the contract operates on B3TR amounts.
        const navigatorB3tr =
            (navigator.isNavigator ? navigator.stakedB3TR : 0) +
            (navigator.isDelegated ? navigator.delegatedAmount : 0);

        // Juicy: per-asset net = supplied - borrowed, matched against the
        // canonical token addresses for VET (via VVET), VTHO, B3TR.
        const vvetLower = config.vvetContractAddress.toLowerCase();
        const vthoLower = config.vthoContractAddress.toLowerCase();
        const b3trLower = config.b3trContractAddress.toLowerCase();
        const juicyNetByFeed = { vet: 0, vtho: 0, b3tr: 0 };
        for (const p of juicy.supplied) {
            const a = p.asset.toLowerCase();
            if (a === vvetLower) juicyNetByFeed.vet += p.amount;
            else if (a === vthoLower) juicyNetByFeed.vtho += p.amount;
            else if (a === b3trLower) juicyNetByFeed.b3tr += p.amount;
        }
        for (const p of juicy.borrowed) {
            const a = p.asset.toLowerCase();
            if (a === vvetLower) juicyNetByFeed.vet -= p.amount;
            else if (a === vthoLower) juicyNetByFeed.vtho -= p.amount;
            else if (a === b3trLower) juicyNetByFeed.b3tr -= p.amount;
        }

        // BetterSwap LP positions split across two arbitrary assets — treat
        // their current USD value as a flat offset rather than try to
        // attribute amounts to specific feeds.
        const flatUsdOffset = lp.totalValueUsd;

        return {
            vet: liquidVet + liquidVvet + stargateVet + juicyNetByFeed.vet,
            vtho: liquidVtho + juicyNetByFeed.vtho,
            b3tr:
                liquidB3tr +
                liquidVot3 +
                liquidVeDelegate +
                navigatorB3tr +
                juicyNetByFeed.b3tr,
            flatUsdOffset,
        };
    }, [
        balances,
        config.vthoContractAddress,
        config.vvetContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        stargate.positions,
        navigator.isNavigator,
        navigator.isDelegated,
        navigator.stakedB3TR,
        navigator.delegatedAmount,
        juicy.supplied,
        juicy.borrowed,
        lp.totalValueUsd,
    ]);

    const points = useMemo(
        () =>
            buildPortfolioPoints(holdings, {
                vet: data?.history?.VET,
                vtho: data?.history?.VTHO,
                b3tr: data?.history?.B3TR,
            }),
        [holdings, data?.history],
    );

    return {
        points,
        isLoading:
            historyLoading ||
            balancesLoading ||
            stargate.isLoading ||
            navigator.isLoading ||
            juicy.isLoading ||
            lp.isLoading,
    };
};
