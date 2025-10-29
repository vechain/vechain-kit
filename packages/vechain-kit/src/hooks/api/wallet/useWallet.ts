'use client';

import {
    Wallet as PrivyWallet,
    useLoginWithOAuth,
    usePrivy,
    User,
} from '@privy-io/react-auth';
import {
    useGetChainId,
    useGetNodeUrl,
    useGetAccountVersion,
    useDAppKitWallet,
    useSmartAccount,
    useGasTokenSelection,
    useCrossAppConnectionCache,
} from '@/hooks';
import { compareAddresses, VECHAIN_PRIVY_APP_ID } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useState } from 'react';
import { useWalletMetadata } from './useWalletMetadata';
import { isBrowser } from '@/utils/ssrUtils';

export type UseWalletReturnType = {
    // This will be the smart account if connected with privy, otherwise it will be wallet connected with dappkit
    account: Wallet;

    // The wallet in use between dappKitWallet, embeddedWallet and crossAppWallet
    connectedWallet: Wallet;

    // Every user connected with privy has one
    smartAccount: SmartAccount;

    // Privy user if user is connected with privy
    privyUser: User | null;

    // Connection status
    connection: {
        isConnected: boolean;
        isLoading: boolean;
        isConnectedWithSocialLogin: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossApp: boolean;
        isConnectedWithPrivy: boolean;
        isConnectedWithVeChain: boolean;
        source: ConnectionSource;
        isInAppBrowser: boolean;
        nodeUrl: string;
        delegatorUrl?: string;
        chainId?: string;
        network: NETWORK_TYPE;
    };

    // Disconnect function
    disconnect: () => Promise<void>;
};

