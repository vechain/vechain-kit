import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { decodeFunctionData } from 'viem';
import { Address, HexUInt, Transaction } from '@vechain/sdk-core';
import { SocialLoginSmartAccount__factory } from '@vechain/vechain-contract-types';
import {
    createFakeThorNode,
    FAKE_NODE_URL,
    type FakeThorNode,
} from '../../test/fakes/thorNode';
import {
    FAKE_SIGNATURE,
    privyMocks,
    resetPrivyMock,
} from '../../test/mocks/privyReactAuth';
import { getConfig } from '@/config';
import { randomTransactionUser } from '@/utils';

vi.mock(
    '@privy-io/react-auth',
    () => import('../../test/mocks/privyReactAuth'),
);

const OWNER = '0x4444444444444444444444444444444444444444';
const SMART_ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECIPIENT = '0x2222222222222222222222222222222222222222';
const SPONSOR_URL = 'https://sponsor.test/';
const PAYER_KEY = HexUInt.of('11'.repeat(32)).bytes;
const PAYER_ADDRESS = Address.ofPrivateKey(PAYER_KEY).toString().toLowerCase();

const state = vi.hoisted(() => ({
    isConnectedWithCrossApp: false,
    connectedWallet: {
        address: '0x4444444444444444444444444444444444444444',
    } as { address: string } | undefined,
    smartAccount: {
        address: '0x1111111111111111111111111111111111111111',
        isDeployed: true,
    } as { address: string; isDeployed: boolean } | undefined,
    version: 3 as number | undefined,
    hasV1: false,
    crossApp: {
        signTypedData: vi.fn(async () => '0xcrossapp-typed'),
        signMessage: vi.fn(async () => '0xcrossapp-message'),
    },
    genericDelegator: {
        sendTransactionUsingGenericDelegator: vi.fn(async () => '0xgeneric-id'),
    },
}));

vi.mock('@/hooks/api/wallet/useWallet', () => ({
    useWallet: () => ({
        connection: { isConnectedWithCrossApp: state.isConnectedWithCrossApp },
        connectedWallet: state.connectedWallet,
    }),
}));
vi.mock(
    '@/hooks/thor/smartAccounts/useSmartAccount',
    async (importOriginal) => ({
        ...(await importOriginal<object>()),
        useSmartAccount: () => ({ data: state.smartAccount }),
    }),
);
vi.mock(
    '@/hooks/thor/smartAccounts/useGetAccountVersion',
    async (importOriginal) => ({
        ...(await importOriginal<object>()),
        useGetAccountVersion: () => ({
            data:
                state.version === undefined
                    ? undefined
                    : { version: state.version, isDeployed: true },
        }),
    }),
);
vi.mock(
    '@/hooks/thor/smartAccounts/useHasV1SmartAccount',
    async (importOriginal) => ({
        ...(await importOriginal<object>()),
        useHasV1SmartAccount: () => ({ data: state.hasV1 }),
    }),
);
vi.mock('@/hooks/thor/blocks/useGetChainId', () => ({
    useGetChainId: () => ({ data: getConfig('test').network.genesis.id }),
    getChainIdQueryKey: () => ['VECHAIN_KIT_CHAIN_ID'],
}));
vi.mock('@/providers/VeChainKitProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useVeChainKitConfig: () => ({
        network: { type: 'test', nodeUrl: FAKE_NODE_URL },
    }),
}));
vi.mock('@/providers/PrivyCrossAppProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    usePrivyCrossAppSdk: () => state.crossApp,
}));
vi.mock(
    '@/hooks/generic-delegator/useGenericDelegator',
    async (importOriginal) => ({
        ...(await importOriginal<object>()),
        useGenericDelegator: () => state.genericDelegator,
    }),
);

import {
    PrivyWalletProvider,
    usePrivyWalletProvider,
    type PrivyWalletProviderContextType,
} from './PrivyWalletProvider';

