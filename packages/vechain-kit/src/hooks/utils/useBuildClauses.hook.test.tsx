import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { decodeFunctionData, erc20Abi } from 'viem';
import type { TransactionClause } from '@vechain/sdk-core';
import {
    SocialLoginSmartAccount__factory,
    SocialLoginSmartAccountFactory__factory,
} from '@vechain/vechain-contract-types';
import {
    FAKE_SIGNATURE,
    privyMocks,
    resetPrivyMock,
} from '../../../test/mocks/privyReactAuth';
import { getConfig } from '@/config';

vi.mock(
    '@privy-io/react-auth',
    () => import('../../../test/mocks/privyReactAuth'),
);

const OWNER = '0x4444444444444444444444444444444444444444';
const SMART_ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECIPIENT = '0x2222222222222222222222222222222222222222';
const TOKEN = '0x3333333333333333333333333333333333333333';
const CHAIN_ID = getConfig('test').network.genesis.id;
const CROSS_APP_SIGNATURE = `0x${'cd'.repeat(64)}1c`;

const state = vi.hoisted(() => ({
    isConnectedWithCrossApp: false,
    crossAppSignTypedData: vi.fn(
        async (_data: unknown) => `0x${'cd'.repeat(64)}1c`,
    ),
}));

vi.mock('@/hooks/api/wallet/useWallet', () => ({
    useWallet: () => ({
        connection: { isConnectedWithCrossApp: state.isConnectedWithCrossApp },
        connectedWallet: {
            address: '0x4444444444444444444444444444444444444444',
        },
    }),
}));
vi.mock('@/hooks/thor/blocks/useGetChainId', () => ({
    useGetChainId: () => ({ data: CHAIN_ID }),
    getChainIdQueryKey: () => ['VECHAIN_KIT_CHAIN_ID'],
}));
vi.mock('@/providers/VeChainKitProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useVeChainKitConfig: () => ({ network: { type: 'test' } }),
}));
vi.mock('@/providers/PrivyCrossAppProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    usePrivyCrossAppSdk: () => ({ signTypedData: state.crossAppSignTypedData }),
}));

import { useBuildClauses } from './useBuildClauses';

const vetClause: TransactionClause = {
    to: RECIPIENT,
    value: '0x1',
    data: '0x',
    comment: 'send VET',
} as TransactionClause;
const erc20Clause = {
    to: TOKEN,
    value: 0,
    data: { abi: erc20Abi, functionName: 'transfer', args: [RECIPIENT, 5n] },
} as unknown as TransactionClause;

const build = (
    params: Partial<
        Parameters<
            ReturnType<typeof useBuildClauses>['buildClausesWithAuth']
        >[0]
    >,
) => {
    const { result } = renderHook(() => useBuildClauses());
    return result.current.buildClausesWithAuth({
        clauses: [vetClause, erc20Clause],
        smartAccount: { address: SMART_ACCOUNT, isDeployed: true },
        version: 3,
        ...params,
    });
};

const decodeAccountCall = (clause: { data?: unknown }) =>
    decodeFunctionData({
        abi: SocialLoginSmartAccount__factory.abi,
        data: clause.data as `0x${string}`,
    });
const decodeFactoryCall = (clause: { data?: unknown }) =>
    decodeFunctionData({
        abi: SocialLoginSmartAccountFactory__factory.abi,
        data: clause.data as `0x${string}`,
    });

beforeEach(() => {
    resetPrivyMock();
    state.isConnectedWithCrossApp = false;
    state.crossAppSignTypedData.mockClear();
});

