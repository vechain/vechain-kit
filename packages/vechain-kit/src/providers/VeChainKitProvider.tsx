import { getConfig } from '../config';
import { NETWORK_TYPE } from '../config/network';
import type { CURRENCY } from '../types';
import { isValidUrl } from '../utils';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/ssrUtils';
import { initializeI18n } from '../utils/i18n';
import type {
    LoginMethodOrderOption,
    NonEmptyArray,
} from '@privy-io/react-auth';
import {
    ReactNode,
    useEffect,
    useMemo,
    useState,
    useRef,
    lazy,
    Suspense,
} from 'react';
// Import context, hook, and types from dedicated context file to break circular dependencies
// Hooks should import useVeChainKitConfig from VeChainKitContext.tsx, not from this file
import {
    VeChainKitContext,
    useVeChainKitConfig,
    type VeChainKitConfig,
    type VechainKitProviderProps,
    type LoginMethodOrder,
} from './VeChainKitContext';
import type { VechainKitThemeConfig } from '../theme/tokens';
import {
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from '../theme/tokens';

// Re-export context, hook and types from VeChainKitContext for backward compatibility
// NOTE: Hooks should prefer importing from './VeChainKitContext' to avoid circular dependencies
export {
    VeChainKitContext,
    useVeChainKitConfig,
    type VeChainKitConfig,
    type VechainKitProviderProps,
    type LoginMethodOrder,
} from './VeChainKitContext';
import {
    generateDAppKitCSSVariables,
    generatePrivyCSSVariables,
    applyPrivyCSSVariables,
    applyDAppKitButtonStyles,
    improvePrivyReadability,
} from '../utils/cssVariables';

import i18n from '../../i18n';
import { EnsureQueryClient } from './EnsureQueryClient';
import { LegalDocumentsProvider } from './LegalDocumentsProvider';
import { ModalProvider } from './ModalProvider';
import {
    VECHAIN_KIT_STORAGE_KEYS,
    DEFAULT_PRIVY_ECOSYSTEM_APPS,
    getGenericDelegatorUrl,
} from '../utils/constants';
import { Certificate, CertificateData } from '@vechain/sdk-core';
import type { PrivyCrossAppProvider as PrivyCrossAppProviderType } from './PrivyCrossAppProvider';
import { PrivyWalletProvider } from './PrivyWalletProvider';
import { ThorProvider } from './ThorProvider';

// Lazy load PrivyCrossAppProvider only when ecosystem login is enabled to reduce bundle size (~150KB wagmi)
const LazyPrivyCrossAppProvider = lazy(() =>
    import('./PrivyCrossAppProvider').then((mod) => ({
        default: mod.PrivyCrossAppProvider,
    })),
);

// Passthrough component when ecosystem login is not enabled
const CrossAppPassthrough = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);

// Lazy load ReactQueryDevtools only in development to reduce production bundle size (~100KB)
const ReactQueryDevtools =
    process.env.NODE_ENV === 'development'
        ? lazy(() =>
              import('@tanstack/react-query-devtools').then((mod) => ({
                  default: mod.ReactQueryDevtools,
              })),
          )
        : () => null;

// Lazy load PrivyProvider only when privy is configured to reduce bundle size (~500KB)
const LazyPrivyProvider = lazy(() =>
    import('@privy-io/react-auth').then((mod) => ({
        default: mod.PrivyProvider,
    })),
);

// Lazy load DAppKitProvider only when dappKit is configured to reduce bundle size (~200KB)
const LazyDAppKitProvider = lazy(() =>
    import('@vechain/dapp-kit-react').then((mod) => ({
        default: mod.DAppKitProvider,
    })),
);

// Passthrough component when Privy is not configured
const PrivyPassthrough = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);

// Re-export types from ../types for backward compatibility
// These types are now defined in types/types.ts to avoid circular dependencies
export type { LegalDocument, LegalDocumentOptions } from '../types';

