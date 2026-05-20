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
    useCrossAppConnectionCache,
} from '@/hooks';
import { compareAddresses, VECHAIN_PRIVY_APP_ID } from '@/utils';
import { ConnectionSource, SmartAccount, Wallet } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { useAccount } from 'wagmi';
import { usePrivyCrossAppSdk } from '@/providers/PrivyCrossAppProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWalletMetadata } from './useWalletMetadata';
import { useWalletStorage } from './useWalletStorage';
import { isBrowser } from '@/utils/ssrUtils';
import { getVechainDomainQueryKey } from '@/hooks/api/vetDomains/useVechainDomain';
import { getAvatarOfAddressQueryKey } from '@/hooks/api/vetDomains/useGetAvatarOfAddress';

// Normalize addresses to lowercase at the `useWallet` boundary so that the
// case returned by `account.address` / `connectedWallet.address` is stable
// across vechain-kit versions and dapp-kit connect flows (v1 certificate vs
// v2 `wallet_requestPermissions`, which may return mixed case).
// Downstream consumers (React Query keys, app-side caches, stored wallets)
// historically treated the address as lowercase; returning a checksummed
// address here would break that contract and silently invalidate caches
// when switching between vechain-kit versions on the same domain.
// Strict EIP-55 callers must opt-in explicitly via `Address.checksum`.
const normalizeAddress = (addr: string): string => addr.toLowerCase();