let ctx: PrivyWalletProviderContextType;
const Probe = () => {
    ctx = usePrivyWalletProvider();
    return null;
};

const mount = (
    props: Partial<React.ComponentProps<typeof PrivyWalletProvider>> = {},
) =>
    render(
        <PrivyWalletProvider
            nodeUrl={FAKE_NODE_URL}
            delegatorUrl={SPONSOR_URL}
            delegateAllTransactions={false}
            genericDelegator={false}
            {...props}
        >
            <Probe />
        </PrivyWalletProvider>,
    );

// VIP-201 fee delegation service: signs whatever raw tx the kit submits.
const sponsor = (url: URL, init?: RequestInit) => {
    if (url.origin !== 'https://sponsor.test') return undefined;
    const { raw, origin } = JSON.parse(init?.body as string) as {
        raw: string;
        origin: string;
    };
    const tx = Transaction.decode(HexUInt.of(raw.slice(2)).bytes, false);
    const signature = tx.signAsGasPayer(Address.of(origin), PAYER_KEY)
        .signature as Uint8Array;
    return new Response(
        JSON.stringify({
            signature: HexUInt.of(signature.slice(-65)).toString(),
        }),
        {
            status: 200,
            headers: { 'content-type': 'application/json' },
        },
    );
};

let node: FakeThorNode;
const clauses = [{ to: RECIPIENT, value: '0x1', data: '0x' }];

beforeEach(() => {
    resetPrivyMock();
    state.isConnectedWithCrossApp = false;
    state.connectedWallet = { address: OWNER };
    state.smartAccount = { address: SMART_ACCOUNT, isDeployed: true };
    state.version = 3;
    state.hasV1 = false;
    state.crossApp.signTypedData.mockClear();
    state.crossApp.signMessage.mockClear();
    state.genericDelegator.sendTransactionUsingGenericDelegator.mockClear();
    node = createFakeThorNode({ otherHosts: sponsor }).install();
});

describe('PrivyWalletProvider.sendTransaction with a dApp-sponsored delegator', () => {
    it('signs the authorization, simulates, then broadcasts a VIP-191 tx from the random forwarder', async () => {
        mount();
        const id = await ctx.sendTransaction({
            txClauses: clauses,
            title: 'Send',
        });

        expect(node.sentRaw).toHaveLength(1);
        const sent = node.decodeSent(0);
        expect(id).toBe(sent.id.toString());
        expect(sent.isDelegated).toBe(true);
        expect(sent.origin.toString().toLowerCase()).toBe(
            randomTransactionUser.address.toLowerCase(),
        );
        expect(sent.gasPayer.toString().toLowerCase()).toBe(PAYER_ADDRESS);
        expect(sent.body.clauses).toHaveLength(1);
        expect(sent.body.clauses[0].to?.toLowerCase()).toBe(SMART_ACCOUNT);
        const call = decodeFunctionData({
            abi: SocialLoginSmartAccount__factory.abi,
            data: sent.body.clauses[0].data as `0x${string}`,
        });
        expect(call.functionName).toBe('executeBatchWithAuthorization');
        expect(call.args?.[0]).toEqual([RECIPIENT]);
        expect(call.args?.[6]).toBe(FAKE_SIGNATURE);

        const simulation = node.requests.find(
            (r) => r.method === 'POST' && r.path.startsWith('/accounts/*'),
        );
        expect(
            (simulation?.body as { caller: string }).caller.toLowerCase(),
        ).toBe(randomTransactionUser.address.toLowerCase());
        expect(privyMocks.signTypedData).toHaveBeenCalledTimes(1);
        expect(sent.body.gas).toBeGreaterThan(0);
    });

    it('does not broadcast when the simulation reverts', async () => {
        node = createFakeThorNode({
            otherHosts: sponsor,
            simulate: (req) =>
                req.clauses.map(() => ({
                    data: '0x',
                    events: [],
                    transfers: [],
                    gasUsed: 0,
                    reverted: true,
                    vmError: 'execution reverted',
                })),
        }).install();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mount();
        const result = await ctx.sendTransaction({ txClauses: clauses });
        expect(node.sentRaw).toHaveLength(0);
        expect(result).not.toMatch(/^0x[0-9a-f]{64}$/);
    });

    it('uses the per-call delegation URL and falls back to legacy signing for v1 accounts', async () => {
        state.version = undefined;
        state.hasV1 = true;
        mount({ delegatorUrl: 'https://unused.test/' });
        await ctx.sendTransaction({
            txClauses: clauses,
            delegationUrl: SPONSOR_URL,
        });
        const call = decodeFunctionData({
            abi: SocialLoginSmartAccount__factory.abi,
            data: node.decodeSent(0).body.clauses[0].data as `0x${string}`,
        });
        expect(call.functionName).toBe('executeWithAuthorization');
    });

    it('defaults an unknown account version to v3 batching', async () => {
        state.version = undefined;
        mount();
        await ctx.sendTransaction({ txClauses: clauses });
        const call = decodeFunctionData({
            abi: SocialLoginSmartAccount__factory.abi,
            data: node.decodeSent(0).body.clauses[0].data as `0x${string}`,
        });
        expect(call.functionName).toBe('executeBatchWithAuthorization');
    });

    it('refuses to send without a smart account or embedded wallet', async () => {
        state.smartAccount = undefined;
        mount();
        await expect(
            ctx.sendTransaction({ txClauses: clauses }),
        ).rejects.toThrow('Address or embedded wallet is missing');
        expect(node.requests).toHaveLength(0);
    });
});

