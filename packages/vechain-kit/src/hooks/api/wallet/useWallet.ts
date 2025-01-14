'use client';

import { usePrivy, User } from '@privy-io/react-auth';
import { useWallet as useDappKitWallet } from '@vechain/dapp-kit-react';
import { useCachedVeChainDomain, useGetChainId } from '@/hooks';
import { getPicassoImage } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useSmartAccount } from '.';
import { ThorClient } from '@vechain/sdk-network';
import { useVeChainKitConfig } from '@/providers';

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
        isConnectedWithPrivy: boolean;
        isConnectedWithDappKit: boolean;
        isConnectedWithCrossAppPrivy: boolean;
        isLoadingPrivyConnection: boolean;
        source: ConnectionSource;
        isInAppBrowser: boolean;
        thor: ThorClient;
        nodeUrl: string;
        delegatorUrl: string;
        chainId?: string;
    };

    // Disconnect function
    disconnect: () => Promise<void>;
};

export const useWallet = (): UseWalletReturnType => {
    const { dappKitConfig, feeDelegationConfig } = useVeChainKitConfig();
    const { user, authenticated, logout, ready } = usePrivy();
    const { data: chainId } = useGetChainId();
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useDappKitWallet();

    // Connection states
    const isConnectedWithDappKit = !!dappKitAccount;
    const isConnectedWithPrivy = authenticated && !!user;
    const isConnected = isConnectedWithDappKit || isConnectedWithPrivy;
    const isCrossAppPrivyAccount = Boolean(
        user?.linkedAccounts?.some((account) => account.type === 'cross_app'),
    );

    // Get embedded wallet
    const privyEmbeddedWallet = user?.wallet?.address;

    // Get smart account
    const { data: smartAccount } = useSmartAccount(
        isConnectedWithPrivy ? privyEmbeddedWallet ?? '' : dappKitAccount ?? '',
    );

    // Connection type
    const connectionSource: ConnectionSource = isCrossAppPrivyAccount
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

    // Get cross app account
    const crossAppAccount = user?.linkedAccounts.find(
        (account) => account.type === 'cross_app',
    );

    // Get connected and selected accounts
    const connectedWalletAddress = isConnectedWithDappKit
        ? dappKitAccount
        : isCrossAppPrivyAccount
        ? crossAppAccount?.embeddedWallets?.[0]?.address
        : privyEmbeddedWallet;

    const selectedAddress = isConnectedWithDappKit
        ? dappKitAccount
        : smartAccount?.address ?? '';

    const account = {
        address: selectedAddress ?? null,
        domain: useCachedVeChainDomain(selectedAddress ?? '').domainResult
            .domain,
        image: getPicassoImage(selectedAddress ?? ''),
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
    const crossAppAccountDomain = useCachedVeChainDomain(
        crossAppAccount?.embeddedWallets?.[0]?.address ?? '',
    ).domainResult.domain;

    // Disconnect function
    const disconnect = async () => {
        if (isConnectedWithDappKit) {
            dappKitDisconnect();
        } else {
            await logout();
        }
    };

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
        crossAppWallet: crossAppAccount?.embeddedWallets?.[0]?.address
            ? {
                  address: crossAppAccount?.embeddedWallets?.[0]?.address,
                  domain: crossAppAccountDomain,
                  image: getPicassoImage(
                      crossAppAccount?.embeddedWallets?.[0]?.address,
                  ),
              }
            : undefined,

        connectedWallet,
        privyUser: user,
        connection: {
            isConnected,
            isConnectedWithPrivy,
            isConnectedWithDappKit,
            isConnectedWithCrossAppPrivy: isCrossAppPrivyAccount,
            isLoadingPrivyConnection: !ready,
            source: connectionSource,
            isInAppBrowser:
                (window.vechain && window.vechain.isInAppBrowser) ?? false,
            thor: ThorClient.at(dappKitConfig.nodeUrl),
            nodeUrl: dappKitConfig.nodeUrl,
            delegatorUrl: feeDelegationConfig.delegatorUrl,
            chainId: chainId,
        },
        disconnect,
    };
};
