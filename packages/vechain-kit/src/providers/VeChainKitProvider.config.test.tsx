import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
    privyProviderRenders,
    resetPrivyMock,
} from '../../test/mocks/privyReactAuth';
import {
    dappKitProviderRenders,
    resetDappKitMock,
} from '../../test/mocks/dappKitReact';
import { createFakeThorNode } from '../../test/fakes/thorNode';
import { getConfig } from '@/config';
import {
    DEFAULT_PRIVY_ECOSYSTEM_APPS,
    getGenericDelegatorUrl,
    VECHAIN_PRIVY_APP_ID,
} from '@/utils/constants';

vi.mock(
    '@privy-io/react-auth',
    () => import('../../test/mocks/privyReactAuth'),
);
vi.mock(
    '@vechain/dapp-kit-react',
    () => import('../../test/mocks/dappKitReact'),
);

const walletProvider = vi.hoisted(() => ({
    renders: [] as Array<Record<string, unknown>>,
}));
vi.mock('./PrivyWalletProvider', () => ({
    PrivyWalletProvider: (props: { children?: React.ReactNode }) => {
        walletProvider.renders.push(props);
        return <>{props.children}</>;
    },
    usePrivyWalletProvider: () => ({}),
}));

import {
    useVeChainKitConfig,
    VeChainKitProvider,
    type VeChainKitConfig,
    type VechainKitProviderProps,
} from './VeChainKitProvider';

let config: VeChainKitConfig | undefined;
const Probe = () => {
    config = useVeChainKitConfig();
    return null;
};

const mount = (props: Omit<VechainKitProviderProps, 'children'> = {}) =>
    render(
        <VeChainKitProvider {...props}>
            <Probe />
        </VeChainKitProvider>,
    );

const lastPrivy = () =>
    privyProviderRenders.at(-1) as {
        appId: string;
        clientId: string;
        config: Record<string, any>;
    };
const lastDappKit = () => dappKitProviderRenders.at(-1) as Record<string, any>;
const lastWalletProvider = () =>
    walletProvider.renders.at(-1) as Record<string, any>;

const privy: NonNullable<VechainKitProviderProps['privy']> = {
    appId: 'app-id',
    clientId: 'client-id',
    loginMethods: [
        'google',
        'apple',
        'twitter',
        'farcaster',
        'email',
        'discord',
    ],
    appearance: {
        loginMessage: 'Welcome',
        logo: 'https://logo.test/l.png',
        accentColor: '#123456',
    },
    embeddedWallets: { createOnLogin: 'users-without-wallets' },
    customOAuthRedirectUrl: 'myapp://oauth',
};

beforeEach(() => {
    resetPrivyMock();
    resetDappKitMock();
    walletProvider.renders.length = 0;
    config = undefined;
    window.localStorage.clear();
    createFakeThorNode().install();
});
afterEach(() => vi.unstubAllGlobals());