export const useWallet = (): UseWalletReturnType => {
    const {
        address: crossAppAddress,
        isConnected: isConnectedWithCrossApp,
        isConnecting: isConnectingWithCrossApp,
        isReconnecting: isReconnectingWithCrossApp,
    } = useAccount();
    const { logout: disconnectCrossApp } = usePrivyCrossAppSdk();
    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});
    const { feeDelegation, network, privy } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDAppKitWallet();
    const { resetToDefaults } = useGasTokenSelection();
    const { getConnectionCache, clearConnectionCache } =
        useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();

    const nodeUrl = useGetNodeUrl();

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithSocialLogin = authenticated && !!user;
    const isConnectedWithPrivy =
        isConnectedWithSocialLogin || isConnectedWithCrossApp;

    const isConnectedWithVeChain =
        (isConnectedWithSocialLogin && privy?.appId === VECHAIN_PRIVY_APP_ID) ||
        (isConnectedWithCrossApp &&
            connectionCache?.ecosystemApp?.appId === VECHAIN_PRIVY_APP_ID);

    const isLoading =
        isConnectingWithCrossApp ||
        isReconnectingWithCrossApp ||
        isLoadingLoginOAuth ||
        !ready;

    // Add a single connection state that considers all factors
    const [isConnected, setIsConnected] = useState(false);

    // Connection type
    const connectionSource: ConnectionSource = isConnectedWithCrossApp
        ? {
              type: 'privy-cross-app',
              displayName: 'Ecosystem',
          }
        : isConnectedWithDappKit
        ? {
              type: 'wallet',
              displayName: 'Wallet',
          }
        : {
              type: 'privy',
              displayName: 'Social Login',
          };

    useEffect(() => {
        const isNowConnected =
            isConnectedWithDappKit ||
            isConnectedWithSocialLogin ||
            isConnectedWithCrossApp;

        if (isConnected !== isNowConnected) {
            setIsConnected(isNowConnected);

            // Only clear cache and dispatch event when disconnecting
            if (!isNowConnected) {
                // Clear any cached wallet data
                clearConnectionCache();
                // Dispatch event to trigger re-renders
                if (isBrowser()) {
                    window.dispatchEvent(new Event('wallet_disconnected'));
                }
            }
        }
    }, [
        isConnectedWithDappKit,
        isConnectedWithSocialLogin,
        isConnectedWithCrossApp,
        clearConnectionCache,
        isConnected,
    ]);

    // Get embedded wallet
    const privyEmbeddedWallet = user?.linkedAccounts?.find(
        (account) =>
            account.type === 'wallet' && account.connectorType === 'embedded',
    ) as PrivyWallet;
    const privyEmbeddedWalletAddress = privyEmbeddedWallet?.address;

    // Get connected and selected accounts
    const connectedWalletAddress = isConnectedWithDappKit
        ? dappKitAccount
        : isConnectedWithCrossApp
        ? crossAppAddress
        : privyEmbeddedWalletAddress;

    // Get smart account
    const { data: smartAccount } = useSmartAccount(connectedWalletAddress);

    // TODO: here we will need to check if the owner of the wallet owns a smart account
    const activeAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount?.address;

    const activeAccountMetadata = useWalletMetadata(
        activeAddress ?? '',
        network.type,
    );

    const connectedMetadata = useWalletMetadata(
        connectedWalletAddress ?? '',
        network.type,
    );
    const smartAccountMetadata = useWalletMetadata(
        smartAccount?.address ?? '',
        network.type,
    );

    const account = activeAddress
        ? {
              address: activeAddress,
              domain: activeAccountMetadata.domain,
              image: activeAccountMetadata.image,
              isLoadingMetadata: activeAccountMetadata.isLoading,
              metadata: activeAccountMetadata.records,
          }
        : null;

    const connectedWallet = connectedWalletAddress
        ? {
              address: connectedWalletAddress,
              domain: connectedMetadata.domain,
              image: connectedMetadata.image,
              isLoadingMetadata: connectedMetadata.isLoading,
              metadata: connectedMetadata.records,
          }
        : null;

    // Get smart account version
    const { data: smartAccountVersion } = useGetAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );

    const hasActiveSmartAccount =
        !!smartAccount?.address &&
        !!account?.address &&
        compareAddresses(smartAccount?.address, account?.address);

    // Modify the disconnect function to ensure state updates
    const disconnect = useCallback(async () => {
        try {
            // First set connection state to false
            setIsConnected(false);

            // Then perform disconnection logic
            if (isConnectedWithDappKit) {
                dappKitDisconnect();
            } else if (isConnectedWithSocialLogin) {
                await resetToDefaults();
                await logout();
            } else if (isConnectedWithCrossApp) {
                await resetToDefaults();
                await disconnectCrossApp();
            }

            clearConnectionCache();
            if (isBrowser()) {
                window.dispatchEvent(new Event('wallet_disconnected'));
            }
        } catch (error) {
            console.error('Error during disconnect:', error);
        }
    }, [
        isConnectedWithDappKit,
        dappKitDisconnect,
        isConnectedWithSocialLogin,
        logout,
        isConnectedWithCrossApp,
        disconnectCrossApp,
        clearConnectionCache,
        resetToDefaults,
    ]);

    return {
        account,
        smartAccount: {
            address: smartAccount?.address ?? '',
            domain: smartAccountMetadata.domain,
            image: smartAccountMetadata.image,
            isDeployed: smartAccount?.isDeployed ?? false,
            isActive: hasActiveSmartAccount,
            version: smartAccountVersion?.version ?? null,
            isLoadingMetadata: smartAccountMetadata.isLoading,
            metadata: smartAccountMetadata.records,
        },
        connectedWallet,
        privyUser: user,
        connection: {
            isLoading,
            isConnected,
            isConnectedWithSocialLogin,
            isConnectedWithDappKit,
            isConnectedWithCrossApp,
            isConnectedWithPrivy,
            isConnectedWithVeChain,
            source: connectionSource,
            isInAppBrowser:
                (isBrowser() && window.vechain && window.vechain.isInAppBrowser) ?? false,
            nodeUrl,
            delegatorUrl: feeDelegation?.delegatorUrl,
            chainId: chainId,
            network: network.type,
        },
        disconnect,
    };
};
