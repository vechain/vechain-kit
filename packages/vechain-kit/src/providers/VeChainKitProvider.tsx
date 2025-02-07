import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import { PrivyProvider, WalletListEntry } from '@privy-io/react-auth';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { PrivyWalletProvider } from './PrivyWalletProvider';
import { PrivyCrossAppProvider } from './PrivyCrossAppProvider';
import { PrivyLoginMethod } from '@/types';
import {
    ConnectModal,
    AccountModal,
    AccountModalContentTypes,
} from '../components';
import { EnsureQueryClient } from './EnsureQueryClient';
import {
    type LogLevel,
    type WalletSource as DAppKitWalletSource,
} from '@vechain/dapp-kit';
import { type WalletConnectOptions } from '@vechain/dapp-kit-react';
import {
    type SourceInfo,
    type CustomizedStyle,
    type I18n,
} from '@vechain/dapp-kit-ui';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import i18n from '../../i18n';
import { initializeI18n } from '@/utils/i18n';

const DEFAULT_PRIVY_ECOSYSTEM_APP_IDS = [
    'clz41gcg00e4ay75dmq3uzzgr', //cleanify
    'cm153hrup0817axti38avlfyg', //greencart
];

type LoginMethodOrder = {
    method:
        | 'email'
        | 'google'
        | 'passkey'
        | 'vechain'
        | 'dappkit'
        | 'ecosystem'
        | 'more';
    gridColumn?: number;
    allowedApps?: string[]; // Only used by ecosystem method, if it's not provided, it will use default apps
};

export type VechainKitProviderProps = {
    children: ReactNode;
    privy?: {
        appId: string;
        clientId: string;
        appearance: {
            walletList: WalletListEntry[];
            accentColor: `#${string}`;
            loginMessage: string;
            logo: string;
        };
        embeddedWallets?: {
            createOnLogin: 'users-without-wallets' | 'all-users' | 'off';
        };
        loginMethods: PrivyLoginMethod[];
        allowPasskeyLinking?: boolean;
    };
    feeDelegation: {
        delegatorUrl: string;
        delegateAllTransactions: boolean;
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
        connectionCertificate?: {
            message?: Connex.Vendor.CertMessage;
            options?: Connex.Signer.CertOptions;
        };
    };
};

type VeChainKitConfig = {
    privy?: VechainKitProviderProps['privy'];
    privyEcosystemAppIDS: string[];
    feeDelegation: VechainKitProviderProps['feeDelegation'];
    dappKit: VechainKitProviderProps['dappKit'];
    loginModalUI?: VechainKitProviderProps['loginModalUI'];
    loginMethods?: VechainKitProviderProps['loginMethods'];
    darkMode: boolean;
    i18n?: VechainKitProviderProps['i18n'];
    language?: VechainKitProviderProps['language'];
    network: VechainKitProviderProps['network'];
    // Connect Modal
    openConnectModal: () => void;
    closeConnectModal: () => void;
    isConnectModalOpen: boolean;
    // Account Modal
    openAccountModal: () => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
    setAccountModalContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    // Transaction Modal
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
    isTransactionModalOpen: boolean;
    // Transaction Toast
    openTransactionToast: () => void;
    closeTransactionToast: () => void;
    isTransactionToastOpen: boolean;
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

/**
 * Provider to wrap the application with Privy and DAppKit
 */
export const VeChainKitProvider = ({
    children,
    privy,
    feeDelegation,
    dappKit,
    loginModalUI = {
        description:
            'Choose between social login through VeChain or by connecting your wallet.',
    },
    loginMethods,
    darkMode = false,
    i18n: i18nConfig,
    language = 'en',
    network,
}: Omit<VechainKitProviderProps, 'queryClient'>) => {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const openConnectModal = useCallback(() => setIsConnectModalOpen(true), []);
    const closeConnectModal = useCallback(
        () => setIsConnectModalOpen(false),
        [],
    );

    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const openAccountModal = useCallback(() => setIsAccountModalOpen(true), []);
    const closeAccountModal = useCallback(
        () => setIsAccountModalOpen(false),
        [],
    );

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const openTransactionModal = useCallback(
        () => setIsTransactionModalOpen(true),
        [],
    );
    const closeTransactionModal = useCallback(
        () => setIsTransactionModalOpen(false),
        [],
    );

    const [isTransactionToastOpen, setIsTransactionToastOpen] = useState(false);
    const openTransactionToast = useCallback(
        () => setIsTransactionToastOpen(true),
        [],
    );
    const closeTransactionToast = useCallback(
        () => setIsTransactionToastOpen(false),
        [],
    );

    const [accountModalContent, setAccountModalContent] =
        useState<AccountModalContentTypes>('main');

    const allowedEcosystemApps = useMemo(() => {
        const userEcosystemMethods = loginMethods?.find(
            (method) => method.method === 'ecosystem',
        );
        return (
            userEcosystemMethods?.allowedApps ?? DEFAULT_PRIVY_ECOSYSTEM_APP_IDS
        );
    }, [loginMethods]);

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
                        loginMethods,
                        darkMode,
                        i18n: i18nConfig,
                        language,
                        network,
                        openConnectModal,
                        closeConnectModal,
                        isConnectModalOpen,
                        openAccountModal,
                        closeAccountModal,
                        isAccountModalOpen,
                        setAccountModalContent,
                        openTransactionModal,
                        closeTransactionModal,
                        isTransactionModalOpen,
                        openTransactionToast,
                        closeTransactionToast,
                        isTransactionToastOpen,
                    }}
                >
                    <PrivyProvider
                        appId={privyAppId}
                        clientId={privyClientId}
                        config={{
                            loginMethodsAndOrder: {
                                // @ts-ignore
                                primary: privy?.loginMethods,
                            },
                            appearance: {
                                theme: darkMode ? 'dark' : 'light',
                                walletList: privy?.appearance.walletList,
                                accentColor: privy?.appearance.accentColor,
                                loginMessage: privy?.appearance.loginMessage,
                                logo: privy?.appearance.logo,
                            },
                            embeddedWallets: {
                                createOnLogin:
                                    privy?.embeddedWallets?.createOnLogin ??
                                    'all-users',
                            },
                        }}
                        allowPasskeyLinking={privy?.allowPasskeyLinking}
                    >
                        <DAppKitProvider
                            nodeUrl={
                                network.nodeUrl ??
                                getConfig(network.type).nodeUrl
                            }
                            genesis={getConfig(network.type).network.genesis}
                            i18n={i18nConfig}
                            language={language}
                            logLevel={dappKit.logLevel}
                            modalParent={dappKit.modalParent}
                            onSourceClick={dappKit.onSourceClick}
                            usePersistence={dappKit.usePersistence ?? true}
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

                                // Font settings
                                '--vdk-font-family': 'var(--chakra-fonts-body)',
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
                                delegatorUrl={feeDelegation.delegatorUrl}
                                delegateAllTransactions={
                                    feeDelegation.delegateAllTransactions
                                }
                            >
                                {children}
                                <ConnectModal
                                    isOpen={isConnectModalOpen}
                                    onClose={closeConnectModal}
                                />
                                <AccountModal
                                    isOpen={isAccountModalOpen}
                                    onClose={closeAccountModal}
                                    initialContent={accountModalContent}
                                />
                            </PrivyWalletProvider>
                        </DAppKitProvider>
                    </PrivyProvider>
                </VeChainKitContext.Provider>
            </PrivyCrossAppProvider>
        </EnsureQueryClient>
    );
};
