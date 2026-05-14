import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';
import {
    PricePoint,
    useOracleHistory24h,
} from './useOraclePriceChanges24h';
import { useAppConfig } from '@/providers';

type Holdings = {
    vet: number;
    vtho: number;
    b3tr: number; // includes B3TR + VOT3 + veDelegate (same price feed)
};

const VET_SENTINEL = '0x';

const liveBalance = (raw: string | undefined) => Number(raw ?? '0') || 0;

/**
 * Walk the union of timestamps from the per-feed histories and emit a
 * portfolio value at each one, holding the most recent value per feed.
 * Weights use the wallet's current liquid balances — accurate enough for a
 * sparkline since holdings rarely change inside a 24h window.
 */
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
            holdings.b3tr * b3trValue;
        points.push({ timestamp: ts, value: total });
    }
    return points;
};

export const usePortfolioPriceHistory24h = (address?: string) => {
    const config = useAppConfig();
    const { data, isLoading: historyLoading } = useOracleHistory24h();
    const { balances, isLoading: balancesLoading } = useTokenBalances(address);

    const holdings = useMemo<Holdings>(() => {
        // Balances are pre-scaled (string of human units, e.g. "12.34").
        const find = (addr: string) =>
            balances.find(
                (b) => b.address.toLowerCase() === addr.toLowerCase(),
            )?.balance;
        const vet = liveBalance(find(VET_SENTINEL));
        const vtho = liveBalance(find(config.vthoContractAddress));
        const vvet = liveBalance(find(config.vvetContractAddress));
        const b3tr = liveBalance(find(config.b3trContractAddress));
        const vot3 = liveBalance(find(config.vot3ContractAddress));
        const veDelegate = liveBalance(find(config.veDelegate));
        return {
            // VVET is wrapped VET — counts toward the VET-priced share.
            vet: vet + vvet,
            vtho,
            // VOT3 and veDelegate share the B3TR price feed.
            b3tr: b3tr + vot3 + veDelegate,
        };
    }, [
        balances,
        config.vthoContractAddress,
        config.vvetContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
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

    return { points, isLoading: historyLoading || balancesLoading };
};