describe('PrivyWalletProvider.sendTransaction routing', () => {
    it('hands off to the generic delegator when configured and no per-call delegator is given', async () => {
        mount({
            genericDelegator: true,
            delegatorUrl: 'https://generic.test/api/v1/',
        });
        const id = await ctx.sendTransaction({ txClauses: clauses });
        expect(id).toBe('0xgeneric-id');
        expect(
            state.genericDelegator.sendTransactionUsingGenericDelegator,
        ).toHaveBeenCalledWith({
            clauses,
            genericDelegatorUrl: 'https://generic.test/api/v1/',
        });
        expect(node.requests).toHaveLength(0);
    });

    it('prefers a per-call delegation URL over the generic delegator', async () => {
        mount({
            genericDelegator: true,
            delegatorUrl: 'https://generic.test/api/v1/',
        });
        await ctx.sendTransaction({
            txClauses: clauses,
            delegationUrl: SPONSOR_URL,
        });
        expect(
            state.genericDelegator.sendTransactionUsingGenericDelegator,
        ).not.toHaveBeenCalled();
        expect(node.sentRaw).toHaveLength(1);
    });
});

describe('PrivyWalletProvider signing and context', () => {
    it('routes message and typed-data signing to Privy or the cross-app SDK', async () => {
        mount();
        const typed = {
            domain: {},
            types: { T: [] },
            primaryType: 'T',
            message: {},
        } as never;
        expect(await ctx.signMessage('hi')).toBe(FAKE_SIGNATURE);
        expect(await ctx.signTypedData(typed)).toBe(FAKE_SIGNATURE);
        expect(privyMocks.signMessage).toHaveBeenCalledWith({ message: 'hi' });

        state.isConnectedWithCrossApp = true;
        mount();
        expect(await ctx.signMessage('hi')).toBe('0xcrossapp-message');
        expect(await ctx.signTypedData(typed)).toBe('0xcrossapp-typed');
        expect(state.crossApp.signTypedData).toHaveBeenCalledWith(
            expect.objectContaining({ address: OWNER, primaryType: 'T' }),
        );
    });

    it('exposes the network account factory and delegation flag', () => {
        mount({ delegateAllTransactions: true });
        expect(ctx.accountFactory).toBe(
            getConfig('test').accountFactoryAddress,
        );
        expect(ctx.delegateAllTransactions).toBe(true);
    });
});