describe('VeChainKitProvider -> PrivyProvider', () => {
    it('maps the privy prop onto the Privy client config', () => {
        mount({ privy, darkMode: true });
        const { appId, clientId, config: privyConfig } = lastPrivy();
        expect(appId).toBe('app-id');
        expect(clientId).toBe('client-id');
        expect(privyConfig.loginMethodsAndOrder).toEqual({
            primary: ['google', 'apple', 'twitter', 'farcaster'],
            overflow: ['email', 'discord'],
        });
        expect(privyConfig.appearance).toEqual({
            theme: 'dark',
            accentColor: '#123456',
            loginMessage: 'Welcome',
            logo: 'https://logo.test/l.png',
        });
        expect(privyConfig.externalWallets).toEqual({
            walletConnect: { enabled: false },
        });
        expect(privyConfig.passkeys).toEqual({
            shouldUnlinkOnUnenrollMfa: false,
        });
        expect(privyConfig.customOAuthRedirectUrl).toBe('myapp://oauth');
    });

    it('places createOnLogin where the installed Privy version reads it', () => {
        mount({ privy });
        expect(lastPrivy().config.embeddedWallets).toEqual({
            ethereum: { createOnLogin: 'users-without-wallets' },
        });
        mount({ privy: { ...privy, embeddedWallets: undefined } });
        expect(lastPrivy().config.embeddedWallets).toEqual({
            ethereum: { createOnLogin: 'all-users' },
        });
    });

    it("falls back to VeChain's Privy app and a theme-derived accent colour without a privy prop", () => {
        mount();
        const { appId, clientId, config: privyConfig } = lastPrivy();
        expect(appId).toBe(VECHAIN_PRIVY_APP_ID);
        expect(clientId).toBe('');
        expect(privyConfig.loginMethodsAndOrder).toEqual({
            primary: [],
            overflow: [],
        });
        expect(privyConfig.appearance.theme).toBe('light');
        expect(privyConfig.appearance.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(privyConfig.embeddedWallets).toEqual({
            ethereum: { createOnLogin: 'all-users' },
        });
    });
});

describe('VeChainKitProvider -> DAppKitProvider', () => {
    it('uses the network default node and sensible defaults', () => {
        mount({ network: { type: 'test' } });
        expect(lastDappKit()).toMatchObject({
            node: getConfig('test').nodeUrl,
            alwaysShowConnect: true,
            v2Api: { enabled: true, external: false },
            usePersistence: true,
            allowedWallets: ['veworld'],
            themeMode: 'LIGHT',
            language: 'en',
        });
        expect(lastDappKit().walletConnectOptions).toBeUndefined();
    });

    it('passes through consumer dapp-kit options and the node override', () => {
        const onSourceClick = vi.fn();
        const walletConnectOptions = {
            projectId: 'wc',
            metadata: { name: 'x', description: '', url: '', icons: [] },
        };
        mount({
            darkMode: true,
            language: 'it',
            network: { type: 'main', nodeUrl: 'https://node.override' },
            dappKit: {
                allowedWallets: ['veworld', 'wallet-connect'],
                walletConnectOptions,
                usePersistence: false,
                logLevel: 'DEBUG',
                onSourceClick,
                v2Api: { enabled: false, external: true },
                themeVariables: { '--vdk-color-primary': 'red' } as never,
            },
        });
        const props = lastDappKit();
        expect(props).toMatchObject({
            node: 'https://node.override',
            allowedWallets: ['veworld', 'wallet-connect'],
            walletConnectOptions,
            usePersistence: false,
            logLevel: 'DEBUG',
            onSourceClick,
            v2Api: { enabled: false, external: true },
            themeMode: 'DARK',
            language: 'it',
        });
        expect(props.themeVariables['--vdk-color-primary']).toBe('red');
        expect(Object.keys(props.themeVariables).length).toBeGreaterThan(1);
    });
});

describe('VeChainKitProvider -> PrivyWalletProvider (fee delegation)', () => {
    it('defaults to the generic delegator of the stored network when no strategy is configured', () => {
        window.localStorage.setItem('vechain-kit:network', 'main');
        mount();
        expect(getGenericDelegatorUrl()).toMatch(/^https:\/\/mainnet\./);
        expect(lastWalletProvider()).toMatchObject({
            nodeUrl: getConfig('main').nodeUrl,
            delegatorUrl: getGenericDelegatorUrl(),
            delegateAllTransactions: false,
            genericDelegator: true,
        });
        expect(config?.feeDelegation).toEqual({
            genericDelegatorUrl: getGenericDelegatorUrl(),
        });
    });

    it('prefers a dApp-sponsored delegator over the generic one', () => {
        mount({
            feeDelegation: {
                delegatorUrl: 'https://sponsor.test',
                genericDelegatorUrl: 'https://generic.test/api/v1/',
                delegateAllTransactions: true,
            },
        });
        expect(lastWalletProvider()).toMatchObject({
            delegatorUrl: 'https://sponsor.test',
            delegateAllTransactions: true,
            genericDelegator: false,
        });
    });

    it('routes through the generic delegator when only that is set', () => {
        mount({
            feeDelegation: {
                genericDelegatorUrl: 'https://generic.test/api/v1/',
            },
        });
        expect(lastWalletProvider()).toMatchObject({
            delegatorUrl: 'https://generic.test/api/v1/',
            genericDelegator: true,
        });
    });
});

describe('VeChainKitProvider config context', () => {
    it('exposes defaults for an opt-out (no Privy) integration', () => {
        mount();
        expect(config).toMatchObject({
            privy: undefined,
            loginMethods: [{ method: 'veworld', gridColumn: 4 }],
            dappKit: { allowedWallets: ['veworld'] },
            darkMode: false,
            network: { type: 'main', nodeUrl: getConfig('main').nodeUrl },
            allowCommunityTokens: false,
            hiddenQuickActions: [],
            currentCurrency: 'usd',
            currentLanguage: 'en',
            privyEcosystemAppIDS: DEFAULT_PRIVY_ECOSYSTEM_APPS.map(
                (app) => app.id,
            ),
        });
        expect(config?.appConfig).toEqual(getConfig('main'));
    });

    it('seeds Privy-era login methods and applies contract address overrides', () => {
        mount({
            privy,
            network: { type: 'solo' },
            contractAddresses: {
                b3trContractAddress:
                    '0x000000000000000000000000000000000000b3b3',
            },
            loginMethods: [
                { method: 'ecosystem', allowedApps: ['app-a'] },
                { method: 'vechain' },
            ],
        });
        expect(config?.privyEcosystemAppIDS).toEqual(['app-a']);
        expect(config?.appConfig.b3trContractAddress).toBe(
            '0x000000000000000000000000000000000000b3b3',
        );
        expect(config?.appConfig.vot3ContractAddress).toBe(
            getConfig('solo').vot3ContractAddress,
        );

        mount({ privy });
        expect(config?.loginMethods?.map((m) => m.method)).toEqual([
            'veworld',
            'google',
            'apple',
            'more',
        ]);
    });

    it('rejects configurations the kit cannot run with', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const swallow = (e: ErrorEvent) => e.preventDefault();
        window.addEventListener('error', swallow);
        expect(() => mount({ network: { type: 'devnet' } })).toThrow(
            'network.type must be either "main", "test" or "solo"',
        );
        expect(() =>
            mount({
                loginMethods: [{ method: 'email' }, { method: 'passkey' }],
            }),
        ).toThrow(
            'Login methods "email", "passkey" require Privy configuration',
        );
        expect(() =>
            mount({
                legalDocuments: {
                    termsAndConditions: [
                        { url: 'not a url', version: 1, required: true },
                    ],
                },
            }),
        ).toThrow(
            'legalDocuments.termsAndConditions.url is invalid: not a url',
        );
        window.removeEventListener('error', swallow);
    });
});
