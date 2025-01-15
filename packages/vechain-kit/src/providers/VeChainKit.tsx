import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useCallback,
} from 'react';
import { PrivyProvider, WalletListEntry } from '@privy-io/react-auth';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { PrivyWalletProvider } from './PrivyWalletProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme } from '../theme';
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

type Props = {
    children: ReactNode;
    privy: {
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
        ecosystemAppsID?: string[];
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
    privy: Props['privy'];
    feeDelegation: Props['feeDelegation'];
    dappKit: Props['dappKit'];
    loginModalUI?: Props['loginModalUI'];
    darkMode?: Props['darkMode'];
    i18n?: Props['i18n'];
    language?: Props['language'];
    network: Props['network'];
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
    loginModalUI,
    darkMode = false,
    i18n,
    language,
    network,
}: Omit<Props, 'queryClient'>) => {
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
        ...privy.loginMethods,
        ...(privy.ecosystemAppsID ?? []).map((appID) => `privy:${appID}`),
    ].slice(0, 4); // Limit is 4 login methods

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

    return (
        <EnsureQueryClient>
            <ReactQueryDevtools initialIsOpen={false} />
            <VeChainKitContext.Provider
                value={{
                    privy,
                    feeDelegation,
                    dappKit,
                    loginModalUI,
                    darkMode,
                    i18n,
                    language,
                    network,
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
                <ChakraProvider theme={Theme}>
                    <PrivyProvider
                        appId={privy.appId}
                        clientId={privy.clientId}
                        config={{
                            loginMethodsAndOrder: {
                                // @ts-ignore
                                primary: loginMethods,
                            },
                            appearance: {
                                theme: darkMode ? 'dark' : 'light',
                                walletList: privy.appearance.walletList,
                                accentColor: privy.appearance.accentColor,
                                loginMessage: privy.appearance.loginMessage,
                                logo: privy.appearance.logo,
                            },
                            embeddedWallets: {
                                createOnLogin:
                                    privy.embeddedWallets?.createOnLogin ??
                                    'all-users',
                            },
                        }}
                        allowPasskeyLinking={privy.allowPasskeyLinking}
                    >
                        <DAppKitProvider
                            nodeUrl={
                                network.nodeUrl ??
                                getConfig(network.type).nodeUrl
                            }
                            genesis={getConfig(network.type).network.genesis}
                            i18n={i18n}
                            language={language}
                            logLevel={dappKit.logLevel}
                            modalParent={dappKit.modalParent}
                            onSourceClick={dappKit.onSourceClick}
                            usePersistence={dappKit.usePersistence ?? true}
                            walletConnectOptions={dappKit.walletConnectOptions}
                            themeMode={darkMode ? 'DARK' : 'LIGHT'}
                            themeVariables={{
                                '--vdk-modal-z-index': '1000000',

                                // Dark mode colors
                                '--vdk-color-dark-primary': '#1f1f1e',
                                '--vdk-color-dark-primary-hover': '#3c3c39',
                                '--vdk-color-dark-primary-active': '#4a4a46',
                                '--vdk-color-dark-secondary': '#2d2d2d',

                                // Light mode colors
                                '--vdk-color-light-primary': '#ffffff',
                                '--vdk-color-light-primary-hover': '#f2f2f2',
                                '--vdk-color-light-primary-active': '#eaeaea',
                                '--vdk-color-light-secondary': '#f7f7f7',

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
                                />
                            </PrivyWalletProvider>
                        </DAppKitProvider>
                    </PrivyProvider>
                </ChakraProvider>
            </VeChainKitContext.Provider>
        </EnsureQueryClient>
    );
};
