import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { PrivyProvider, WalletListEntry } from '@privy-io/react-auth';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { PrivyWalletProvider } from './PrivyWalletProvider';
import { PrivyCrossAppProvider } from './PrivyCrossAppProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { VechainKitTheme } from '../theme';
import { PrivyLoginMethod } from '@/types';
import { ConnectModal, AccountModal } from '../components';
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

const DEFAULT_PRIVY_ECOSYSTEM_APP_IDS = [
    'cm4wxxujb022fyujl7g0thb21', //vechain
    'clz41gcg00e4ay75dmq3uzzgr', //cleanify
    'cm153hrup0817axti38avlfyg', //greencart
];

export type VechainKitProps = {
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
    privyEcosystemAppIDS?: string[];
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
        preferredLoginMethods?: Array<'email' | 'google'>;
    };
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
    privy?: VechainKitProps['privy'];
    privyEcosystemAppIDS: string[];
    feeDelegation: VechainKitProps['feeDelegation'];
    dappKit: VechainKitProps['dappKit'];
    loginModalUI?: VechainKitProps['loginModalUI'];
    darkMode?: VechainKitProps['darkMode'];
    i18n?: VechainKitProps['i18n'];
    language?: VechainKitProps['language'];
    network: VechainKitProps['network'];
    privySocialLoginEnabled: boolean;
    // Connect Modal
    openConnectModal: () => void;
    closeConnectModal: () => void;
    isConnectModalOpen: boolean;
    // Account Modal
    openAccountModal: () => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
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
export const VeChainKit = ({
    children,
    privy,
    feeDelegation,
    dappKit,
    loginModalUI = {
        description:
            'Choose between social login through VeChain or by connecting your wallet.',
    },
    darkMode = false,
    i18n: i18nConfig,
    language,
    network,
    privyEcosystemAppIDS = DEFAULT_PRIVY_ECOSYSTEM_APP_IDS,
}: Omit<VechainKitProps, 'queryClient'>) => {
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

    const loginMethods = [
        ...(privy?.loginMethods ?? []),
        ...(privyEcosystemAppIDS ?? []).map((appID) => `privy:${appID}`),
    ].slice(0, 4); // Limit is 4 login methods

    let privyAppId: string, privyClientId: string;
    if (!privy) {
        // We set dummy values for the appId and clientId so that the PrivyProvider doesn't throw an error
        privyAppId = 'clzdb5k0b02b9qvzjm6jpknsc';
        privyClientId = 'client-WY2oy87y6KNrHFnpXuwVsiFMkwPZKTYpExtjvUQuMbCMF';
    } else {
        privyAppId = privy.appId;
        privyClientId = privy.clientId;
    }

    // Set the color mode in localStorage to match the Privy theme
    if (
        !localStorage.getItem('chakra-ui-color-mode') ||
        localStorage.getItem('chakra-ui-color-mode') !==
            (darkMode ? 'dark' : 'light')
    ) {
        localStorage.setItem(
            'chakra-ui-color-mode',
            darkMode ? 'dark' : 'light',
        );
        localStorage.setItem('chakra-ui-color-mode-default', 'set');
    }

    // Initialize i18n with the provided language
    useEffect(() => {
        if (language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    return (
        <EnsureQueryClient>
            <ReactQueryDevtools initialIsOpen={false} />
            <PrivyCrossAppProvider privyEcosystemAppIDS={privyEcosystemAppIDS}>
                <VeChainKitContext.Provider
                    value={{
                        privy,
                        privyEcosystemAppIDS,
                        feeDelegation,
                        dappKit,
                        loginModalUI,
                        darkMode,
                        i18n: i18nConfig,
                        language,
                        network,
                        privySocialLoginEnabled: privy !== undefined,
                        openConnectModal,
                        closeConnectModal,
                        isConnectModalOpen,
                        openAccountModal,
                        closeAccountModal,
                        isAccountModalOpen,
                        openTransactionModal,
                        closeTransactionModal,
                        isTransactionModalOpen,
                        openTransactionToast,
                        closeTransactionToast,
                        isTransactionToastOpen,
                    }}
                >
                    <ChakraProvider theme={VechainKitTheme}>
                        <PrivyProvider
                            appId={privyAppId}
                            clientId={privyClientId}
                            config={{
                                loginMethodsAndOrder: {
                                    // @ts-ignore
                                    primary: loginMethods,
                                },
                                appearance: {
                                    theme: darkMode ? 'dark' : 'light',
                                    walletList: privy?.appearance.walletList,
                                    accentColor: privy?.appearance.accentColor,
                                    loginMessage:
                                        privy?.appearance.loginMessage,
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
                                genesis={
                                    getConfig(network.type).network.genesis
                                }
                                i18n={i18nConfig}
                                language={language}
                                logLevel={dappKit.logLevel}
                                modalParent={dappKit.modalParent}
                                onSourceClick={dappKit.onSourceClick}
                                usePersistence={dappKit.usePersistence ?? true}
                                walletConnectOptions={
                                    dappKit.walletConnectOptions
                                }
                                themeMode={darkMode ? 'DARK' : 'LIGHT'}
                                themeVariables={{
                                    '--vdk-modal-z-index': '10000',

                                    // Dark mode colors
                                    '--vdk-color-dark-primary': '#1f1f1e',
                                    '--vdk-color-dark-primary-hover': '#3c3c39',
                                    '--vdk-color-dark-primary-active':
                                        '#4a4a46',
                                    '--vdk-color-dark-secondary': '#2d2d2d',

                                    // Light mode colors
                                    '--vdk-color-light-primary': '#ffffff',
                                    '--vdk-color-light-primary-hover':
                                        '#f2f2f2',
                                    '--vdk-color-light-primary-active':
                                        '#eaeaea',
                                    '--vdk-color-light-secondary': '#f7f7f7',

                                    // Font settings
                                    '--vdk-font-family':
                                        'var(--chakra-fonts-body)',
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
                                    />
                                </PrivyWalletProvider>
                            </DAppKitProvider>
                        </PrivyProvider>
                    </ChakraProvider>
                </VeChainKitContext.Provider>
            </PrivyCrossAppProvider>
        </EnsureQueryClient>
    );
};
