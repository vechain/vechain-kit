import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { CURRENCY, PrivyLoginMethod } from '@/types';
import { isValidUrl, setLocalStorageItem } from '@/utils';
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
} from 'react';

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
    dappKit: {
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
    network: {
        type: NETWORK_TYPE;
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
};

type VeChainKitConfig = {
    privy?: VechainKitProviderProps['privy'];
    privyEcosystemAppIDS: string[];
    feeDelegation?: VechainKitProviderProps['feeDelegation'];
    dappKit: VechainKitProviderProps['dappKit'];
    loginModalUI?: VechainKitProviderProps['loginModalUI'];
    loginMethods?: VechainKitProviderProps['loginMethods'];
    darkMode: boolean;
    i18n?: VechainKitProviderProps['i18n'];
    language?: VechainKitProviderProps['language'];
    network: VechainKitProviderProps['network'];
    allowCustomTokens?: boolean;
    legalDocuments?: VechainKitProviderProps['legalDocuments'];
    defaultCurrency?: VechainKitProviderProps['defaultCurrency'];
};

/**
 * Context to store the Privy and DAppKit configs so that they can be used by the hooks/components
 */
export const VeChainKitContext = createContext<VeChainKitConfig | null>(null);

/**
 * Hook to get the Privy and DAppKit configs
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

    // Validate network
    if (!validatedProps.network) {
        errors.push('network configuration is required');
    } else {
        if (!validatedProps.network.type) {
            errors.push('network.type is required');
        }
        if (!['main', 'test', 'solo'].includes(validatedProps.network.type)) {
            errors.push('network.type must be either "main", "test" or "solo"');
        }
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
export const VeChainKitProvider = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    // Validate all configurations at the start
    const validatedProps = validateConfig(props);
    const {
        children,
        privy,
        feeDelegation,
        dappKit,
        loginModalUI,
        loginMethods,
        darkMode = false,
        i18n: i18nConfig,
        language = 'en',
        network,
        allowCustomTokens,
        legalDocuments,
        defaultCurrency = 'usd',
    } = validatedProps;

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

    // Initialize i18n with the provided language and merge translations
    useEffect(() => {
        // Initialize translations from VeChainKit
        initializeI18n(i18n);

        if (language) {
            i18n.changeLanguage(language);
        }

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
    }, [language, i18nConfig]);

    useEffect(() => {
        setLocalStorageItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK, network.type);
    }, [network]);

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
                        language,
                        network: {
                            ...network,
                            nodeUrl:
                                network.nodeUrl ??
                                getConfig(network?.type)?.nodeUrl,
                        },
                        allowCustomTokens,
                        legalDocuments,
                        defaultCurrency,
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
                                    (darkMode ? '#3182CE' : '#2B6CB0'),
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
                            node={
                                network.nodeUrl ??
                                getConfig(network.type).nodeUrl
                            }
                            v2Api={{
                                enabled: dappKit.v2Api?.enabled ?? true, //defaults to true
                                external: dappKit.v2Api?.external ?? false, //defaults to false
                            }}
                            i18n={i18nConfig}
                            language={language}
                            logLevel={dappKit.logLevel}
                            modalParent={dappKit.modalParent}
                            onSourceClick={dappKit.onSourceClick}
                            usePersistence={dappKit.usePersistence ?? true}
                            allowedWallets={dappKit.allowedWallets}
                            walletConnectOptions={dappKit.walletConnectOptions}
                            themeMode={darkMode ? 'DARK' : 'LIGHT'}
                            themeVariables={{
                                '--vdk-modal-z-index': '10000',
                                '--vdk-modal-width': '22rem',
                                '--vdk-modal-backdrop-filter': 'blur(3px)',
                                '--vdk-border-dark-source-card': `1px solid ${'#ffffff0a'}`,
                                '--vdk-border-light-source-card': `1px solid ${'#ebebeb'}`,

                                // Dark mode colors
                                '--vdk-color-dark-primary': 'transparent',
                                '--vdk-color-dark-primary-hover':
                                    'rgba(255, 255, 255, 0.05)',
                                '--vdk-color-dark-primary-active':
                                    'rgba(255, 255, 255, 0.1)',
                                '--vdk-color-dark-secondary': '#1f1f1e',

                                // Light mode colors
                                '--vdk-color-light-primary': '#ffffff',
                                '--vdk-color-light-primary-hover': '#f8f8f8',
                                '--vdk-color-light-primary-active': '#f0f0f0',
                                '--vdk-color-light-secondary': 'white',

                                // Font settings - using system fonts instead of Chakra variables
                                '--vdk-font-family':
                                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                '--vdk-font-size-medium': '14px',
                                '--vdk-font-size-large': '16px',
                                '--vdk-font-weight-medium': '500',
                            }}
                        >
                            <PrivyWalletProvider
                                nodeUrl={
                                    network.nodeUrl ??
                                    getConfig(network.type).nodeUrl
                                }
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
