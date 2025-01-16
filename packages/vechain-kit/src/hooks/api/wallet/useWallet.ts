'use client';

import { useLoginWithOAuth, usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useCachedVeChainDomain, useGetChainId, useGetNodeUrl } from '@/hooks';
import { getPicassoImage } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useSmartAccount } from '.';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useMemo } from 'react';

export type UseWalletReturnType = {
    // This will be the smart account if connected with privy, otherwise it will be wallet connected with dappkit
    account: Wallet;

    // The wallet in use between dappKitWallet, embeddedWallet and crossAppWallet
    connectedWallet: Wallet;

    // Every user connected with privy has one
    smartAccount: SmartAccount;

    // When user connects with a wallet
    dappKitWallet?: Wallet;

    // wallet created by the social login provider
    embeddedWallet?: Wallet;

    // Wallet of the user connected with a cross app provider
    crossAppWallet?: Wallet;

    // Privy user if user is connected with privy
    privyUser: User | null;

    // Connection status
    connection: {
        isConnected: boolean;
        isConnecting: boolean;
        isConnectedWithPrivy: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossApp: boolean;
        isLoadingPrivyConnection: boolean;
        source: ConnectionSource;
        isInAppBrowser: boolean;
        nodeUrl: string;
        delegatorUrl: string;
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
    } = useAccount(); // wagmi account state (for cross app)
    const { logout: disconnectCrossApp } = usePrivyCrossAppSdk();
    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});
    const { feeDelegation, network } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

    const nodeUrl = useGetNodeUrl();

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithPrivy = authenticated && !!user;

    const isConnecting = useMemo(() => {
        return (
            isConnectingWithCrossApp ||
            isReconnectingWithCrossApp ||
            isLoadingLoginOAuth
        );
    }, [
        isConnectingWithCrossApp,
        isReconnectingWithCrossApp,
        isLoadingLoginOAuth,
    ]);

    const isConnected = useMemo(() => {
        return (
            isConnectedWithDappKit ||
            isConnectedWithPrivy ||
            isConnectedWithCrossApp
        );
    }, [isConnectedWithDappKit, isConnectedWithPrivy, isConnectedWithCrossApp]);

    // Get embedded wallet
    const privyEmbeddedWallet = user?.wallet?.address;

    // Get connected and selected accounts
    const connectedWalletAddress = useMemo(() => {
        return isConnectedWithDappKit
            ? dappKitAccount
            : isConnectedWithCrossApp
            ? crossAppAddress
            : privyEmbeddedWallet;
    }, [
        isConnectedWithDappKit,
        isConnectedWithCrossApp,
        crossAppAddress,
        privyEmbeddedWallet,
    ]);

    // Get smart account
    const { data: smartAccount } = useSmartAccount(connectedWalletAddress);

    // Connection type
    const connectionSource: ConnectionSource = isConnectedWithCrossApp
        ? {
              type: 'privy-cross-app',
              displayName: 'App',
          }
        : isConnectedWithDappKit
        ? {
              type: 'wallet',
              displayName: 'Wallet',
          }
        : {
              type: 'privy',
              displayName: 'Social',
          };

    // TODO: here we will need to check if the owner of the wallet owns a smart account
    const activeAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount?.address ?? '';

    const account = {
        address: activeAddress ?? null,
        domain: useCachedVeChainDomain(activeAddress ?? '').domainResult.domain,
        image: getPicassoImage(activeAddress ?? ''),
    };

    const connectedWallet = {
        address: connectedWalletAddress ?? null,
        domain: useCachedVeChainDomain(connectedWalletAddress ?? '')
            .domainResult.domain,
        image: getPicassoImage(connectedWalletAddress ?? ''),
    };

    // Use cached domain lookups for each address
    const walletDomain = useCachedVeChainDomain(dappKitAccount ?? '')
        .domainResult.domain;
    const smartAccountDomain = useCachedVeChainDomain(
        smartAccount?.address ?? '',
    ).domainResult.domain;
    const embeddedWalletDomain = useCachedVeChainDomain(
        privyEmbeddedWallet ?? '',
    ).domainResult.domain;
    const crossAppAccountDomain = useCachedVeChainDomain(crossAppAddress ?? '')
        .domainResult.domain;

    // Modify the disconnect function to ensure state updates
    const disconnect = useCallback(async () => {
        try {
            if (isConnectedWithDappKit) {
                dappKitDisconnect();
            } else if (isConnectedWithPrivy) {
                await logout();
            } else if (isConnectedWithCrossApp) {
                await disconnectCrossApp();
            }
            // Force UI update after disconnect
            window.dispatchEvent(new Event('wallet_disconnected'));
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    }, [
        isConnectedWithDappKit,
        dappKitDisconnect,
        isConnectedWithPrivy,
        logout,
        isConnectedWithCrossApp,
        disconnectCrossApp,
    ]);

    return {
        account,
        smartAccount: {
            address: smartAccount?.address ?? null,
            domain: smartAccountDomain,
            image: getPicassoImage(smartAccount?.address ?? ''),
            isDeployed: smartAccount?.isDeployed ?? false,
        },
        dappKitWallet: isConnectedWithDappKit
            ? {
                  address: dappKitAccount,
                  domain: walletDomain,
                  image: getPicassoImage(dappKitAccount ?? ''),
              }
            : undefined,
        embeddedWallet: privyEmbeddedWallet
            ? {
                  address: privyEmbeddedWallet,
                  domain: embeddedWalletDomain,
                  image: getPicassoImage(privyEmbeddedWallet),
              }
            : undefined,
        crossAppWallet: crossAppAddress
            ? {
                  address: crossAppAddress,
                  domain: crossAppAccountDomain,
                  image: getPicassoImage(crossAppAddress),
              }
            : undefined,

        connectedWallet,
        privyUser: user,
        connection: {
            isConnecting,
            isConnected,
            isConnectedWithPrivy,
            isConnectedWithDappKit,
            isConnectedWithCrossApp,
            isLoadingPrivyConnection: !ready,
            source: connectionSource,
            isInAppBrowser:
                (window.vechain && window.vechain.isInAppBrowser) ?? false,
            nodeUrl,
            delegatorUrl: feeDelegation.delegatorUrl,
            chainId: chainId,
            network: network.type,
        },
        disconnect,
    };
};
