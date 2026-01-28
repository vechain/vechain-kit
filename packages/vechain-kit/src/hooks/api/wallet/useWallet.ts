'use client';

import type { Wallet as PrivyWallet, User } from '@privy-io/react-auth';
import { useOptionalPrivy } from '../privy/useOptionalPrivy';
import {
    useGetChainId,
    useGetNodeUrl,
    useGetAccountVersion,
    useSmartAccount,
    useCrossAppConnectionCache,
} from '../../';
import { useOptionalDAppKitWallet } from '../dappkit/useOptionalDAppKitWallet';
import { compareAddresses, VECHAIN_PRIVY_APP_ID } from '../../../utils';
import type { ConnectionSource, SmartAccount, Wallet } from '../../../types';
import { useVeChainKitConfig } from '../../../providers';
import { NETWORK_TYPE } from '../../../config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '../../../providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWalletMetadata } from './useWalletMetadata';
import { useWalletStorage } from './useWalletStorage';
import { isBrowser } from '../../../utils/ssrUtils';

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
    const { feeDelegation, network, privy } = useVeChainKitConfig();
    // Use optional Privy hook that handles missing provider gracefully
    const { user, authenticated, logout, ready } = useOptionalPrivy();
    const { data: chainId } = useGetChainId();
    // Use optional DAppKit wallet hook that handles missing provider gracefully
    const { account: dappKitAccount, disconnect: dappKitDisconnect } =
        useOptionalDAppKitWallet();
    const { getConnectionCache, clearConnectionCache } =
        useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();
    const {
        initializeCurrentWallet,
        getActiveWallet,
        saveWallet,
        getStoredWallets,
    } = useWalletStorage();

    const nodeUrl = useGetNodeUrl();

    // Check if in-app browser (calculate before using in useState)
    const isInAppBrowser = useMemo(
        () => (isBrowser() ? Boolean(window.vechain?.isInAppBrowser) : false),
        [],
    );

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

    // For desktop dappkit wallets, check if there's a stored active wallet
    // Use state to track active wallet so it updates immediately on switch
    const [storedActiveWalletAddress, setStoredActiveWalletAddress] = useState<
        string | null
    >(() => {
        if (isConnectedWithDappKit && !isInAppBrowser) {
            return getActiveWallet();
        }
        return null;
    });

    // Update stored active wallet when it changes in storage
    // Also reset when disconnecting
    useEffect(() => {
        if (isConnectedWithDappKit && !isInAppBrowser) {
            const activeWallet = getActiveWallet();
            setStoredActiveWalletAddress(activeWallet);
        } else {
            // Reset when disconnected or in-app browser
            setStoredActiveWalletAddress(null);
        }
    }, [isConnectedWithDappKit, isInAppBrowser, getActiveWallet]);

    // Track if a wallet switch is in progress to prevent overriding the user's selection
    const [isWalletSwitchInProgress, setIsWalletSwitchInProgress] =
        useState(false);

    // Listen for wallet switch events
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || isInAppBrowser) return;

        const handleWalletSwitch = (
            event: CustomEvent<{ address: string }>,
        ) => {
            setIsWalletSwitchInProgress(true);
            setStoredActiveWalletAddress(event.detail.address);
            // Reset the flag after a short delay to allow the connection to update
            setTimeout(() => {
                setIsWalletSwitchInProgress(false);
            }, 1000);
        };

        window.addEventListener(
            'wallet_switched',
            handleWalletSwitch as EventListener,
        );
        return () => {
            window.removeEventListener(
                'wallet_switched',
                handleWalletSwitch as EventListener,
            );
        };
    }, [isConnectedWithDappKit, isInAppBrowser]);

    // Always prioritize the stored active wallet from cache when switching
    // Use connected wallet when:
    // 1. No stored active wallet exists (new connection)
    // 2. Connected wallet is not in stored wallets list (new wallet after disconnect)
    // 3. A switch is NOT in progress AND connected wallet differs from stored (reconnection with different wallet)
    const storedWallets = getStoredWallets();
    const isConnectedWalletInStoredList = storedWallets.some(
        (w) =>
            w.address.toLowerCase() === connectedWalletAddress?.toLowerCase(),
    );

    // Always read the stored active wallet directly from storage to ensure consistency
    // This avoids race conditions with state updates
    const currentStoredActiveWallet =
        isConnectedWithDappKit && !isInAppBrowser ? getActiveWallet() : null;

    const effectiveConnectedWalletAddress =
        // If switch is in progress, always use stored active wallet
        isWalletSwitchInProgress && currentStoredActiveWallet
            ? currentStoredActiveWallet
            : // If stored active wallet exists and connected wallet is in stored list, use stored (switch scenario)
            currentStoredActiveWallet && isConnectedWalletInStoredList
            ? currentStoredActiveWallet
            : // Otherwise use connected wallet (new connection or reconnection with different wallet)
              connectedWalletAddress;

    // Get smart account
    const { data: smartAccount } = useSmartAccount(
        effectiveConnectedWalletAddress ?? '',
    );

    // TODO: here we will need to check if the owner of the wallet owns a smart account
    const activeAddress = isConnectedWithDappKit
        ? effectiveConnectedWalletAddress
        : smartAccount?.address;

    const activeAccountMetadata = useWalletMetadata(
        activeAddress ?? '',
        network.type,
    );

    const connectedMetadata = useWalletMetadata(
        effectiveConnectedWalletAddress ?? '',
        network.type,
    );
    const smartAccountMetadata = useWalletMetadata(
        smartAccount?.address ?? '',
        network.type,
    );

    const { setActiveWallet: setActiveWalletStorage } = useWalletStorage();

    // Track recently removed wallets to prevent them from being set as active again
    const recentlyRemovedWalletsRef = useRef<Set<string>>(new Set());

    // Listen for wallet removal events
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || isInAppBrowser) return;

        const handleWalletRemoved = (
            event: CustomEvent<{ address: string }>,
        ) => {
            // Track removed wallet for 5 seconds to prevent it from being set as active
            recentlyRemovedWalletsRef.current.add(
                event.detail.address.toLowerCase(),
            );
            setTimeout(() => {
                recentlyRemovedWalletsRef.current.delete(
                    event.detail.address.toLowerCase(),
                );
            }, 5000);
        };

        window.addEventListener(
            'wallet_removed',
            handleWalletRemoved as EventListener,
        );
        return () => {
            window.removeEventListener(
                'wallet_removed',
                handleWalletRemoved as EventListener,
            );
        };
    }, [isConnectedWithDappKit, isInAppBrowser]);

    // Save/initialize wallet in storage when connected via dappkit and not in-app browser
    // Set the connected wallet as active when it's a new wallet or new connection
    useEffect(() => {
        if (
            isConnectedWithDappKit &&
            !isInAppBrowser &&
            connectedWalletAddress &&
            activeAccountMetadata &&
            !activeAccountMetadata.isLoading
        ) {
            // Don't save or set as active if this wallet was recently removed
            // This prevents re-adding wallets that the user just removed
            const wasRecentlyRemoved = recentlyRemovedWalletsRef.current.has(
                connectedWalletAddress.toLowerCase(),
            );
            if (wasRecentlyRemoved) {
                return;
            }

            // Check if this is a new wallet BEFORE saving (since saveWallet adds it to storage)
            const currentStoredWallets = getStoredWallets();
            const isNewWallet = !currentStoredWallets.some(
                (w) =>
                    w.address.toLowerCase() ===
                    connectedWalletAddress.toLowerCase(),
            );

            // First try to initialize (only saves if no wallets exist and sets as active)
            initializeCurrentWallet(connectedWalletAddress);
            // Always save/update the wallet (in case it already exists or is a new connection)
            saveWallet(connectedWalletAddress);

            // Check if this is a new connection or a switch
            // When switching, storedActiveWalletAddress is updated immediately via wallet_switched event
            // and isWalletSwitchInProgress is set to true
            // We should NOT override the stored active wallet when switching
            const isNewConnection = !storedActiveWalletAddress;
            const isSameAsStoredActive =
                storedActiveWalletAddress &&
                storedActiveWalletAddress.toLowerCase() ===
                    connectedWalletAddress.toLowerCase();

            // Set as active if:
            // 1. It's a new wallet (not in stored wallets list) - always set as active for better UX, OR
            // 2. It's a new connection (no stored active wallet), OR
            // 3. The connected wallet matches the stored active wallet (same wallet, just ensuring it's saved), AND
            // 4. A wallet switch is NOT in progress (to prevent overriding user's selection during switch)
            if (
                (isNewWallet || isNewConnection || isSameAsStoredActive) &&
                !isWalletSwitchInProgress
            ) {
                setActiveWalletStorage(connectedWalletAddress);
            }
        }
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        connectedWalletAddress,
        activeAccountMetadata?.domain,
        activeAccountMetadata?.image,
        activeAccountMetadata?.isLoading,
        initializeCurrentWallet,
        saveWallet,
        setActiveWalletStorage,
        storedActiveWalletAddress,
        getStoredWallets,
    ]);

    // Ensure the stored active wallet is saved when it changes
    // Metadata will be fetched dynamically when needed
    useEffect(() => {
        if (
            isConnectedWithDappKit &&
            !isInAppBrowser &&
            storedActiveWalletAddress &&
            storedActiveWalletAddress.toLowerCase() ===
                effectiveConnectedWalletAddress?.toLowerCase()
        ) {
            // Ensure the stored active wallet is saved
            saveWallet(storedActiveWalletAddress);
        }
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        storedActiveWalletAddress,
        effectiveConnectedWalletAddress,
        saveWallet,
    ]);

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
                await logout();
            } else if (isConnectedWithCrossApp) {
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
            isInAppBrowser,
            nodeUrl,
            delegatorUrl: feeDelegation?.delegatorUrl,
            chainId: chainId,
            network: network.type,
        },
        disconnect,
    };
};
