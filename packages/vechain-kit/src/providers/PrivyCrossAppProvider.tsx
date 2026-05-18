import React, { useCallback, useRef, useState } from 'react';
import { toPrivyWalletConnector } from '@privy-io/cross-app-connect/rainbow-kit';
import { createPrivyCrossAppClient } from '@privy-io/cross-app-connect';
import {
    useConnect,
    useDisconnect,
    createConfig,
    useSignMessage,
    useSignTypedData,
    WagmiProvider,
    http,
    useAccount,
} from 'wagmi';
import { SignTypedDataParameters } from '@wagmi/core';
import { VECHAIN_PRIVY_APP_ID } from '../utils';
import { defineChain } from 'viem';
import { handlePopupError } from '@/utils/handlePopupError';
import { isBrowser } from '@/utils/ssrUtils';
import i18n from '../../i18n';
import {
    VECHAIN_EXPLORER_BASE_URL,
    VECHAIN_MAINNET_NODE_BASE_URL,
    VECHAINSTATS_BASE_URL,
} from '@/constants';

/**
 * Login methods that requester apps can pre-select on the whitelabel
 * cross-app-connect host. When passed, the host skips its provider picker
 * and jumps straight into the matching flow.
 *
 * Matches the providers enabled in VeChain's Privy dashboard. Email is
 * intentionally excluded -- VeChain has email disabled, so the host
 * doesn't surface it. Farcaster is included but currently shows a
 * "coming soon" placeholder on the host (SIWF flow not yet wired).
 */
export type CrossAppLoginIntent =
    | 'google'
    | 'apple'
    | 'twitter'
    | 'discord'
    | 'github'
    | 'tiktok'
    | 'line'
    | 'phone'
    | 'farcaster';

export type LoginWithCrossAppOptions = {
    /** Pre-select a login method on the provider's connect page. */
    intent?: CrossAppLoginIntent;
};

/**
 * Append the params our whitelabel cross-app-connect host understands:
 *  - `intent`: pre-selects an OAuth provider on the picker.
 *  - `lng`:    language code so the popup renders in the same locale as
 *              the kit-using app. The host falls back to navigator/locale
 *              if absent.
 *
 * Privy's SDK fixes the transact URL (can't append params there), so the
 * host stashes whatever it sees on the connect popup in localStorage and
 * the transact popup re-reads it.
 */
const appendCrossAppParams = (
    url: string,
    params: { intent?: CrossAppLoginIntent; lng?: string },
) => {
    const parsed = new URL(url);
    if (params.intent) parsed.searchParams.set('intent', params.intent);
    if (params.lng) parsed.searchParams.set('lng', params.lng);
    return parsed.toString();
};

const resolveProviderConnectUrl = async (appID: string) => {
    const client = createPrivyCrossAppClient({
        providerAppId: appID,
        chains: [vechain],
    });
    return client.getProviderConnectUrl();
};

export const vechain = defineChain({
    id: '1176455790972829965191905223412607679856028701100105089447013101863' as unknown as number,
    name: 'Vechain',
    nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
    rpcUrls: {
        default: {
            http: [VECHAIN_MAINNET_NODE_BASE_URL],
        },
    },
    blockExplorers: {
        default: {
            name: 'Vechain Explorer',
            url: VECHAIN_EXPLORER_BASE_URL,
        },
        vechainStats: {
            name: 'Vechain Stats',
            url: VECHAINSTATS_BASE_URL,
        },
    },
});

export const vechainConnector = () => {
    return toPrivyWalletConnector({
        id: VECHAIN_PRIVY_APP_ID,
        name: 'VeChain',
        iconUrl:
            'https://imagedelivery.net/oHBRUd2clqykxgDWmeAyLg/661dd77c-2f9d-40e7-baa1-f4e24fd7bf00/icon',
        smartWalletMode: false,
    });
};

interface PrivyCrossAppProviderProps {
    privyEcosystemAppIDS: string[];
    children: React.ReactNode;
}

