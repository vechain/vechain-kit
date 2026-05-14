import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { OracleVechainEnergy__factory } from '@vechain/vechain-contract-types';
import { BigNumber } from 'bignumber.js';
import { decodeEventLog as viemDecodeEventLog, Hex as ViemHex } from 'viem';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { getEventLogs } from '@/hooks/thor/logs/logUtils';
import { PRICE_FEED_IDS, SupportedToken } from './useGetTokenUsdPrice';

// VeChain block time is ~10s → 8640 blocks/day.
const BLOCKS_PER_DAY = 8640;
const PRICE_SCALE_DECIMALS = 12;

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

export type PricePoint = { timestamp: number; value: number };

export type OracleHistory24h = {
    /** All emitted ValueUpdate observations per token, ascending by time. */
    history: Partial<Record<SupportedToken, PricePoint[]>>;
    /** Current spot value per token (USD). */
    latest: Partial<Record<SupportedToken, number>>;
};

export type PriceChanges24h = Partial<Record<SupportedToken, number>>;

const scaleToUsd = (raw: bigint) =>
    new BigNumber(raw.toString()).shiftedBy(-PRICE_SCALE_DECIMALS).toNumber();

/**
 * Shared 24h oracle scan: fetches every `ValueUpdate` emitted by
 * `OracleVechainEnergy` over the last day plus the current spot for each
 * supported feed. Multiple downstream hooks (`useOraclePriceChanges24h`,
 * `useTokenPriceHistory24h`, the portfolio chart) all derive from this single
 * query so we never run the same RPC scan twice in a session.
 */
export const useOracleHistory24h = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const oracleAddress = getConfig(network.type).oracleContractAddress;

    return useQuery<OracleHistory24h>({
        queryKey: [
            'VECHAIN_KIT',
            'ORACLE_HISTORY_24H',
            network.type,
            oracleAddress,
        ],
        enabled: !!thor && !!oracleAddress,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        queryFn: async () => {
            const head = await thor.blocks.getBestBlockExpanded();
            if (!head) return { history: {}, latest: {} };

            const oracle = thor.contracts.load(
                oracleAddress,
                OracleVechainEnergy__factory.abi,
            );

            const feedEntries = Object.entries(PRICE_FEED_IDS) as Array<
                [SupportedToken, string]
            >;

            // Spot values for the latest point on every chart.
            const latestEntries = await Promise.all(
                feedEntries.map(async ([token, feedId]) => {
                    try {
                        const res = await oracle.read.getLatestValue(
                            feedId as `0x${string}`,
                        );
                        const raw = (res as readonly bigint[])[0];
                        return [token, scaleToUsd(raw)] as const;
                    } catch {
                        return [token, null] as const;
                    }
                }),
            );
            const latest: OracleHistory24h['latest'] = {};
            for (const [token, value] of latestEntries) {
                if (value != null) latest[token] = value;
            }

            // Scan ValueUpdate over the past 24h. Density is low enough
            // (~30 events across all feeds per day) that 256 is plenty.
            const fromBlock = Math.max(0, head.number - BLOCKS_PER_DAY);
            const eventAbi = oracle.getEventAbi('ValueUpdate');
            const events = await getEventLogs({
                thor,
                nodeUrl: network.nodeUrl,
                from: fromBlock,
                to: head.number,
                order: 'asc',
                limit: 256,
                filterCriteria: [
                    {
                        criteria: { address: oracleAddress },
                        eventAbi,
                    },
                ],
            });

            const byFeedId = new Map<string, PricePoint[]>();
            for (const event of events) {
                try {
                    const decoded = viemDecodeEventLog({
                        abi: OracleVechainEnergy__factory.abi,
                        data: event.data.toString() as ViemHex,
                        topics: event.topics.map((t) => t.toString()) as Topics,
                    });
                    if (decoded.eventName !== 'ValueUpdate') continue;
                    const args = decoded.args as unknown as {
                        id: string;
                        value: bigint;
                    };
                    const key = args.id.toLowerCase();
                    const list = byFeedId.get(key) ?? [];
                    list.push({
                        timestamp: Number(event.meta.blockTimestamp),
                        value: scaleToUsd(args.value),
                    });
                    byFeedId.set(key, list);
                } catch {
                    // ignore malformed entries
                }
            }

            const history: OracleHistory24h['history'] = {};
            const now = Math.floor(Date.now() / 1000);
            for (const [token, feedId] of feedEntries) {
                const points = byFeedId.get(feedId.toLowerCase()) ?? [];
                // Pin the current value as the closing point so the chart
                // always extends to "now" even if there hasn't been an
                // event for hours.
                const latestValue = latest[token];
                const closing: PricePoint | null =
                    latestValue != null
                        ? { timestamp: now, value: latestValue }
                        : null;
                const merged = closing ? [...points, closing] : points;
                if (merged.length) history[token] = merged;
            }

            return { history, latest };
        },
    });
};

export const useOraclePriceChanges24h = () => {
    const { data } = useOracleHistory24h();
    const result: PriceChanges24h = {};
    if (data?.history) {
        for (const [token, points] of Object.entries(data.history) as Array<
            [SupportedToken, PricePoint[]]
        >) {
            if (!points || points.length < 2) continue;
            const first = points[0].value;
            const last = points[points.length - 1].value;
            if (!first) continue;
            const change = ((last - first) / first) * 100;
            if (Number.isFinite(change)) result[token] = change;
        }
    }
    return { data: result };
};

/** Per-token sparkline points (ascending by timestamp). */
export const useTokenPriceHistory24h = (token?: SupportedToken) => {
    const { data, isLoading } = useOracleHistory24h();
    const points = token ? (data?.history?.[token] ?? []) : [];
    return { points, isLoading };
};