const validateConfig = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    const errors: string[] = [];

    const validatedProps = { ...props };

    // NOTE: dappKit is now optional - if not provided, DAppKitProvider will not be loaded
    // This allows apps that only use Privy to avoid bundling @vechain/dapp-kit-react
    // For backward compatibility, apps that explicitly pass dappKit: {} will get default wallet config

    // Check if fee delegation is required based on conditions
    const requiresFeeDelegation =
        validatedProps.privy !== undefined ||
        validatedProps.loginMethods?.some(
            (method) =>
                method.method === 'vechain' || method.method === 'ecosystem',
        );

    // Validate fee delegation
    if (requiresFeeDelegation) {
        if (!validatedProps.feeDelegation) {
            validatedProps.feeDelegation = {
                genericDelegatorUrl: getGenericDelegatorUrl(),
            };
        } else {
            if (
                !validatedProps.feeDelegation.delegatorUrl &&
                !validatedProps.feeDelegation.genericDelegatorUrl
            ) {
                validatedProps.feeDelegation.genericDelegatorUrl =
                    getGenericDelegatorUrl();
            }
        }
    }

    // Validate network - always ensure we have a valid network configuration
    if (!validatedProps.network || !validatedProps.network.type) {
        validatedProps.network = {
            type: 'main',
        };
    } else {
        const networkType = validatedProps.network.type;
        // Validate and narrow the network type
        if (!['main', 'test', 'solo'].includes(networkType)) {
            // Provide helpful error with the invalid value
            errors.push('network.type must be either "main", "test" or "solo"');
        }
    }

    // Set default login methods if not provided
    if (!validatedProps.loginMethods) {
        validatedProps.loginMethods = [
            { method: 'vechain', gridColumn: 4 },
            { method: 'ecosystem', gridColumn: 4 },
            { method: 'dappkit', gridColumn: 4 },
        ];
    }

    // Validate login methods if Privy is not configured
    if (validatedProps.loginMethods) {
        if (!validatedProps.privy) {
            const invalidMethods = validatedProps.loginMethods.filter(
                (method) =>
                    ['email', 'google', 'passkey', 'more'].includes(
                        method.method,
                    ),
            );

            if (invalidMethods.length > 0) {
                errors.push(
                    `Login methods ${invalidMethods
                        .map((m) => `"${m.method}"`)
                        .join(', ')} require Privy configuration. ` +
                        `Please either remove these methods or configure the privy prop.`,
                );
            }
        }
    }

    if (validatedProps?.legalDocuments) {
        if (validatedProps.legalDocuments.termsAndConditions) {
            validatedProps.legalDocuments.termsAndConditions.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.termsAndConditions.url is invalid: ${term.url}`,
                    );
                }
            });
        }
        if (validatedProps.legalDocuments.privacyPolicy) {
            validatedProps.legalDocuments.privacyPolicy.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.privacyPolicy.url is invalid: ${term.url}`,
                    );
                }
            });
        }
        if (validatedProps.legalDocuments.cookiePolicy) {
            validatedProps.legalDocuments.cookiePolicy.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.cookiePolicy.url is invalid: ${term.url}`,
                    );
                }
            });
        }
    }

    if (errors.length > 0) {
        throw new Error(
            'VeChainKit Configuration Error:\n' + errors.join('\n'),
        );
    }

    return validatedProps;
};

/**
 * Provider to wrap the application with Privy and DAppKit
 */
const CURRENCY_STORAGE_KEY = 'vechain_kit_currency';

export const VeChainKitProvider = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    // Validate all configurations at the start
    const validatedProps = validateConfig(props);
    const {
        children,
        headless = false,
        privy,
        feeDelegation,
        dappKit: _dappKit,
        loginModalUI,
        loginMethods,
        darkMode = false,
        i18n: i18nConfig,
        language = 'en',
        network: _network,
        allowCustomTokens,
        legalDocuments,
        defaultCurrency = 'usd',
        theme: customTheme,
        onLanguageChange,
        onCurrencyChange,
    } = validatedProps;

    // After validation, network and dappKit are guaranteed to be defined
    // Cast the network type to NETWORK_TYPE since validation ensures it's valid
    const networkType = (_network?.type ?? 'main') as NETWORK_TYPE;

    //To avoid this fallback across the codebase, do it globally in the provider
    const nodeUrl = _network?.nodeUrl ?? getConfig(networkType).nodeUrl;

    const network = {
        ..._network,
        type: networkType,
        nodeUrl,
    };

    // DAppKit config - now optional; if not provided, DAppKitProvider won't be rendered
    // Apps using only Privy can omit this to reduce bundle size
    const dappKit = _dappKit;
    const isDAppKitConfigured = !!_dappKit;

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

    // Remove the validateLoginMethods call since it's now handled in validateConfig
    const validatedLoginMethods = loginMethods;

    const allowedEcosystemApps = useMemo(() => {
        const userEcosystemMethods = validatedLoginMethods?.find(
            (method) => method.method === 'ecosystem',
        );
        return (
            userEcosystemMethods?.allowedApps ??
            DEFAULT_PRIVY_ECOSYSTEM_APPS.map((app) => app.id)
        );
    }, [validatedLoginMethods]);

    // Check if Privy is configured
    const isPrivyConfigured = !!privy;

    // Check if ecosystem login is enabled in loginMethods
    // This determines whether we need to load PrivyCrossAppProvider/wagmi
    const isEcosystemLoginEnabled = useMemo(() => {
        return validatedLoginMethods?.some(
            (method) => method.method === 'ecosystem' || method.method === 'vechain',
        ) ?? false;
    }, [validatedLoginMethods]);

    // Initialize i18n with stored language or prop, and merge translations
    useEffect(() => {
        // Initialize translations from VeChainKit
        initializeI18n(i18n);

        if (i18nConfig) {
            // Add custom translations from the app if provided
            Object.keys(i18nConfig).forEach((lang) => {
                i18n.addResourceBundle(
                    lang,
                    'translation',
                    i18nConfig[lang],
                    true,
                    true,
                );
            });
        }

        // Initialize i18n with stored language or currentLanguage state
        // This ensures stored preferences are respected on page refresh
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
    }, []); // Only run once on mount

    // Sync language prop changes to i18n and state (but only if no stored value exists)
    useEffect(() => {
        // Skip on initial mount - let the initialization effect handle it
        const storedLanguage =
            typeof window !== 'undefined'
                ? getLocalStorageItem('i18nextLng')
                : null;

        // Only sync prop if there's no stored preference and prop differs from current
        if (language && !storedLanguage && language !== currentLanguage) {
            isUpdatingFromPropRef.current = true;
            i18n.changeLanguage(language);
            setCurrentLanguageState(language);
            isUpdatingFromPropRef.current = false;
        }
    }, [language, currentLanguage]);

    // Listen to i18n language changes (from kit settings)
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

    // Sync currency prop changes to state (but only if no stored value exists)
    useEffect(() => {
        const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);

        // Only sync prop if there's no stored preference and prop differs from current
        if (defaultCurrency && !stored && defaultCurrency !== currentCurrency) {
            isUpdatingCurrencyFromPropRef.current = true;
            setCurrentCurrencyState(defaultCurrency);
            setLocalStorageItem(CURRENCY_STORAGE_KEY, defaultCurrency);
            isUpdatingCurrencyFromPropRef.current = false;
        }
    }, [defaultCurrency, currentCurrency]);

    // Listen to currency localStorage changes (from kit settings)
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

        // Check on mount
        checkCurrencyChange();

        // Listen to storage events (for cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CURRENCY_STORAGE_KEY && e.newValue) {
                checkCurrencyChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes (in case storage event doesn't fire)
        const interval = setInterval(checkCurrencyChange, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [currentCurrency, onCurrencyChange]);

    // Functions to set language/currency from host app
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

    useEffect(() => {
        setLocalStorageItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK, networkType);
    }, [networkType]);

    // Generate tokens from custom theme config
    const tokens = useMemo(() => {
        const defaultTokens = getDefaultTokens(darkMode);
        const customTokens = convertThemeConfigToTokens(customTheme, darkMode);
        return mergeTokens(defaultTokens, customTokens);
    }, [customTheme, darkMode]);

    // Generate CSS variables for DAppKit and Privy
    const dappKitThemeVariables = useMemo(
        () => generateDAppKitCSSVariables(tokens, darkMode),
        [tokens, darkMode],
    );

    const privyCSSVariables = useMemo(
        () => generatePrivyCSSVariables(tokens, darkMode),
        [tokens, darkMode],
    );

    // Apply Privy CSS variables to document and inject backdrop filter + card styles
    useEffect(() => {
        // Prepare card backgrounds with readability improvements
        const privyCardBg = improvePrivyReadability(
            tokens.colors.background.card,
            darkMode,
        );
        const privyCardElevatedBg = improvePrivyReadability(
            tokens.colors.background.cardElevated,
            darkMode,
        );
        // Use loginIn variant style: white (light) / transparent (dark) background
        const privyButtonBaseBg = darkMode ? 'transparent' : '#ffffff';
        const privyButtonHoverBg = darkMode ? 'transparent' : '#ffffff';
        const privyButtonActiveBg = darkMode ? 'transparent' : '#ffffff';

        applyPrivyCSSVariables(
            privyCSSVariables,
            tokens.effects.backdropFilter.modal,
            privyCardBg,
            privyCardElevatedBg,
            privyButtonBaseBg,
            privyButtonHoverBg,
            privyButtonActiveBg,
            tokens.colors.border.default,
        );
    }, [
        privyCSSVariables,
        tokens.effects.backdropFilter.modal,
        tokens.colors.background.card,
        tokens.colors.background.cardElevated,
        tokens.colors.border.default,
        darkMode,
    ]);

    // Apply DAppKit button styles (hover opacity matching loginIn variant)
    useEffect(() => {
        if (isDAppKitConfigured) {
            applyDAppKitButtonStyles();
        }
    }, [isDAppKitConfigured]);

    // Core content that contains modals and legal documents
    // In headless mode, skip ModalProvider to avoid loading Chakra UI (~300KB)
    const coreContent = isPrivyConfigured ? (
        <PrivyWalletProvider
            nodeUrl={network.nodeUrl}
            delegatorUrl={
                feeDelegation?.delegatorUrl ??
                feeDelegation?.genericDelegatorUrl
            }
            delegateAllTransactions={
                feeDelegation?.delegateAllTransactions ?? false
            }
            genericDelegator={
                !feeDelegation?.delegatorUrl &&
                feeDelegation?.genericDelegatorUrl
                    ? true
                    : false
            }
        >
            {headless ? (
                <LegalDocumentsProvider>{children}</LegalDocumentsProvider>
            ) : (
                <ModalProvider>
                    <LegalDocumentsProvider>{children}</LegalDocumentsProvider>
                </ModalProvider>
            )}
        </PrivyWalletProvider>
    ) : headless ? (
        <LegalDocumentsProvider>{children}</LegalDocumentsProvider>
    ) : (
        <ModalProvider>
            <LegalDocumentsProvider>{children}</LegalDocumentsProvider>
        </ModalProvider>
    );

    // Inner content wrapped by DAppKitProvider or ThorProvider (fallback)
    const innerContent = isDAppKitConfigured ? (
        <Suspense fallback={<ThorProvider nodeUrl={network.nodeUrl}>{coreContent}</ThorProvider>}>
            <LazyDAppKitProvider
                node={network.nodeUrl}
                alwaysShowConnect={true}
                v2Api={{
                    enabled: dappKit?.v2Api?.enabled ?? true, //defaults to true
                    external: dappKit?.v2Api?.external ?? false, //defaults to false
                }}
                language={currentLanguage}
                logLevel={dappKit?.logLevel}
                modalParent={dappKit?.modalParent}
                onSourceClick={dappKit?.onSourceClick}
                usePersistence={dappKit?.usePersistence ?? true}
                allowedWallets={dappKit?.allowedWallets}
                walletConnectOptions={dappKit?.walletConnectOptions}
                themeMode={darkMode ? 'DARK' : 'LIGHT'}
                themeVariables={
                    dappKit?.themeVariables
                        ? {
                              ...dappKitThemeVariables,
                              ...dappKit.themeVariables,
                          }
                        : dappKitThemeVariables
                }
            >
                {coreContent}
            </LazyDAppKitProvider>
        </Suspense>
    ) : (
        // When DAppKit is not configured, use ThorProvider for Thor client access
        <ThorProvider nodeUrl={network.nodeUrl}>{coreContent}</ThorProvider>
    );

    // Conditionally wrap with PrivyProvider only when privy is configured
    const privyWrappedContent = isPrivyConfigured ? (
        <Suspense fallback={innerContent}>
            <LazyPrivyProvider
                appId={privy.appId}
                clientId={privy.clientId}
                config={{
                    loginMethodsAndOrder: {
                        primary: (privy.loginMethods.slice(0, 4) ??
                            []) as NonEmptyArray<LoginMethodOrderOption>,
                        overflow: (privy.loginMethods.slice(4) ??
                            []) as Array<LoginMethodOrderOption>,
                    },
                    externalWallets: {
                        walletConnect: {
                            enabled: false,
                        },
                    },
                    appearance: {
                        theme: darkMode ? 'dark' : 'light',
                        accentColor:
                            privy.appearance.accentColor ??
                            (tokens.buttons.primaryButton.bg?.startsWith('#')
                                ? (tokens.buttons.primaryButton
                                      .bg as `#${string}`)
                                : darkMode
                                ? '#3182CE'
                                : '#2B6CB0'),
                        loginMessage: privy.appearance.loginMessage,
                        logo: privy.appearance.logo,
                    },
                    embeddedWallets: {
                        createOnLogin:
                            privy.embeddedWallets?.createOnLogin ?? 'all-users',
                    },
                    passkeys: {
                        shouldUnlinkOnUnenrollMfa: false,
                    },
                }}
            >
                {innerContent}
            </LazyPrivyProvider>
        </Suspense>
    ) : (
        innerContent
    );

    // Context value for the provider
    const contextValue = {
        privy,
        privyEcosystemAppIDS: allowedEcosystemApps,
        feeDelegation,
        dappKit,
        loginModalUI,
        loginMethods: validatedLoginMethods,
        darkMode,
        headless,
        i18n: i18nConfig,
        currentLanguage,
        network,
        allowCustomTokens,
        legalDocuments,
        currentCurrency,
        theme: customTheme,
        setLanguage,
        setCurrency,
    };

    // Core content without ecosystem provider
    const coreProviderContent = (
        <VeChainKitContext.Provider value={contextValue}>
            {privyWrappedContent}
        </VeChainKitContext.Provider>
    );

    // Conditionally wrap with PrivyCrossAppProvider only when ecosystem login is enabled
    // This avoids bundling wagmi (~150KB) for apps that don't use ecosystem login
    const ecosystemWrappedContent = isEcosystemLoginEnabled ? (
        <Suspense fallback={coreProviderContent}>
            <LazyPrivyCrossAppProvider privyEcosystemAppIDS={allowedEcosystemApps}>
                {coreProviderContent}
            </LazyPrivyCrossAppProvider>
        </Suspense>
    ) : (
        coreProviderContent
    );

    return (
        <EnsureQueryClient>
            {process.env.NODE_ENV === 'development' && (
                <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                </Suspense>
            )}
            {ecosystemWrappedContent}
        </EnsureQueryClient>
    );
};