export type UseWalletReturnType = {
    // This will be the smart account if connected with privy, otherwise it will be wallet connected with dappkit
    account: Wallet;

    // The wallet in use between dappKitWallet, embeddedWallet and crossAppWallet
    connectedWallet: Wallet;

    /** All accounts approved by the wallet (dapp-kit multi-account); single
     * entry for Privy / cross-app. The active one is `account`. */
    accounts: NonNullable<Wallet>[];

    /** Switch active account without reopening the wallet picker. No-op for
     * Privy / cross-app. */
    setActiveAccount: (address: string) => void;

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
    const {
        account: dappKitAccount,
        accounts: dappKitAccountsRaw,
        setActiveAccount: dappKitSetActiveAccount,
        disconnect: dappKitDisconnect,
    } = useDAppKitWallet();

    // Fall back to `[dappKitAccount]` for dapp-kit-react < 2.2.0 or when
    // v2 persistence didn't populate `addresses`.
    const dappKitAccounts: string[] = useMemo(() => {
        if (dappKitAccountsRaw && dappKitAccountsRaw.length > 0)
            return dappKitAccountsRaw;
        return dappKitAccount ? [dappKitAccount] : [];
    }, [dappKitAccountsRaw, dappKitAccount]);
    const { getConnectionCache, clearConnectionCache } =
        useCrossAppConnectionCache();
    const connectionCache = getConnectionCache();
    const {
        initializeCurrentWallet,
        getActiveWallet,
        saveWallet,
        getStoredWallets,
        setActiveWallet: setActiveWalletStorage,
        removeWallet,
    } = useWalletStorage();

    const queryClient = useQueryClient();

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

    // Invalidate VNS/avatar queries on dapp-kit v2 connect — `connectV2` only
    // sets `state.address`, it doesn't trigger the VNS lookup v1 did.
    useEffect(() => {
        if (!dappKitAccount) return;
        queryClient.invalidateQueries({
            queryKey: getVechainDomainQueryKey(dappKitAccount),
        });
        queryClient.invalidateQueries({
            queryKey: getAvatarOfAddressQueryKey(dappKitAccount),
        });
    }, [dappKitAccount, queryClient]);

    // Cross-version compat: dapp-kit v2 (`wallet_requestPermissions`) and
    // older builds of this kit may persist mixed-case, non-EIP-55 addresses
    // under both `dappkit@vechain/v2/*` (dapp-kit) and
    // `vechain_kit_wallets_*` / `vechain_kit_active_wallet_*` (kit). Older
    // vechain-kit consumers on the same origin read those keys verbatim and
    // then hit `ethers.isAddress()` strict EIP-55 checks downstream
    // (balance/domain/avatar all fail). Normalize every relevant entry to
    // lowercase so any reader — old or new — gets a uniformly safe value.
    useEffect(() => {
        if (!isBrowser() || !isConnectedWithDappKit || !dappKitAccount) return;

        const normalizeStringEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (v && v !== v.toLowerCase()) {
                    window.localStorage.setItem(key, v.toLowerCase());
                }
            } catch {
                /* ignore: localStorage may be unavailable */
            }
        };

        const normalizeJsonArrayEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (!v) return;
                const parsed = JSON.parse(v);
                if (
                    Array.isArray(parsed) &&
                    parsed.some(
                        (a) => typeof a === 'string' && a !== a.toLowerCase(),
                    )
                ) {
                    window.localStorage.setItem(
                        key,
                        JSON.stringify(
                            parsed.map((a) =>
                                typeof a === 'string' ? a.toLowerCase() : a,
                            ),
                        ),
                    );
                }
            } catch {
                /* ignore: malformed JSON or unavailable storage */
            }
        };

        const normalizeStoredWalletsEntry = (key: string) => {
            try {
                const v = window.localStorage.getItem(key);
                if (!v) return;
                const parsed = JSON.parse(v);
                if (!Array.isArray(parsed)) return;
                const next = parsed.map((w) => {
                    if (
                        w &&
                        typeof w === 'object' &&
                        typeof w.address === 'string'
                    ) {
                        return { ...w, address: w.address.toLowerCase() };
                    }
                    return w;
                });
                const changed = next.some(
                    (w, i) =>
                        w?.address !== (parsed[i] as { address?: string })?.address,
                );
                if (changed) {
                    window.localStorage.setItem(key, JSON.stringify(next));
                }
            } catch {
                /* ignore */
            }
        };

        normalizeStringEntry('dappkit@vechain/v2/account');
        normalizeJsonArrayEntry('dappkit@vechain/v2/accounts');
        normalizeStringEntry(`vechain_kit_active_wallet_${network.type}`);
        normalizeStoredWalletsEntry(`vechain_kit_wallets_${network.type}`);
    }, [
        isConnectedWithDappKit,
        dappKitAccount,
        dappKitAccountsRaw,
        network.type,
    ]);

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

    const dappKitAccountsRef = useRef(dappKitAccounts);
    dappKitAccountsRef.current = dappKitAccounts;

    // Reconcile kit storage with the dapp-kit approved set.
    //   - dapp-kit v2 (`accounts` populated): full multi-account set.
    //   - dapp-kit v1 / single-account flow (`accounts` missing or empty):
    //     fall back to `[dappKitAccount]`. This handles the recovery case
    //     where the user disconnected from an older vechain-kit on the
    //     same origin and re-logged in with a single account — without
    //     pruning here, `vechain_kit_wallets_*` keeps stale multi-account
    //     entries written by a previous v2 session and the old kit's UI
    //     surfaces accounts the wallet no longer approves.
    useEffect(() => {
        if (
            !isConnectedWithDappKit ||
            isInAppBrowser ||
            !dappKitAccount
        ) {
            return;
        }

        const approvedAddresses: string[] =
            dappKitAccountsRaw && dappKitAccountsRaw.length > 0
                ? dappKitAccountsRaw
                : [dappKitAccount];

        const stored = getStoredWallets();
        const approvedLower = new Set(
            approvedAddresses.map((a) => a.toLowerCase()),
        );
        const storedLower = new Set(
            stored.map((w) => w.address.toLowerCase()),
        );

        approvedAddresses.forEach((addr) => {
            if (!storedLower.has(addr.toLowerCase())) saveWallet(addr);
        });
        stored.forEach((w) => {
            if (!approvedLower.has(w.address.toLowerCase()))
                removeWallet(w.address);
        });
    }, [
        isConnectedWithDappKit,
        isInAppBrowser,
        dappKitAccount,
        dappKitAccountsRaw,
        getStoredWallets,
        saveWallet,
        removeWallet,
    ]);

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
              address: normalizeAddress(activeAddress),
              domain: activeAccountMetadata.domain,
              image: activeAccountMetadata.image,
              isLoadingMetadata: activeAccountMetadata.isLoading,
              metadata: activeAccountMetadata.records,
          }
        : null;

    const connectedWallet = connectedWalletAddress
        ? {
              address: normalizeAddress(connectedWalletAddress),
              domain: connectedMetadata.domain,
              image: connectedMetadata.image,
              isLoadingMetadata: connectedMetadata.isLoading,
              metadata: connectedMetadata.records,
          }
        : null;

    // Approved-accounts list surfaced to consumers (dapp-kit only; Privy /
    // cross-app always have a single wallet).
    const accountsList: NonNullable<Wallet>[] = useMemo(() => {
        if (isConnectedWithDappKit) {
            return dappKitAccounts.map((addr) => ({
                address: normalizeAddress(addr),
                domain: undefined,
                image: undefined,
                isLoadingMetadata: false,
                metadata: undefined,
            }));
        }
        return connectedWallet ? [connectedWallet] : [];
    }, [isConnectedWithDappKit, dappKitAccounts, connectedWallet]);

    const setActiveAccount = useCallback(
        (address: string) => {
            if (!isConnectedWithDappKit) return;
            if (typeof dappKitSetActiveAccount === 'function') {
                try {
                    dappKitSetActiveAccount(address);
                } catch (e) {
                    console.error(
                        'setActiveAccount: dapp-kit rejected the address',
                        e,
                    );
                    return;
                }
            }
            if (!isInAppBrowser) {
                setActiveWalletStorage(address);
                setStoredActiveWalletAddress(address);
                if (isBrowser()) {
                    window.dispatchEvent(
                        new CustomEvent('wallet_switched', {
                            detail: { address },
                        }),
                    );
                }
            }
        },
        [
            isConnectedWithDappKit,
            isInAppBrowser,
            dappKitSetActiveAccount,
            setActiveWalletStorage,
        ],
    );

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

            // Then perform disconnection logic. `dappKitDisconnect` already
            // wipes both `dappkit@vechain/v2/*` and the legacy
            // `dappkit@vechain/*` keys; we add the kit-side storage cleanup
            // below so a logout always leaves a clean slate (no stale
            // multi-account list surfacing on the next login, regardless of
            // which vechain-kit version connects next on the same origin).
            if (isConnectedWithDappKit) {
                dappKitDisconnect();
            } else if (isConnectedWithSocialLogin) {
                await logout();
            } else if (isConnectedWithCrossApp) {
                await disconnectCrossApp();
            }

            if (isBrowser()) {
                try {
                    window.localStorage.removeItem(
                        `vechain_kit_wallets_${network.type}`,
                    );
                    window.localStorage.removeItem(
                        `vechain_kit_active_wallet_${network.type}`,
                    );
                } catch {
                    /* ignore: localStorage may be unavailable */
                }
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
        network.type,
    ]);

    return {
        account,
        accounts: accountsList,
        setActiveAccount,
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
