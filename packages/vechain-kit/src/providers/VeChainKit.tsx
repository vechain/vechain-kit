import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useCallback,
} from 'react';
import {
    PrivyProvider as BasePrivyProvider,
    WalletListEntry,
} from '@privy-io/react-auth';
import { DAppKitProvider, DAppKitUIOptions } from '@vechain/dapp-kit-react';
import { SmartAccountProvider } from '../hooks';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme } from '../theme';
import { PrivyLoginMethod } from '../utils';
import { ConnectModal, AccountModal } from '../components';
import { EnsureQueryClient } from './EnsureQueryClient';

type Props = {
    children: ReactNode;
    privyConfig: {
        appId: string;
        clientId: string;
        appearance: {
            walletList: WalletListEntry[];
            theme: 'dark' | 'light';
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
    feeDelegationConfig: {
        delegatorUrl: string;
        delegateAllTransactions: boolean;
    };
    dappKitConfig: DAppKitUIOptions;
    loginScreenUI?: {
        logo?: string;
        description?: string;
        preferredLoginMethods?: Array<'email' | 'google'>;
    };
};

type VeChainKitConfig = {
    privyConfig: Props['privyConfig'];
    feeDelegationConfig: Props['feeDelegationConfig'];
    dappKitConfig: Props['dappKitConfig'];
    loginScreenUI?: Props['loginScreenUI'];
    // Connect Modal
    openConnectModal: () => void;
    closeConnectModal: () => void;
    isConnectModalOpen: boolean;
    // Account Modal
    openAccountModal: () => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
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
    privyConfig,
    feeDelegationConfig,
    dappKitConfig,
    loginScreenUI,
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

    const loginMethods = [
        ...privyConfig.loginMethods,
        ...(privyConfig.ecosystemAppsID ?? []).map((appID) => `privy:${appID}`),
    ];

    // Set the color mode in localStorage to match the Privy theme
    if (
        !localStorage.getItem('chakra-ui-color-mode') ||
        localStorage.getItem('chakra-ui-color-mode') !==
            privyConfig.appearance.theme
    ) {
        localStorage.setItem(
            'chakra-ui-color-mode',
            privyConfig.appearance.theme,
        );
        localStorage.setItem('chakra-ui-color-mode-default', 'set');
    }

    return (
        <EnsureQueryClient>
            <VeChainKitContext.Provider
                value={{
                    privyConfig,
                    feeDelegationConfig,
                    dappKitConfig,
                    openConnectModal,
                    closeConnectModal,
                    isConnectModalOpen,
                    openAccountModal,
                    closeAccountModal,
                    isAccountModalOpen,
                    loginScreenUI,
                }}
            >
                <ChakraProvider theme={Theme}>
                    <BasePrivyProvider
                        appId={privyConfig.appId}
                        clientId={privyConfig.clientId}
                        config={{
                            loginMethodsAndOrder: {
                                // @ts-ignore
                                primary: loginMethods,
                            },
                            appearance: privyConfig.appearance,
                            embeddedWallets: {
                                createOnLogin:
                                    privyConfig.embeddedWallets
                                        ?.createOnLogin ?? 'all-users',
                            },
                        }}
                        allowPasskeyLinking={privyConfig.allowPasskeyLinking}
                    >
                        <DAppKitProvider
                            nodeUrl={dappKitConfig.nodeUrl}
                            genesis={dappKitConfig.genesis}
                            usePersistence
                            walletConnectOptions={
                                dappKitConfig.walletConnectOptions
                            }
                            themeMode={dappKitConfig.themeMode}
                            themeVariables={{
                                '--vdk-modal-z-index': '1000000',
                            }}
                        >
                            <SmartAccountProvider
                                nodeUrl={dappKitConfig.nodeUrl}
                                delegatorUrl={feeDelegationConfig.delegatorUrl}
                                delegateAllTransactions={
                                    feeDelegationConfig.delegateAllTransactions
                                }
                            >
                                {children}
                                <ConnectModal
                                    isOpen={isConnectModalOpen}
                                    onClose={closeConnectModal}
                                    logo={privyConfig.appearance.logo}
                                />
                                <AccountModal
                                    isOpen={isAccountModalOpen}
                                    onClose={closeAccountModal}
                                />
                            </SmartAccountProvider>
                        </DAppKitProvider>
                    </BasePrivyProvider>
                </ChakraProvider>
            </VeChainKitContext.Provider>
        </EnsureQueryClient>
    );
};
