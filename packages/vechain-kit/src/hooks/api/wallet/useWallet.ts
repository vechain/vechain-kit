'use client';

import { useLoginWithOAuth, usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useVechainDomain, useGetChainId, useGetNodeUrl } from '@/hooks';
import { compareAddresses, getPicassoImage } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useSmartAccount } from '.';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useState } from 'react';

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
    const { feeDelegation, network } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

    const nodeUrl = useGetNodeUrl();

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithSocialLogin = authenticated && !!user;
    const isConnectedWithPrivy =
        isConnectedWithSocialLogin || isConnectedWithCrossApp;

    const isConnecting =
        isConnectingWithCrossApp ||
        isReconnectingWithCrossApp ||
        isLoadingLoginOAuth;

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        setIsConnected(
            isConnectedWithDappKit ||
                isConnectedWithSocialLogin ||
                isConnectedWithCrossApp,
        );
    }, [
        isConnectedWithDappKit,
        isConnectedWithSocialLogin,
        isConnectedWithCrossApp,
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
              displayName: 'Social',
          };

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
                await dappKitDisconnect();
            } else if (isConnectedWithSocialLogin) {
                await logout();
            } else if (isConnectedWithCrossApp) {
                await disconnectCrossApp();
            }
            window.dispatchEvent(new Event('wallet_disconnected'));
            setIsConnected(false); // Explicitly update the state
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
