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
// Window of blocks to scan around 24h ago. With ~5 feeds updating every few
// minutes this stays well below the indexer's per-query limit.
const WINDOW_BLOCKS = 1800; // ~5h

const SCALE = new BigNumber('1e12');

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

export type PriceChanges24h = Partial<Record<SupportedToken, number>>;

export const useOraclePriceChanges24h = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const oracleAddress = getConfig(network.type).oracleContractAddress;

    return useQuery<PriceChanges24h>({
        queryKey: [
            'VECHAIN_KIT',
            'ORACLE_PRICE_CHANGES_24H',
            network.type,
            oracleAddress,
        ],
        enabled: !!thor && !!oracleAddress,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 1,
        queryFn: async () => {
            // `getHeadBlock()` is a synchronous cache that can be null before
            // the SDK has polled. Use the explicit RPC call instead so we
            // always have a current block height.
            const head = await thor.blocks.getBestBlockExpanded();
            if (!head) return {};

            const oracle = thor.contracts.load(
                oracleAddress,
                OracleVechainEnergy__factory.abi,
            );

            // Snapshot of latest values for the feeds we care about.
            const feedEntries = Object.entries(PRICE_FEED_IDS) as Array<
                [SupportedToken, string]
            >;
            const latestEntries = await Promise.all(
                feedEntries.map(async ([token, feedId]) => {
                    try {
                        const res = await oracle.read.getLatestValue(
                            feedId as `0x${string}`,
                        );
                        const raw = (res as readonly bigint[])[0];
                        return [token, raw] as const;
                    } catch {
                        return [token, null] as const;
                    }
                }),
            );
            const latestByToken = new Map(latestEntries);

            // Look for ValueUpdate events in a window centered ~24h ago.
            const targetBlock = Math.max(0, head.number - BLOCKS_PER_DAY);
            const toBlock = Math.min(head.number, targetBlock + WINDOW_BLOCKS / 2);
            const fromBlock = Math.max(0, targetBlock - WINDOW_BLOCKS / 2);

            const eventAbi = oracle.getEventAbi('ValueUpdate');

            // OracleVechainEnergy only emits ValueUpdate, so filtering by
            // contract address is enough — avoids relying on topic encoding
            // for an event whose `id` field is non-indexed.
            const events = await getEventLogs({
                thor,
                nodeUrl: network.nodeUrl,
                from: fromBlock,
                to: toBlock,
                order: 'desc',
                limit: 256,
                filterCriteria: [
                    {
                        criteria: { address: oracleAddress },
                        eventAbi,
                    },
                ],
            });

            // Walk events from newest → oldest in the window; keep the first
            // (most recent at-or-before targetBlock) observation per feedId.
            const pastByFeedId = new Map<string, bigint>();
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
                    const idKey = args.id.toLowerCase();
                    if (!pastByFeedId.has(idKey)) {
                        pastByFeedId.set(idKey, args.value);
                    }
                } catch {
                    // ignore malformed entries
                }
            }

            const result: PriceChanges24h = {};
            for (const [token, feedId] of feedEntries) {
                const latest = latestByToken.get(token);
                const past = pastByFeedId.get(feedId.toLowerCase());
                if (!latest || !past || past === 0n) continue;
                const change = new BigNumber(latest.toString())
                    .minus(past.toString())
                    .div(past.toString())
                    .multipliedBy(100)
                    .toNumber();
                if (Number.isFinite(change)) {
                    result[token] = change;
                }
                // Keep both raw values around in case future callers want them;
                // for now the percentage is what we expose.
                void SCALE;
            }

            return result;
        },
    });
};
