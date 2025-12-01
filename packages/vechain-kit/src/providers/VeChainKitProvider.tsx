import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { CURRENCY, PrivyLoginMethod } from '@/types';
import { isValidUrl } from '@/utils';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';
import { initializeI18n } from '@/utils/i18n';
import {
    LoginMethodOrderOption,
    NonEmptyArray,
    PrivyProvider,
    WalletListEntry,
} from '@privy-io/react-auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    WalletSource as DAppKitWalletSource,
    LogLevel,
} from '@vechain/dapp-kit';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { WalletConnectOptions } from '@vechain/dapp-kit-react';
import { CustomizedStyle, I18n, SourceInfo } from '@vechain/dapp-kit-ui';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';
import { VechainKitThemeConfig } from '@/theme/tokens';
import {
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from '@/theme/tokens';
import {
    generateDAppKitCSSVariables,
    generatePrivyCSSVariables,
    applyPrivyCSSVariables,
    applyDAppKitButtonStyles,
    improvePrivyReadability,
} from '@/utils/cssVariables';

import i18n from '../../i18n';
import { EnsureQueryClient } from './EnsureQueryClient';
import { LegalDocumentsProvider } from './LegalDocumentsProvider';
import { ModalProvider } from './ModalProvider';
import {
    VECHAIN_KIT_STORAGE_KEYS,
    DEFAULT_PRIVY_ECOSYSTEM_APPS,
    getGenericDelegatorUrl,
} from '@/utils/constants';
import { Certificate, CertificateData } from '@vechain/sdk-core';
import { PrivyCrossAppProvider } from './PrivyCrossAppProvider';
import { PrivyWalletProvider } from './PrivyWalletProvider';

type AlwaysAvailableMethods = 'vechain' | 'dappkit' | 'ecosystem';
type PrivyDependentMethods = 'email' | 'google' | 'github' | 'passkey' | 'more';

type LoginMethodOrder = {
    method:
        | AlwaysAvailableMethods
        | (VechainKitProviderProps['privy'] extends undefined
              ? never
              : PrivyDependentMethods);
    gridColumn?: number;
    allowedApps?: string[]; // Only used by ecosystem method, if it's not provided, it will use default apps
};

export type LegalDocumentOptions = {
    privacyPolicy?: LegalDocument[];
    termsAndConditions?: LegalDocument[];
    cookiePolicy?: LegalDocument[];
};

export type LegalDocument = {
    url: string;
    version: number;
    required: boolean;
    displayName?: string;
};

export type VechainKitProviderProps = {
    children: ReactNode;
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
        // TODO: migration check these types
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
    dappKit: VechainKitProviderProps['dappKit'];
    loginModalUI?: VechainKitProviderProps['loginModalUI'];
    loginMethods?: VechainKitProviderProps['loginMethods'];
    darkMode: boolean;
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

const validateConfig = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    const errors: string[] = [];

    const validatedProps = { ...props };

    // Set default dappKit if not provided
    if (!validatedProps.dappKit) {
        validatedProps.dappKit = {
            allowedWallets: ['veworld'],
        };
    }

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

    const dappKit = _dappKit ?? {
        allowedWallets: ['veworld'] as DAppKitWalletSource[],
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

    let privyAppId: string, privyClientId: string;
    if (!privy) {
        // We set dummy values for the appId and clientId so that the PrivyProvider doesn't throw an error
        privyAppId = 'clzdb5k0b02b9qvzjm6jpknsc';
        privyClientId = 'client-WY2oy87y6KNrHFnpXuwVsiFMkwPZKTYpExtjvUQuMbCMF';
    } else {
        privyAppId = privy.appId;
        privyClientId = privy.clientId;
    }

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
        const storedLanguage = typeof window !== 'undefined' 
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
        const storedLanguage = typeof window !== 'undefined' 
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
        applyDAppKitButtonStyles();
    }, []);

    return (
        <EnsureQueryClient>
            <ReactQueryDevtools initialIsOpen={false} />
            <PrivyCrossAppProvider privyEcosystemAppIDS={allowedEcosystemApps}>
                <VeChainKitContext.Provider
                    value={{
                        privy,
                        privyEcosystemAppIDS: allowedEcosystemApps,
                        feeDelegation,
                        dappKit,
                        loginModalUI,
                        loginMethods: validatedLoginMethods,
                        darkMode,
                        i18n: i18nConfig,
                        currentLanguage,
                        network,
                        allowCustomTokens,
                        legalDocuments,
                        currentCurrency,
                        theme: customTheme,
                        setLanguage,
                        setCurrency,
                    }}
                >
                    <PrivyProvider
                        appId={privyAppId}
                        clientId={privyClientId}
                        config={{
                            // loginMethods: privy?.loginMethods,
                            loginMethodsAndOrder: {
                                primary: (privy?.loginMethods.slice(0, 4) ??
                                    []) as NonEmptyArray<LoginMethodOrderOption>,
                                overflow: (privy?.loginMethods.slice(4) ??
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
                                    privy?.appearance.accentColor ??
                                    (tokens.buttons.primaryButton.bg?.startsWith(
                                        '#',
                                    )
                                        ? (tokens.buttons.primaryButton
                                              .bg as `#${string}`)
                                        : darkMode
                                        ? '#3182CE'
                                        : '#2B6CB0'),
                                loginMessage: privy?.appearance.loginMessage,
                                logo: privy?.appearance.logo,
                            },
                            embeddedWallets: {
                                createOnLogin:
                                    privy?.embeddedWallets?.createOnLogin ??
                                    'all-users',
                            },
                            passkeys: {
                                shouldUnlinkOnUnenrollMfa: false,
                            },
                        }}
                    >
                        <DAppKitProvider
                            node={network.nodeUrl}
                            v2Api={{
                                enabled: dappKit.v2Api?.enabled ?? true, //defaults to true
                                external: dappKit.v2Api?.external ?? false, //defaults to false
                            }}
                            i18n={i18nConfig}
                            language={currentLanguage}
                            logLevel={dappKit.logLevel}
                            modalParent={dappKit.modalParent}
                            onSourceClick={dappKit.onSourceClick}
                            usePersistence={dappKit.usePersistence ?? true}
                            allowedWallets={dappKit.allowedWallets}
                            walletConnectOptions={dappKit.walletConnectOptions}
                            themeMode={darkMode ? 'DARK' : 'LIGHT'}
                            themeVariables={
                                dappKit.themeVariables
                                    ? {
                                          ...dappKitThemeVariables,
                                          ...dappKit.themeVariables,
                                      }
                                    : dappKitThemeVariables
                            }
                        >
                            <PrivyWalletProvider
                                nodeUrl={network.nodeUrl}
                                delegatorUrl={
                                    feeDelegation?.delegatorUrl ??
                                    feeDelegation?.genericDelegatorUrl
                                }
                                delegateAllTransactions={
                                    feeDelegation?.delegateAllTransactions ??
                                    false
                                }
                                genericDelegator={
                                    !feeDelegation?.delegatorUrl &&
                                    feeDelegation?.genericDelegatorUrl
                                        ? true
                                        : false
                                }
                            >
                                <ModalProvider>
                                    <LegalDocumentsProvider>
                                        {children}
                                    </LegalDocumentsProvider>
                                </ModalProvider>
                            </PrivyWalletProvider>
                        </DAppKitProvider>
                    </PrivyProvider>
                </VeChainKitContext.Provider>
            </PrivyCrossAppProvider>
        </EnsureQueryClient>
    );
};
