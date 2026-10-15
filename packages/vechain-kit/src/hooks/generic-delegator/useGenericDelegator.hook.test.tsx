import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { decodeFunctionData, erc20Abi, parseEther } from 'viem';
import { Address, HexUInt, Transaction } from '@vechain/sdk-core';
import { SocialLoginSmartAccount__factory } from '@vechain/vechain-contract-types';
import {
    createFakeThorNode,
    type FakeThorNode,
} from '../../../test/fakes/thorNode';
import {
    FAKE_SIGNATURE,
    privyMocks,
    resetPrivyMock,
} from '../../../test/mocks/privyReactAuth';
import { getConfig } from '@/config';
import { randomTransactionUser, SUPPORTED_GAS_TOKENS } from '@/utils';
import type { GasTokenType } from '@/types';

vi.mock(
    '@privy-io/react-auth',
    () => import('../../../test/mocks/privyReactAuth'),
);

const SMART_ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECIPIENT = '0x2222222222222222222222222222222222222222';
const DEPOSIT_ACCOUNT = '0x5555555555555555555555555555555555555555';
const DELEGATOR_URL = 'https://generic.test/api/v1/';
const PAYER_KEY = HexUInt.of('22'.repeat(32)).bytes;
const PAYER_ADDRESS = Address.ofPrivateKey(PAYER_KEY).toString().toLowerCase();

const state = vi.hoisted(() => ({
    gasToken: 'VET' as 'VET' | 'VTHO' | 'B3TR',
    version: 3 as number | undefined,
    isDeployed: true,
}));

vi.mock('@/hooks/api/wallet/useWallet', () => ({
    useWallet: () => ({
        connection: { isConnectedWithCrossApp: false },
        connectedWallet: {
            address: '0x4444444444444444444444444444444444444444',
        },
    }),
}));
vi.mock(
    '@/hooks/thor/smartAccounts/useSmartAccount',
    async (importOriginal) => ({
        ...(await importOriginal<object>()),
        useSmartAccount: () => ({
            data: {
                address: '0x1111111111111111111111111111111111111111',
                isDeployed: state.isDeployed,
            },
        }),
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
vi.mock('@/hooks/thor/blocks/useGetChainId', () => ({
    useGetChainId: () => ({ data: getConfig('test').network.genesis.id }),
    getChainIdQueryKey: () => ['VECHAIN_KIT_CHAIN_ID'],
}));
vi.mock('@/hooks/generic-delegator/useGasTokenSelection', () => ({
    useGasTokenSelection: () => ({
        preferences: { gasTokenToUse: state.gasToken },
    }),
}));
vi.mock('@/providers/VeChainKitProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useVeChainKitConfig: () => ({ network: { type: 'test' } }),
}));
vi.mock('@/providers/PrivyCrossAppProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    usePrivyCrossAppSdk: () => ({ signTypedData: vi.fn() }),
}));

import { useGenericDelegator } from './useGenericDelegator';

const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'content-type': 'application/json' },
    });

// The generic delegator: prices the clauses, names its deposit account and
// co-signs whatever raw tx the kit submits (VIP-191).
const delegatorRequests: Array<{ path: string; body?: unknown }> = [];
let delegatorAccepts = true;
const delegator = (url: URL, init?: RequestInit) => {
    if (url.origin !== 'https://generic.test') return undefined;
    const body = init?.body ? JSON.parse(init.body as string) : undefined;
    delegatorRequests.push({ path: url.pathname + url.search, body });
    if (url.pathname.startsWith('/api/v1/estimate/clauses/')) {
        return json({
            transactionCost: 0.5,
            estimatedGas: 100_000,
            vthoPerGasAtSpeed: 1e-5,
            rate: 1,
        });
    }
    if (url.pathname === '/api/v1/deposit/account') {
        return json({ depositAccount: DEPOSIT_ACCOUNT });
    }
    if (url.pathname.startsWith('/api/v1/sign/transaction/authorized/')) {
        if (!delegatorAccepts)
            return json({ message: 'Transfer not received' }, 500);
        const tx = Transaction.decode(
            HexUInt.of(body.raw.slice(2)).bytes,
            false,
        );
        const signature = tx.signAsGasPayer(Address.of(body.origin), PAYER_KEY)
            .signature as Uint8Array;
        return json({
            signature: HexUInt.of(signature.slice(-65)).toString(),
            address: PAYER_ADDRESS,
            raw: body.raw,
            origin: body.origin,
        });
    }
    return json({ error: 'unknown delegator route' }, 404);
};

let node: FakeThorNode;
const clauses = [{ to: RECIPIENT, value: '0x1', data: '0x' }];

const send = () => {
    const { result } = renderHook(() => useGenericDelegator());
    return result.current.sendTransactionUsingGenericDelegator({
        clauses,
        genericDelegatorUrl: DELEGATOR_URL,
    });
};

const decodeBatch = (sent: Transaction) => {
    const call = decodeFunctionData({
        abi: SocialLoginSmartAccount__factory.abi,
        data: sent.body.clauses[0].data as `0x${string}`,
    });
    const [to, value, data] = call.args as readonly [
        readonly string[],
        readonly bigint[],
        readonly string[],
    ];
    return { functionName: call.functionName, to, value, data };
};

