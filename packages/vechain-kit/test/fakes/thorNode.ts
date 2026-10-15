import { HexUInt, Transaction } from '@vechain/sdk-core';
import { vi } from 'vitest';

export const FAKE_NODE_URL = 'http://thor.test';

const GENESIS_ID =
    '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6';
const BEST_ID =
    '0x000000a0c7c0f2b54d2a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a';

export type SimulationOutput = {
    data: string;
    events: unknown[];
    transfers: unknown[];
    gasUsed: number;
    reverted: boolean;
    vmError: string;
};

export type FakeThorRequest = { method: string; path: string; body?: unknown };

export type FakeThorNode = ReturnType<typeof createFakeThorNode>;

const block = (id: string, number: number) => ({
    number,
    id,
    size: 170,
    parentID: number === 0 ? '0x' + 'ff'.repeat(32) : GENESIS_ID,
    timestamp: 1530316800 + number * 10,
    gasLimit: 10_000_000,
    beneficiary: '0x0000000000000000000000000000000000000000',
    gasUsed: 0,
    totalScore: number,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 1,
    stateRoot:
        '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: '0x0000000000000000000000000000000000000000',
    isTrunk: true,
    isFinalized: number === 0,
    baseFeePerGas: '0x9184e72a000',
    transactions: [],
});

/**
 * In-memory stand-in for the Thor REST API behind `ThorClient.at(FAKE_NODE_URL)`.
 * Every request is recorded; unknown routes throw so a test never silently
 * passes against an endpoint the fake does not model.
 */
export const createFakeThorNode = (
    options: {
        accounts?: Record<
            string,
            { hasCode?: boolean; balance?: string; energy?: string }
        >;
        simulate?: (req: {
            clauses: unknown[];
            caller?: string;
            gasPayer?: string;
        }) => SimulationOutput[];
        /** Handle requests to other origins (e.g. a fake fee delegator); undefined -> 404. */
        otherHosts?: (
            url: URL,
            init?: RequestInit,
        ) => Promise<Response> | Response | undefined;
        /** Origin the fake answers Thor requests on (default FAKE_NODE_URL). */
        url?: string;
    } = {},
) => {
    const nodeUrl = new URL(options.url ?? FAKE_NODE_URL).origin;
    const requests: FakeThorRequest[] = [];
    const sentRaw: string[] = [];
    const accounts = new Map(
        Object.entries(options.accounts ?? {}).map(([k, v]) => [
            k.toLowerCase(),
            v,
        ]),
    );

    const simulate =
        options.simulate ??
        ((req) =>
            (req.clauses as unknown[]).map(() => ({
                data: '0x',
                events: [],
                transfers: [],
                gasUsed: 21_000,
                reverted: false,
                vmError: '',
            })));

    const json = (data: unknown, status = 200) =>
        new Response(JSON.stringify(data), {
            status,
            headers: { 'content-type': 'application/json' },
        });

    const fetchImpl = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(
            typeof input === 'string' ? input : input.toString(),
        );
        const method = (init?.method ?? 'GET').toUpperCase();
        if (url.origin !== nodeUrl) {
            const handled = options.otherHosts?.(url, init);
            if (handled) return handled;
            return json({ error: `no network in tests: ${url.origin}` }, 404);
        }
        const body = init?.body ? JSON.parse(init.body as string) : undefined;
        requests.push({ method, path: url.pathname + url.search, body });
        const { pathname } = url;

        if (
            method === 'GET' &&
            (pathname === '/blocks/0' || pathname === `/blocks/${GENESIS_ID}`)
        ) {
            return json(block(GENESIS_ID, 0));
        }
        if (
            method === 'GET' &&
            /^\/blocks\/(best|\d+|0x[0-9a-f]{64})$/.test(pathname)
        ) {
            return json(block(BEST_ID, 160));
        }
        if (method === 'POST' && pathname === '/accounts/*') {
            return json(simulate(body));
        }
        const account = pathname.match(/^\/accounts\/(0x[0-9a-fA-F]{40})$/);
        if (method === 'GET' && account) {
            const a = accounts.get(account[1].toLowerCase());
            return json({
                balance: a?.balance ?? '0x0',
                energy: a?.energy ?? '0x0',
                hasCode: a?.hasCode ?? false,
            });
        }
        if (method === 'POST' && pathname === '/transactions') {
            sentRaw.push(body.raw);
            const tx = Transaction.decode(
                HexUInt.of(body.raw.slice(2)).bytes,
                true,
            );
            return json({ id: tx.id.toString() });
        }
        if (
            method === 'GET' &&
            /^\/transactions\/0x[0-9a-f]{64}\/receipt/.test(pathname)
        ) {
            return json(null);
        }
        if (method === 'GET' && pathname === '/fees/priority') {
            return json({ maxPriorityFeePerGas: '0x0' });
        }
        if (method === 'GET' && pathname === '/fees/history') {
            return json({
                oldestBlock: BEST_ID,
                baseFeePerGas: ['0x9184e72a000'],
                gasUsedRatio: [0],
            });
        }
        throw new Error(
            `fake thor node: unhandled ${method} ${pathname}${url.search}`,
        );
    };

    return {
        url: nodeUrl,
        requests,
        sentRaw,
        fetch: vi.fn(fetchImpl),
        install() {
            vi.stubGlobal('fetch', this.fetch);
            return this;
        },
        decodeSent(index = 0) {
            return Transaction.decode(
                HexUInt.of(sentRaw[index].slice(2)).bytes,
                true,
            );
        },
    };
};
