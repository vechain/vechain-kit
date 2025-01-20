'use client';

import { useLoginWithOAuth, usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useVechainDomain, useGetChainId, useGetNodeUrl } from '@/hooks';
import {
    compareAddresses,
    getPicassoImage,
    VECHAIN_PRIVY_APP_ID,
} from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useSmartAccount } from '.';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useState } from 'react';
import { useCrossAppConnectionCache } from '@/hooks';

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
        isConnectedWithSocialLogin: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossApp: boolean;
        isConnectedWithPrivy: boolean;
        isLoadingPrivyConnection: boolean;
        isConnectedWithVeChain: boolean;
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
    } = useAccount();
    const { logout: disconnectCrossApp } = usePrivyCrossAppSdk();
    const { loading: isLoadingLoginOAuth } = useLoginWithOAuth({});
    const { feeDelegation, network, privy } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

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

    const isConnecting =
        isConnectingWithCrossApp ||
        isReconnectingWithCrossApp ||
        isLoadingLoginOAuth;

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

        setIsConnected(isNowConnected);
    }, [
        isConnectedWithDappKit,
        isConnectedWithSocialLogin,
        isConnectedWithCrossApp,
        connectionSource,
    ]);

    // Get embedded wallet
    const privyEmbeddedWallet = user?.wallet?.address;

    // Get connected and selected accounts
    const connectedWalletAddress = isConnectedWithDappKit
        ? dappKitAccount
        : isConnectedWithCrossApp
        ? crossAppAddress
        : privyEmbeddedWallet;

    // Get smart account
    const { data: smartAccount } = useSmartAccount(connectedWalletAddress);

    // TODO: here we will need to check if the owner of the wallet owns a smart account
    const activeAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount?.address ?? '';

    const account = {
        address: activeAddress ?? null,
        domain: useVechainDomain(activeAddress ?? '').data?.domain,
        image: getPicassoImage(activeAddress ?? ''),
    };

    const connectedWallet = {
        address: connectedWalletAddress ?? null,
        domain: useVechainDomain(connectedWalletAddress ?? '').data?.domain,
        image: getPicassoImage(connectedWalletAddress ?? ''),
    };

    //TODO: add isLoading for each domain
    // Use cached domain lookups for each address
    const walletDomain = useVechainDomain(dappKitAccount ?? '').data?.domain;
    const smartAccountDomain = useVechainDomain(smartAccount?.address ?? '')
        .data?.domain;
    const embeddedWalletDomain = useVechainDomain(privyEmbeddedWallet ?? '')
        .data?.domain;
    const crossAppAccountDomain = useVechainDomain(crossAppAddress ?? '').data
        ?.domain;

    // Modify the disconnect function to ensure state updates
    const disconnect = useCallback(async () => {
        try {
            if (isConnectedWithDappKit) {
                dappKitDisconnect();
            } else if (isConnectedWithSocialLogin) {
                logout();
            } else if (isConnectedWithCrossApp) {
                disconnectCrossApp();
            }
            clearConnectionCache();
            window.dispatchEvent(new Event('wallet_disconnected'));
            setIsConnected(false);
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
    ]);

    const hasActiveSmartAccount =
        !!smartAccount?.address &&
        !!account?.address &&
        compareAddresses(smartAccount?.address, account?.address);

    return {
        account,
        smartAccount: {
            address: smartAccount?.address ?? null,
            domain: smartAccountDomain,
            image: getPicassoImage(smartAccount?.address ?? ''),
            isDeployed: smartAccount?.isDeployed ?? false,
            isActive: hasActiveSmartAccount,
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
            isConnectedWithSocialLogin,
            isConnectedWithDappKit,
            isConnectedWithCrossApp,
            isLoadingPrivyConnection: !ready,
            isConnectedWithPrivy,
            isConnectedWithVeChain,
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