describe('useBuildClauses on a v3 smart account', () => {
    it('wraps every clause in one executeBatchWithAuthorization signed by the embedded wallet', async () => {
        const clauses = await build({
            title: 'Pay',
            description: 'Pay 1 VET',
            buttonText: 'Go',
        });

        expect(clauses).toHaveLength(1);
        expect(clauses[0].to?.toLowerCase()).toBe(SMART_ACCOUNT);
        const call = decodeAccountCall(clauses[0]);
        expect(call.functionName).toBe('executeBatchWithAuthorization');
        const [to, value, data, validAfter, , , signature] =
            call.args as readonly unknown[];
        expect(to).toEqual([RECIPIENT, TOKEN]);
        expect(value).toEqual([1n, 0n]);
        expect(data).toEqual([
            '0x',
            '0xa9059cbb000000000000000000000000' +
                RECIPIENT.slice(2) +
                '0000000000000000000000000000000000000000000000000000000000000005',
        ]);
        expect(validAfter).toBe(0n);
        expect(signature).toBe(FAKE_SIGNATURE);

        expect(privyMocks.signTypedData).toHaveBeenCalledTimes(1);
        const [typedData, options] = privyMocks.signTypedData.mock.calls[0] as [
            { domain: Record<string, unknown>; primaryType: string },
            { uiOptions: Record<string, unknown> },
        ];
        expect(typedData.primaryType).toBe('ExecuteBatchWithAuthorization');
        expect(typedData.domain).toMatchObject({
            chainId: CHAIN_ID,
            verifyingContract: SMART_ACCOUNT,
        });
        expect(options.uiOptions).toEqual({
            title: 'Pay',
            description: 'Pay 1 VET',
            buttonText: 'Go',
        });
    });

    it('deploys the smart account first when it has no code yet', async () => {
        const clauses = await build({
            smartAccount: { address: SMART_ACCOUNT, isDeployed: false },
        });

        expect(clauses).toHaveLength(2);
        expect(clauses[0].to?.toLowerCase()).toBe(
            getConfig('test').accountFactoryAddress.toLowerCase(),
        );
        expect(decodeFactoryCall(clauses[0])).toEqual({
            functionName: 'createAccount',
            args: [OWNER],
        });
        expect(decodeAccountCall(clauses[1]).functionName).toBe(
            'executeBatchWithAuthorization',
        );
    });

    it('treats an unknown version as v3', async () => {
        const clauses = await build({ version: undefined });
        expect(decodeAccountCall(clauses[0]).functionName).toBe(
            'executeBatchWithAuthorization',
        );
    });

    it('signs through the cross-app SDK with the connected wallet address when connected cross-app', async () => {
        state.isConnectedWithCrossApp = true;
        const clauses = await build({});

        expect(privyMocks.signTypedData).not.toHaveBeenCalled();
        expect(state.crossAppSignTypedData).toHaveBeenCalledTimes(1);
        const [request] = state.crossAppSignTypedData.mock.calls[0] as [
            Record<string, unknown>,
        ];
        expect(request.address).toBe(OWNER);
        expect(request.primaryType).toBe('ExecuteBatchWithAuthorization');
        const [, , , , , , signature] = decodeAccountCall(clauses[0])
            .args as readonly unknown[];
        expect(signature).toBe(CROSS_APP_SIGNATURE);
    });
});

describe('useBuildClauses on a legacy (v1) smart account', () => {
    it('signs and wraps each clause separately with executeWithAuthorization', async () => {
        const clauses = await build({ version: 1, title: 'Legacy' });

        expect(clauses).toHaveLength(2);
        expect(privyMocks.signTypedData).toHaveBeenCalledTimes(2);
        for (const [index, target] of [RECIPIENT, TOKEN].entries()) {
            expect(clauses[index].to?.toLowerCase()).toBe(SMART_ACCOUNT);
            const call = decodeAccountCall(clauses[index]);
            expect(call.functionName).toBe('executeWithAuthorization');
            expect(call.args?.[0]).toBe(target);
            expect(call.args?.[5]).toBe(FAKE_SIGNATURE);
            const [typedData] = privyMocks.signTypedData.mock.calls[index] as [
                { primaryType: string },
            ];
            expect(typedData.primaryType).toBe('ExecuteWithAuthorization');
        }
    });

    it('describes each signature request from the clause comment, then the function name', async () => {
        await build({ version: 1 });
        const descriptions = privyMocks.signTypedData.mock.calls.map(
            (call) =>
                (call[1] as { uiOptions: { description: string } }).uiOptions
                    .description,
        );
        expect(descriptions).toEqual(['send VET', 'transfer']);
    });

    it('prepends createAccount for an undeployed legacy account', async () => {
        const clauses = await build({
            version: 2,
            smartAccount: { address: SMART_ACCOUNT, isDeployed: false },
        });
        expect(clauses).toHaveLength(3);
        expect(decodeFactoryCall(clauses[0]).functionName).toBe(
            'createAccount',
        );
    });
});