beforeEach(() => {
    resetPrivyMock();
    state.gasToken = 'VET';
    state.version = 3;
    state.isDeployed = true;
    delegatorRequests.length = 0;
    delegatorAccepts = true;
    // The hook reads the node from getConfig(network.type), not from a nodeUrl override.
    node = createFakeThorNode({
        url: getConfig('test').nodeUrl,
        otherHosts: delegator,
    }).install();
});

describe('useGenericDelegator send path', () => {
    it('pays the delegator in VET from the smart account and broadcasts a VIP-191 tx', async () => {
        const id = await send();

        expect(node.sentRaw).toHaveLength(1);
        const sent = node.decodeSent(0);
        expect(id).toBe(sent.id.toString());
        expect(sent.isDelegated).toBe(true);
        expect(sent.origin.toString().toLowerCase()).toBe(
            randomTransactionUser.address.toLowerCase(),
        );
        expect(sent.gasPayer.toString().toLowerCase()).toBe(PAYER_ADDRESS);

        const batch = decodeBatch(sent);
        expect(batch.functionName).toBe('executeBatchWithAuthorization');
        expect(batch.to).toEqual([RECIPIENT, DEPOSIT_ACCOUNT]);
        expect(batch.data).toEqual(['0x', '0x']);
        // Fee = locally corrected gas * delegator rate, never below the delegator's own cost.
        expect(batch.value[1]).toBeGreaterThanOrEqual(parseEther('0.5'));
        expect(batch.value[1]).toBeLessThan(parseEther('5'));

        expect(delegatorRequests.map((r) => r.path)).toEqual([
            '/api/v1/estimate/clauses/vet?type=smartaccount&speed=medium',
            '/api/v1/deposit/account',
            '/api/v1/sign/transaction/authorized/vet',
        ]);
        expect((delegatorRequests[0].body as { signer: string }).signer).toBe(
            SMART_ACCOUNT,
        );
        expect(
            (
                delegatorRequests[2].body as { origin: string }
            ).origin.toLowerCase(),
        ).toBe(randomTransactionUser.address.toLowerCase());
        expect(privyMocks.signTypedData).toHaveBeenCalledTimes(1);
        const [typed] = privyMocks.signTypedData.mock.calls[0] as [
            { message: { to: string[] } },
        ];
        expect(typed.message.to).toEqual([RECIPIENT, DEPOSIT_ACCOUNT]);
    });

    it('pays the delegator with an ERC-20 transfer when a token is the gas token', async () => {
        state.gasToken = 'VTHO';
        await send();
        const batch = decodeBatch(node.decodeSent(0));
        expect(batch.to[1].toLowerCase()).toBe(
            SUPPORTED_GAS_TOKENS.VTHO.address?.toLowerCase(),
        );
        expect(batch.value[1]).toBe(0n);
        const transfer = decodeFunctionData({
            abi: erc20Abi,
            data: batch.data[1] as `0x${string}`,
        });
        expect(transfer.functionName).toBe('transfer');
        expect(transfer.args?.[0]).toBe(DEPOSIT_ACCOUNT);
        expect(transfer.args?.[1]).toBeGreaterThanOrEqual(parseEther('0.5'));
        expect(delegatorRequests[0].path).toContain('/estimate/clauses/vtho');
        expect(delegatorRequests[2].path).toContain('/authorized/vtho');
    });

    it('simulates the final clauses with the delegator as gas payer before sending', async () => {
        await send();
        const simulations = node.requests.filter(
            (r) => r.method === 'POST' && r.path.startsWith('/accounts/*'),
        );
        const withPayer = simulations.find(
            (r) => (r.body as { gasPayer?: string }).gasPayer,
        );
        expect(
            (withPayer?.body as { gasPayer: string }).gasPayer.toLowerCase(),
        ).toBe(PAYER_ADDRESS);
    });

    it('deploys an undeployed smart account in the same transaction', async () => {
        state.isDeployed = false;
        state.version = undefined;
        await send();
        const sent = node.decodeSent(0);
        expect(sent.body.clauses).toHaveLength(2);
        expect(sent.body.clauses[0].to?.toLowerCase()).toBe(
            getConfig('test').accountFactoryAddress.toLowerCase(),
        );
    });

    it('fails with the catch-all message when the delegator refuses to sign', async () => {
        delegatorAccepts = false;
        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        await expect(send()).rejects.toThrow(
            'Failed to send transaction using generic delegator',
        );
        expect(node.sentRaw).toHaveLength(0);
        expect(String(errors.mock.calls[0]?.[1])).toContain(
            'Transfer not received',
        );
    });

    it('signs with the embedded wallet signature the contract will verify', async () => {
        await send();
        const call = decodeFunctionData({
            abi: SocialLoginSmartAccount__factory.abi,
            data: node.decodeSent(0).body.clauses[0].data as `0x${string}`,
        });
        expect(call.args?.[6]).toBe(FAKE_SIGNATURE);
    });
});

describe.each(['VET', 'B3TR'] as GasTokenType[])('gas token %s', (token) => {
    it('is routed to the matching delegator endpoints', async () => {
        state.gasToken = token;
        await send();
        expect(delegatorRequests[0].path).toContain(
            `/estimate/clauses/${token.toLowerCase()}`,
        );
    });
});
