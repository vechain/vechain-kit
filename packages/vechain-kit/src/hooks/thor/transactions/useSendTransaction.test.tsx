import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
    createFakeThorNode,
    FAKE_NODE_URL,
} from '../../../../test/fakes/thorNode';
import {
    dappKitWallet,
    resetDappKitMock,
} from '../../../../test/mocks/dappKitReact';

vi.mock(
    '@vechain/dapp-kit-react',
    () => import('../../../../test/mocks/dappKitReact'),
);

const SIGNER = '0x4444444444444444444444444444444444444444';
const RECIPIENT = '0x2222222222222222222222222222222222222222';

const state = vi.hoisted(() => ({
    isConnectedWithPrivy: false,
    isInAppBrowser: false,
    feeDelegation: undefined as
        | { delegatorUrl?: string; delegateAllTransactions?: boolean }
        | undefined,
    privy: { sendTransaction: vi.fn(async () => `0x${'ee'.repeat(32)}`) },
}));

vi.mock('@/hooks/api/wallet/useWallet', () => ({
    useWallet: () => ({
        connection: {
            isConnectedWithPrivy: state.isConnectedWithPrivy,
            isConnectedWithDappKit: !state.isConnectedWithPrivy,
            isInAppBrowser: state.isInAppBrowser,
        },
    }),
}));
vi.mock('@/providers/PrivyWalletProvider', () => ({
    usePrivyWalletProvider: () => state.privy,
}));
vi.mock('@/providers/VeChainKitProvider', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useVeChainKitConfig: () => ({
        feeDelegation: state.feeDelegation,
        network: { type: 'test', nodeUrl: FAKE_NODE_URL },
    }),
}));
vi.mock('./useTxReceipt', () => ({
    useTxReceipt: () => ({ data: null, isLoading: false, error: null }),
}));

import { useSendTransaction } from './useSendTransaction';

const clauses = [{ to: RECIPIENT, value: '0x1', data: '0x' }];

beforeEach(() => {
    resetDappKitMock();
    state.isConnectedWithPrivy = false;
    state.isInAppBrowser = false;
    state.feeDelegation = undefined;
    state.privy.sendTransaction.mockClear();
    dappKitWallet.signer = {
        address: '0x9999999999999999999999999999999999999999',
    };
    createFakeThorNode().install();
});

describe('useSendTransaction with a Privy connection', () => {
    it('delegates to the smart-account provider with the UI options and delegation URL', async () => {
        state.isConnectedWithPrivy = true;
        const { result } = renderHook(() =>
            useSendTransaction({
                signerAccountAddress: SIGNER,
                privyUIOptions: {
                    title: 'T',
                    description: 'D',
                    buttonText: 'B',
                },
            }),
        );
        await act(() =>
            result.current.sendTransaction(clauses, 'https://sponsor.test/'),
        );
        expect(state.privy.sendTransaction).toHaveBeenCalledWith({
            txClauses: clauses,
            title: 'T',
            description: 'D',
            buttonText: 'B',
            delegationUrl: 'https://sponsor.test/',
        });
        expect(dappKitWallet.requestTransaction).not.toHaveBeenCalled();
        expect(result.current.error).toBeUndefined();
    });
});

describe('useSendTransaction with a dapp-kit wallet', () => {
    it('estimates gas on the node and asks the wallet to sign from the selected account', async () => {
        const { result } = renderHook(() =>
            useSendTransaction({ signerAccountAddress: SIGNER }),
        );
        await act(() => result.current.sendTransaction(clauses));

        expect(state.privy.sendTransaction).not.toHaveBeenCalled();
        expect(dappKitWallet.requestTransaction).toHaveBeenCalledTimes(1);
        const [sentClauses, options] = dappKitWallet.requestTransaction.mock
            .calls[0] as unknown as [
            unknown,
            { signer: string; gas: number; delegator?: unknown },
        ];
        expect(sentClauses).toEqual(clauses);
        expect(options.signer).toBe(SIGNER);
        expect(options.gas).toBeGreaterThan(0);
        expect(options.delegator).toBeUndefined();
    });

    it('uses the wallet signer inside the VeWorld in-app browser and honours suggestedMaxGas', async () => {
        state.isInAppBrowser = true;
        const { result } = renderHook(() =>
            useSendTransaction({
                signerAccountAddress: SIGNER,
                suggestedMaxGas: 123_456,
            }),
        );
        await act(() => result.current.sendTransaction(clauses));
        const [, options] = dappKitWallet.requestTransaction.mock
            .calls[0] as unknown as [unknown, { signer: string; gas: number }];
        expect(options.signer).toBe(
            '0x9999999999999999999999999999999999999999',
        );
        expect(options.gas).toBe(123_456);
    });

    it('attaches the dApp delegator when delegateAllTransactions is on, per-call URL winning', async () => {
        state.feeDelegation = {
            delegatorUrl: 'https://app-sponsor.test/',
            delegateAllTransactions: true,
        };
        const { result } = renderHook(() =>
            useSendTransaction({ signerAccountAddress: SIGNER }),
        );
        await act(() => result.current.sendTransaction(clauses));
        await act(() =>
            result.current.sendTransaction(clauses, 'https://override.test/'),
        );
        const delegators = dappKitWallet.requestTransaction.mock.calls.map(
            (call) =>
                (
                    call[1] as unknown as {
                        delegator?: { url: string; signer: string };
                    }
                ).delegator,
        );
        expect(delegators).toEqual([
            { url: 'https://app-sponsor.test/', signer: SIGNER },
            { url: 'https://override.test/', signer: SIGNER },
        ]);
    });

    it('reports a rejected signature through status, error and the failure callback', async () => {
        dappKitWallet.requestTransaction.mockRejectedValueOnce(
            new Error('User rejected'),
        );
        const onTxFailedOrCancelled = vi.fn();
        const { result } = renderHook(() =>
            useSendTransaction({
                signerAccountAddress: SIGNER,
                onTxFailedOrCancelled,
            }),
        );
        await act(() => result.current.sendTransaction(clauses));
        await waitFor(() => expect(result.current.status).toBe('error'));
        expect(onTxFailedOrCancelled).toHaveBeenCalledWith(expect.any(Error));
        expect(result.current.error?.reason).toContain('User rejected');
    });

    it('requires a signer address', async () => {
        const { result } = renderHook(() =>
            useSendTransaction({ signerAccountAddress: undefined }),
        );
        await act(() => result.current.sendTransaction(clauses));
        await waitFor(() => expect(result.current.status).toBe('error'));
        expect(dappKitWallet.requestTransaction).not.toHaveBeenCalled();
    });
});
