/**
 * VeChainKitCoreProvider - Minimal provider for advanced users
 *
 * This provider provides only the essential context + React Query setup,
 * without bundling any heavy dependencies like:
 * - Privy (~500KB)
 * - DAppKit (~200KB)
 * - Wagmi (~150KB)
 * - Chakra UI (~300KB)
 *
 * Use this provider when you want maximum control and are building:
 * - Custom authentication flows
 * - Headless applications
 * - Server-side applications
 * - Custom UI with your own components
 *
 * Bundle size: ~60KB (compared to ~1.7MB for full provider)
 *
 * @example
 * ```tsx
 * import { VeChainKitCoreProvider } from '@vechain/vechain-kit/providers';
 *
 * function App() {
 *   return (
 *     <VeChainKitCoreProvider network={{ type: 'main' }}>
 *       <CustomAuthProvider>
 *         <MyApp />
 *       </CustomAuthProvider>
 *     </VeChainKitCoreProvider>
 *   );
 * }
 * ```
 */

import React, { ReactNode, useMemo, useState, useEffect, useRef } from 'react';
import { getConfig } from '../config';
import { NETWORK_TYPE } from '../config/network';
import type { CURRENCY } from '../types';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/ssrUtils';
import { initializeI18n } from '../utils/i18n';
import {
    VeChainKitContext,
    type VeChainKitConfig,
} from './VeChainKitContext';
import { EnsureQueryClient } from './EnsureQueryClient';
import { ThorProvider } from './ThorProvider';
import { VECHAIN_KIT_STORAGE_KEYS } from '../utils/constants';
import type { Certificate, CertificateData } from '@vechain/sdk-core';
import i18n from '../../i18n';

/**
 * Props for VeChainKitCoreProvider
 * Simplified compared to VeChainKitProvider - no Privy, DAppKit, Chakra UI options
 */
export interface VeChainKitCoreProviderProps {
    children: ReactNode;
    /**
     * Network configuration
     * @default { type: 'main' }
     */
    network?: {
        type?: string; // Accepts any string, validated internally to 'main' | 'test' | 'solo'
        nodeUrl?: string;
        requireCertificate?: boolean;
        connectionCertificate?: {
            message?: Certificate;
            options?: CertificateData;
        };
    };
    /**
     * Initial language for i18n
     * @default 'en'
     */
    language?: string;
    /**
     * Enable dark mode for theming context (even without Chakra UI)
     * @default false
     */
    darkMode?: boolean;
    /**
     * Default currency
     * @default 'usd'
     */
    defaultCurrency?: CURRENCY;
    /**
     * Callback when language changes
     */
    onLanguageChange?: (language: string) => void;
    /**
     * Callback when currency changes
     */
    onCurrencyChange?: (currency: CURRENCY) => void;
}

const CURRENCY_STORAGE_KEY = 'vechain_kit_currency';

/**
 * Validates the network configuration
 */
const validateNetwork = (network?: VeChainKitCoreProviderProps['network']) => {
    if (!network || !network.type) {
        return { type: 'main' as NETWORK_TYPE };
    }

    const networkType = network.type;
    if (!['main', 'test', 'solo'].includes(networkType)) {
        throw new Error(
            `VeChainKitCoreProvider: network.type must be "main", "test", or "solo". Got: "${networkType}"`,
        );
    }

    return { ...network, type: networkType as NETWORK_TYPE };
};

/**
 * Minimal provider for VeChain Kit - includes only:
 * - VeChainKitContext (configuration)
 * - React Query (QueryClientProvider)
 * - ThorProvider (Thor client for blockchain operations)
 *
 * Does NOT include:
 * - Privy (social login, embedded wallets)
 * - DAppKit (VeWorld, Sync2, WalletConnect)
 * - Wagmi (ecosystem cross-app connections)
 * - Chakra UI (styling, modals)
 * - ModalProvider (connect/account modals)
 * - LegalDocumentsProvider (terms & privacy)
 *
 * Hooks that require these missing providers will:
 * - Return null/undefined for data
 * - Throw helpful errors when actions are attempted
 * - Work gracefully in read-only scenarios (e.g., balance queries)
 */
