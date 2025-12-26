import React, { useCallback, useRef, useState } from 'react';
import { toPrivyWalletConnector } from '@privy-io/cross-app-connect/rainbow-kit';
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
import {
    MAINNET_EXPLORER_URL,
    PRIVY_VECHAIN_CONNECTOR_ICON_URL,
    THOR_MAINNET_URLS,
    VECHAINSTATS_URL,
} from '@/utils/urls';

export const vechain = defineChain({
    id: '1176455790972829965191905223412607679856028701100105089447013101863' as unknown as number,
    name: 'Vechain',
    nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
    rpcUrls: {
        default: {
            http: [THOR_MAINNET_URLS[0]],
        },
    },
    blockExplorers: {
        default: {
            name: 'Vechain Explorer',
            url: MAINNET_EXPLORER_URL,
        },
        vechainStats: {
            name: 'Vechain Stats',
            url: VECHAINSTATS_URL,
        },
    },
});

export const vechainConnector = () => {
    return toPrivyWalletConnector({
        id: VECHAIN_PRIVY_APP_ID,
        name: 'VeChain',
        iconUrl:
            PRIVY_VECHAIN_CONNECTOR_ICON_URL,
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
        async (appID: string) => {
            try {
                setIsConnecting(true);
                setConnectionError(null);

                const connector = connectors.find(
                    (c) => c.id === (appID || VECHAIN_PRIVY_APP_ID),
                );

                if (!connector) {
                    throw new Error('Connector not found');
                }

                const result = await connectAsync({ connector });

                return result;
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