export const PrivyCrossAppProvider = ({
    privyEcosystemAppIDS,
    children,
}: PrivyCrossAppProviderProps) => {
    // Use useRef to store the config to prevent recreation on re-renders
    const wagmiConfigRef = useRef(
        createConfig({
            chains: [vechain],
            ssr: true,
            connectors: [
                vechainConnector(),
                ...privyEcosystemAppIDS.map((appId) =>
                    toPrivyWalletConnector({
                        id: appId,
                        name: '',
                        iconUrl: '',
                    }),
                ),
            ],
            transports: { [vechain.id]: http() },
            multiInjectedProviderDiscovery: false,
        }),
    );

    return (
        <WagmiProvider config={wagmiConfigRef.current}>
            {children}
        </WagmiProvider>
    );
};

export const usePrivyCrossAppSdk = () => {
    const { connectAsync, connectors } = useConnect();
    const { signTypedDataAsync } = useSignTypedData();
    const { signMessageAsync } = useSignMessage();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();

    // Add local state to track connection
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<Error | null>(null);

    const logout = useCallback(async () => {
        try {
            if (isConnected) {
                await disconnectAsync();
                // Force a state update after disconnect
                if (isBrowser()) {
                    window.dispatchEvent(new Event('wallet_disconnected'));
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }, [disconnectAsync, isConnected]);

    const login = useCallback(
        async (appID: string, options?: LoginWithCrossAppOptions) => {
            try {
                setIsConnecting(true);
                setConnectionError(null);

                const resolvedAppId = appID || VECHAIN_PRIVY_APP_ID;

                // Pull the kit's current language so the whitelabel cross-app
                // host renders the popup in the same locale. The host then
                // stashes it in its own localStorage so the transact popup
                // (whose URL is built by Privy's SDK and not editable from
                // the kit) reads the same value.
                const lng = i18n.language;

                if (options?.intent || lng) {
                    // Resolve the registered whitelabel connect URL via the
                    // Privy backend and append params. This avoids hardcoding
                    // the whitelabel domain in the kit.
                    const baseUrl = await resolveProviderConnectUrl(
                        resolvedAppId,
                    );
                    const overrideConnectUrl = appendCrossAppParams(baseUrl, {
                        intent: options?.intent,
                        lng,
                    });
                    const customConnector = toPrivyWalletConnector({
                        id: resolvedAppId,
                        name:
                            resolvedAppId === VECHAIN_PRIVY_APP_ID
                                ? 'VeChain'
                                : '',
                        iconUrl: '',
                        overrideConnectUrl,
                    });
                    return await connectAsync({ connector: customConnector });
                }

                const connector = connectors.find(
                    (c) => c.id === resolvedAppId,
                );
                if (!connector) {
                    throw new Error('Connector not found');
                }

                return await connectAsync({ connector });
            } catch (error) {
                setConnectionError(error as Error);
                throw error;
            } finally {
                setIsConnecting(false);
            }
        },
        [connectAsync, connectors],
    );

    // Keep the other methods unchanged
    const signMessage = useCallback(
        async (message: string) => {
            try {
                return await signMessageAsync({ message });
            } catch (error) {
                throw handlePopupError({
                    error,
                    mobileBrowserPopupMessage:
                        "Your mobile browser blocked the signing window. Please click 'Try again' to open the signing window or change your browser settings.",
                    rejectedMessage: 'Signing request was cancelled.',
                    defaultMessage:
                        'An unexpected issue occurred while signing a message. Please try again or contact support.',
                });
            }
        },
        [signMessageAsync],
    );

    const signTypedData = useCallback(
        async (data: SignTypedDataParameters) => {
            try {
                return await signTypedDataAsync(data);
            } catch (error) {
                const errorType = handlePopupError({
                    error,
                    mobileBrowserPopupMessage:
                        "Your mobile browser blocked the signing window. Please click 'Try again' to open the signing window or change your browser settings.",
                    rejectedMessage: 'Signing request was cancelled.',
                    defaultMessage:
                        'An unexpected issue occurred while signing typed data. Please try again or contact support.',
                });
                throw errorType;
            }
        },
        [signTypedDataAsync],
    );

    return {
        login,
        logout,
        signMessage,
        signTypedData,
        isConnecting,
        connectionError,
    };
};
