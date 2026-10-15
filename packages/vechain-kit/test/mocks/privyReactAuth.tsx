import React from 'react';
import { vi } from 'vitest';

// Fake `@privy-io/react-auth` (only the surface the kit imports): use via vi.mock(..., () => import(<this file>)).

export const FAKE_SIGNATURE = `0x${'ab'.repeat(64)}1b`;

export const privyState: {
    ready: boolean;
    authenticated: boolean;
    user: unknown;
} = { ready: true, authenticated: false, user: null };

export const privyMocks = {
    signTypedData: vi.fn(async (_data: unknown, _opts?: unknown) => ({
        signature: FAKE_SIGNATURE,
    })),
    signMessage: vi.fn(async (_args: unknown) => ({
        signature: FAKE_SIGNATURE,
    })),
    exportWallet: vi.fn(async () => {}),
    logout: vi.fn(async () => {}),
    login: vi.fn(),
    linkPasskey: vi.fn(),
    initOAuth: vi.fn(async () => {}),
};

export const privyProviderRenders: Array<Record<string, unknown>> = [];

export const resetPrivyMock = () => {
    privyState.ready = true;
    privyState.authenticated = false;
    privyState.user = null;
    privyProviderRenders.length = 0;
    for (const fn of Object.values(privyMocks)) fn.mockClear();
};

export const PrivyProvider = (
    props: { children?: React.ReactNode } & Record<string, unknown>,
) => {
    privyProviderRenders.push(props);
    return <>{props.children}</>;
};

export const usePrivy = () => ({ ...privyState, ...privyMocks });

export const useLoginWithOAuth = () => ({
    loading: false,
    initOAuth: privyMocks.initOAuth,
    state: { status: 'initial' },
});

export const useLoginWithEmail = () => ({
    sendCode: vi.fn(async () => {}),
    loginWithCode: vi.fn(async () => {}),
    state: { status: 'initial' },
});

export const useLoginWithPasskey = () => ({
    loginWithPasskey: vi.fn(async () => {}),
    state: { status: 'initial' },
});

export const useCreateWallet = () => ({ createWallet: vi.fn(async () => {}) });
export const useMfaEnrollment = () => ({ showMfaEnrollmentModal: vi.fn() });
export const useSetWalletRecovery = () => ({ setWalletRecovery: vi.fn() });
export const useWallets = () => ({ wallets: [], ready: true });