export const VeChainKitCoreProvider = ({
    children,
    network: _network,
    language = 'en',
    darkMode = false,
    defaultCurrency = 'usd',
    onLanguageChange,
    onCurrencyChange,
}: VeChainKitCoreProviderProps) => {
    // Validate network configuration
    const validatedNetwork = validateNetwork(_network);
    const networkType = validatedNetwork.type;

    // Get node URL from config if not provided
    const nodeUrl = _network?.nodeUrl ?? getConfig(networkType).nodeUrl;

    const network = {
        ...validatedNetwork,
        nodeUrl,
    };

    // Initialize current language from i18n or prop
    const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const stored = getLocalStorageItem('i18nextLng');
            return stored || language;
        }
        return language;
    });

    // Initialize current currency from localStorage or prop
    const [currentCurrency, setCurrentCurrencyState] = useState<CURRENCY>(
        () => {
            try {
                const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);
                return (stored as CURRENCY) || defaultCurrency;
            } catch {
                return defaultCurrency;
            }
        },
    );

    // Track if we're updating from prop to avoid loops
    const isUpdatingFromPropRef = useRef(false);
    const isUpdatingCurrencyFromPropRef = useRef(false);

    // Initialize i18n
    useEffect(() => {
        initializeI18n(i18n);

        const storedLanguage =
            typeof window !== 'undefined'
                ? getLocalStorageItem('i18nextLng')
                : null;
        const initialLanguage = storedLanguage || currentLanguage;

        if (initialLanguage && i18n.language !== initialLanguage) {
            isUpdatingFromPropRef.current = true;
            i18n.changeLanguage(initialLanguage);
            if (initialLanguage !== currentLanguage) {
                setCurrentLanguageState(initialLanguage);
            }
            isUpdatingFromPropRef.current = false;
        }
    }, []);

    // Sync language prop changes
    useEffect(() => {
        const storedLanguage =
            typeof window !== 'undefined'
                ? getLocalStorageItem('i18nextLng')
                : null;

        if (language && !storedLanguage && language !== currentLanguage) {
            isUpdatingFromPropRef.current = true;
            i18n.changeLanguage(language);
            setCurrentLanguageState(language);
            isUpdatingFromPropRef.current = false;
        }
    }, [language, currentLanguage]);

    // Listen to i18n language changes
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            if (!isUpdatingFromPropRef.current && lng !== currentLanguage) {
                setCurrentLanguageState(lng);
                onLanguageChange?.(lng);
            }
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [currentLanguage, onLanguageChange]);

    // Sync currency prop changes
    useEffect(() => {
        const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);

        if (defaultCurrency && !stored && defaultCurrency !== currentCurrency) {
            isUpdatingCurrencyFromPropRef.current = true;
            setCurrentCurrencyState(defaultCurrency);
            setLocalStorageItem(CURRENCY_STORAGE_KEY, defaultCurrency);
            isUpdatingCurrencyFromPropRef.current = false;
        }
    }, [defaultCurrency, currentCurrency]);

    // Listen to currency localStorage changes
    useEffect(() => {
        const checkCurrencyChange = () => {
            try {
                const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);
                if (
                    stored &&
                    stored !== currentCurrency &&
                    !isUpdatingCurrencyFromPropRef.current
                ) {
                    const newCurrency = stored as CURRENCY;
                    setCurrentCurrencyState(newCurrency);
                    onCurrencyChange?.(newCurrency);
                }
            } catch {
                // Ignore errors
            }
        };

        checkCurrencyChange();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CURRENCY_STORAGE_KEY && e.newValue) {
                checkCurrencyChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(checkCurrencyChange, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [currentCurrency, onCurrencyChange]);

    // Functions to set language/currency
    const setLanguage = (lang: string) => {
        isUpdatingFromPropRef.current = true;
        i18n.changeLanguage(lang);
        setCurrentLanguageState(lang);
        isUpdatingFromPropRef.current = false;
    };

    const setCurrency = (currency: CURRENCY) => {
        isUpdatingCurrencyFromPropRef.current = true;
        setCurrentCurrencyState(currency);
        setLocalStorageItem(CURRENCY_STORAGE_KEY, currency);
        isUpdatingCurrencyFromPropRef.current = false;
    };

    // Store network type
    useEffect(() => {
        setLocalStorageItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK, networkType);
    }, [networkType]);

    // Context value - minimal configuration
    const contextValue = useMemo<VeChainKitConfig>(
        () => ({
            // No Privy configuration
            privy: undefined,
            privyEcosystemAppIDS: [],
            // No fee delegation (requires Privy for smart accounts)
            feeDelegation: undefined,
            // No DAppKit configuration
            dappKit: undefined,
            // No login modal UI
            loginModalUI: undefined,
            // No login methods (manual auth only)
            loginMethods: undefined,
            // Theme settings
            darkMode,
            // Always headless in core provider (no Chakra UI)
            headless: true,
            // No i18n config overrides
            i18n: undefined,
            // Network configuration
            network,
            // Current language
            currentLanguage,
            // No custom tokens (requires DAppKit)
            allowCustomTokens: false,
            // No legal documents (requires LegalDocumentsProvider)
            legalDocuments: undefined,
            // Currency settings
            currentCurrency,
            // No custom theme
            theme: undefined,
            // Language/currency setters
            setLanguage,
            setCurrency,
        }),
        [darkMode, network, currentLanguage, currentCurrency],
    );

    return (
        <EnsureQueryClient>
            <VeChainKitContext.Provider value={contextValue}>
                <ThorProvider nodeUrl={nodeUrl}>{children}</ThorProvider>
            </VeChainKitContext.Provider>
        </EnsureQueryClient>
    );
};

/**
 * Re-export useVeChainKitConfig for convenience
 */
export { useVeChainKitConfig } from './VeChainKitContext';
