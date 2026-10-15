import React from 'react';
import { ThorClient } from '@vechain/sdk-network';
import { vi } from 'vitest';
import { FAKE_NODE_URL } from '../fakes/thorNode';

// Fake `@vechain/dapp-kit-react`: use via vi.mock('@vechain/dapp-kit-react', () => import(<this file>)).

export const dappKitProviderRenders: Array<Record<string, unknown>> = [];

export const dappKitWallet = {
    account: null as string | null,
    accounts: [] as string[],
    source: null as string | null,
    signer: undefined as unknown,
    connect: vi.fn(async () => ({ account: '', verified: false })),
    disconnect: vi.fn(async () => {}),
    setActiveAccount: vi.fn(),
    requestTransaction: vi.fn(
        async (_clauses: unknown, _options?: unknown) => ({
            txid: '0x' + '11'.repeat(32),
        }),
    ),
    signTypedData: vi.fn(async () => '0xsigned'),
};

export const resetDappKitMock = () => {
    dappKitProviderRenders.length = 0;
    dappKitWallet.account = null;
    dappKitWallet.accounts = [];
    dappKitWallet.source = null;
    dappKitWallet.signer = undefined;
    for (const v of Object.values(dappKitWallet))
        if (typeof v === 'function')
            (v as ReturnType<typeof vi.fn>).mockClear();
};

export const DAppKitProvider = (
    props: { children?: React.ReactNode; node?: string } & Record<
        string,
        unknown
    >,
) => {
    dappKitProviderRenders.push(props);
    return <>{props.children}</>;
};

export const useThor = () => ThorClient.at(FAKE_NODE_URL);
export const useWallet = () => dappKitWallet;
export const useWalletModal = () => ({
    open: vi.fn(),
    close: vi.fn(),
    onConnectionStatusChange: vi.fn(),
});
