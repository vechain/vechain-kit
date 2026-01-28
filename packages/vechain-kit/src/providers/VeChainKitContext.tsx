/**
 * VeChainKitContext - Extracted context to break circular dependencies
 *
 * This file contains only the context definition and hook, without any
 * imports that could create circular dependencies. The VeChainKitProvider
 * imports this context, and all hooks import useVeChainKitConfig from here
 * instead of from VeChainKitProvider.tsx.
 */

import { createContext, useContext } from 'react';
import type { Certificate, CertificateData } from '@vechain/sdk-core';
import type { NETWORK_TYPE } from '../config/network';
import type { CURRENCY, LegalDocumentOptions, PrivyLoginMethod } from '../types';
import type { VechainKitThemeConfig } from '../theme/tokens';
import type {
    WalletSource as DAppKitWalletSource,
    LogLevel,
} from '@vechain/dapp-kit';
import type { WalletConnectOptions } from '@vechain/dapp-kit-react';
import type { CustomizedStyle, I18n, SourceInfo } from '@vechain/dapp-kit-ui';
import type { WalletListEntry } from '@privy-io/react-auth';

type AlwaysAvailableMethods = 'vechain' | 'dappkit' | 'ecosystem';
type PrivyDependentMethods = 'email' | 'google' | 'github' | 'passkey' | 'more';

export type LoginMethodOrder = {
    method: AlwaysAvailableMethods | PrivyDependentMethods;
    gridColumn?: number;
    allowedApps?: string[]; // Only used by ecosystem method, if it's not provided, it will use default apps
};

/**
 * Props type for VeChainKitProvider
 * Defined here to avoid circular dependencies
 */
export type VechainKitProviderProps = {
    children: React.ReactNode;
    /**
     * Enable headless mode: Skip Chakra UI and modal components entirely.
     * Use this if you want to provide your own UI or use VeChainKit in headless environments.
     * When enabled:
     * - ModalProvider is not included (modals don't render)
     * - VechainKitThemeProvider skips Chakra/Emotion setup
     * - All modal-related context provides no-op functions
     * - Bundle size reduced by ~300KB (Chakra + dependencies)
     *
     * Default: false
     */
    headless?: boolean;
    privy?: {
        appId: string;
        clientId: string;
        appearance: {
            walletList?: WalletListEntry[];
            accentColor?: `#${string}`;
            loginMessage: string;
            logo: string;
        };
        embeddedWallets?: {
            createOnLogin: 'users-without-wallets' | 'all-users' | 'off';
        };
        loginMethods: PrivyLoginMethod[];
    };
    feeDelegation?: {
        delegatorUrl?: string;
        delegateAllTransactions?: boolean;
        genericDelegatorUrl?: string;
        b3trTransfers?: {
            minAmountInEther: number;
        };
    };
    dappKit?: {
        allowedWallets?: DAppKitWalletSource[];
        walletConnectOptions?: WalletConnectOptions;
        usePersistence?: boolean;
        useFirstDetectedSource?: boolean;
        logLevel?: LogLevel;
        themeVariables?: CustomizedStyle;
        modalParent?: HTMLElement;
        onSourceClick?: (source?: SourceInfo) => void;
        v2Api?: {
            enabled?: boolean;
            external?: boolean; // whether to disconnect the user on every visit
        };
    };
    loginModalUI?: {
        logo?: string;
        description?: string;
    };
    loginMethods?: LoginMethodOrder[];
    darkMode?: boolean;
    i18n?: I18n;
    language?: string;
    network?: {
        type?: string; // Accepts any string, validated internally to 'main' | 'test' | 'solo'
        nodeUrl?: string;
        requireCertificate?: boolean;
        connectionCertificate?: {
            message?: Certificate;
            options?: CertificateData;
        };
    };
    allowCustomTokens?: boolean;
    legalDocuments?: LegalDocumentOptions;
    defaultCurrency?: CURRENCY;
    theme?: VechainKitThemeConfig;
    onLanguageChange?: (language: string) => void;
    onCurrencyChange?: (currency: CURRENCY) => void;
};

/**
 * Configuration object returned by useVeChainKitConfig hook
 */
export type VeChainKitConfig = {
    privy?: VechainKitProviderProps['privy'];
    privyEcosystemAppIDS: string[];
    feeDelegation?: VechainKitProviderProps['feeDelegation'];
    dappKit?: VechainKitProviderProps['dappKit'];
    loginModalUI?: VechainKitProviderProps['loginModalUI'];
    loginMethods?: VechainKitProviderProps['loginMethods'];
    darkMode: boolean;
    /** Whether headless mode is enabled (no UI components/Chakra). */
    headless: boolean;
    i18n?: VechainKitProviderProps['i18n'];
    network: {
        type: NETWORK_TYPE;
        nodeUrl: string;
        requireCertificate?: boolean;
        connectionCertificate?: {
            message?: Certificate;
            options?: CertificateData;
        };
    };
    /** Current runtime language value. Reflects the active language in VeChainKit. */
    currentLanguage: string;
    allowCustomTokens?: boolean;
    legalDocuments?: VechainKitProviderProps['legalDocuments'];
    /** Current runtime currency value. Reflects the active currency in VeChainKit. */
    currentCurrency: CURRENCY;
    theme?: VechainKitThemeConfig;
    /** Function to change the language from the host app. Changes will sync to VeChainKit. */
    setLanguage: (language: string) => void;
    /** Function to change the currency from the host app. Changes will sync to VeChainKit. */
    setCurrency: (currency: CURRENCY) => void;
};

/**
 * Context to store the Privy and DAppKit configs so that they can be used by the hooks/components
 */
export const VeChainKitContext = createContext<VeChainKitConfig | null>(null);

/**
 * Hook to get the VeChainKit configuration
 *
 * @returns VeChainKitConfig object containing:
 * - `currentLanguage`: Current runtime language value
 * - `currentCurrency`: Current runtime currency value
 * - `setLanguage`: Function to change language from host app
 * - `setCurrency`: Function to change currency from host app
 * - Other configuration values (network, darkMode, etc.)
 *
 * @example
 * ```tsx
 * const config = useVeChainKitConfig();
 * console.log(config.currentLanguage); // 'fr' (current value)
 * console.log(config.currentCurrency); // 'eur' (current value)
 * config.setLanguage('de'); // Change language
 * ```
 */
export const useVeChainKitConfig = () => {
    const context = useContext(VeChainKitContext);
    if (!context) {
        throw new Error('useVeChainKitConfig must be used within VeChainKit');
    }
    return context;
};
