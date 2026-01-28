import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
    lazy,
    Suspense,
} from 'react';
import type {
    AccountModalContentTypes,
    ConnectModalContentsTypes,
    UpgradeSmartAccountModalStyle,
} from '../components';
import { useDAppKitWallet } from '../hooks';
import { isBrowser } from '../utils/ssrUtils';
import { VechainKitThemeProvider } from './VechainKitThemeProvider';
import { useVeChainKitConfig } from './VeChainKitProvider';

// Lazy load modal components to reduce initial bundle size (~500KB total)
// Modals are only loaded when they are actually opened
const LazyConnectModal = lazy(() =>
    import('../components/ConnectModal').then((mod) => ({
        default: mod.ConnectModal,
    })),
);

const LazyAccountModal = lazy(() =>
    import('../components/AccountModal').then((mod) => ({
        default: mod.AccountModal,
    })),
);

const LazyUpgradeSmartAccountModal = lazy(() =>
    import('../components/UpgradeSmartAccountModal').then((mod) => ({
        default: mod.UpgradeSmartAccountModal,
    })),
);

export type AccountModalOptions = {
    isolatedView?: boolean;
};

type ModalContextType = {
    // Connect Modal
    openConnectModal: (
        initialContent?: ConnectModalContentsTypes,
        preventAutoClose?: boolean,
    ) => void;
    closeConnectModal: () => void;
    isConnectModalOpen: boolean;
    connectModalContent: ConnectModalContentsTypes;
    setConnectModalContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    connectModalPreventAutoClose: boolean;
    setConnectModalPreventAutoClose: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    // Account Modal
    openAccountModal: (
        content?: AccountModalContentTypes,
        options?: AccountModalOptions,
    ) => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
    // Account Modal Content State
    accountModalContent: AccountModalContentTypes;
    setAccountModalContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    // Account Modal Options
    isolatedView: boolean;
    // Transaction Modal
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
    isTransactionModalOpen: boolean;
    // Transaction Toast
    openTransactionToast: () => void;
    closeTransactionToast: () => void;
    isTransactionToastOpen: boolean;
    // Upgrade Smart Account Modal
    openUpgradeSmartAccountModal: (
        style?: UpgradeSmartAccountModalStyle,
    ) => void;
    closeUpgradeSmartAccountModal: () => void;
    isUpgradeSmartAccountModalOpen: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

// Default no-op modal context for headless mode
// Provides safe defaults so hooks work without ModalProvider
const headlessModalContext: ModalContextType = {
    openConnectModal: () => {
        console.warn(
            'VeChainKit: openConnectModal called in headless mode. Modals are disabled when headless=true.',
        );
    },
    closeConnectModal: () => {},
    isConnectModalOpen: false,
    connectModalContent: 'main',
    setConnectModalContent: () => {},
    connectModalPreventAutoClose: false,
    setConnectModalPreventAutoClose: () => {},
    openAccountModal: () => {
        console.warn(
            'VeChainKit: openAccountModal called in headless mode. Modals are disabled when headless=true.',
        );
    },
    closeAccountModal: () => {},
    isAccountModalOpen: false,
    accountModalContent: 'main',
    setAccountModalContent: () => {},
    isolatedView: false,
    openTransactionModal: () => {
        console.warn(
            'VeChainKit: openTransactionModal called in headless mode. Modals are disabled when headless=true.',
        );
    },
    closeTransactionModal: () => {},
    isTransactionModalOpen: false,
    openTransactionToast: () => {
        console.warn(
            'VeChainKit: openTransactionToast called in headless mode. Toasts are disabled when headless=true.',
        );
    },
    closeTransactionToast: () => {},
    isTransactionToastOpen: false,
    openUpgradeSmartAccountModal: () => {
        console.warn(
            'VeChainKit: openUpgradeSmartAccountModal called in headless mode. Modals are disabled when headless=true.',
        );
    },
    closeUpgradeSmartAccountModal: () => {},
    isUpgradeSmartAccountModalOpen: false,
};

export const useModal = () => {
    const context = useContext(ModalContext);
    // In headless mode, ModalProvider is not rendered, so context will be null
    // Return no-op context to allow hooks to work without errors
    if (!context) {
        return headlessModalContext;
    }
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const { darkMode, theme } = useVeChainKitConfig();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectModalContent, setConnectModalContent] =
        useState<ConnectModalContentsTypes>('main');
    const [connectModalPreventAutoClose, setConnectModalPreventAutoClose] =
        useState(false);
    const { setSource, connectV2 } = useDAppKitWallet();
    const openConnectModal = useCallback(
        (
            initialContent?: ConnectModalContentsTypes,
            preventAutoClose?: boolean,
        ) => {
            // If the user is in the veworld app, connect to the wallet
            if (
                isBrowser() &&
                window.vechain &&
                window.vechain.isInAppBrowser
            ) {
                setSource('veworld');
                connectV2(null);
            } else {
                // Always set the content - default to 'main' if not provided
                setConnectModalContent(initialContent ?? 'main');
                setConnectModalPreventAutoClose(preventAutoClose ?? false);
                setIsConnectModalOpen(true);
            }
        },
        [],
    );
    const closeConnectModal = useCallback(() => {
        setIsConnectModalOpen(false);
        // Reset content to main when modal closes
        setConnectModalContent('main');
        setConnectModalPreventAutoClose(false);
    }, []);

    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isolatedView, setIsolatedView] = useState(false);
    const [accountModalContent, setAccountModalContent] =
        useState<AccountModalContentTypes>('main');

    const openAccountModal = useCallback(
        (content?: AccountModalContentTypes, options?: AccountModalOptions) => {
            setAccountModalContent(content ?? 'main');
            setIsolatedView(options?.isolatedView ?? false);
            setIsAccountModalOpen(true);
        },
        [],
    );
    const closeAccountModal = useCallback(() => {
        setIsAccountModalOpen(false);
        // Reset content to main when modal closes
        setAccountModalContent('main');
        // Reset isolatedView after modal close animation completes
        setTimeout(() => {
            setIsolatedView(false);
        }, 300);
    }, []);

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

    const [isUpgradeSmartAccountModalOpen, setIsUpgradeSmartAccountModalOpen] =
        useState(false);
    const [upgradeSmartAccountModalStyle, setUpgradeSmartAccountModalStyle] =
        useState<UpgradeSmartAccountModalStyle | undefined>(undefined);
    const openUpgradeSmartAccountModal = useCallback(
        (style?: UpgradeSmartAccountModalStyle) => {
            setUpgradeSmartAccountModalStyle(style);
            setIsUpgradeSmartAccountModalOpen(true);
        },
        [],
    );
    const closeUpgradeSmartAccountModal = useCallback(
        () => setIsUpgradeSmartAccountModalOpen(false),
        [],
    );

    return (
        <ModalContext.Provider
            value={{
                openConnectModal,
                closeConnectModal,
                isConnectModalOpen,
                connectModalContent,
                setConnectModalContent,
                connectModalPreventAutoClose,
                setConnectModalPreventAutoClose,
                openAccountModal,
                closeAccountModal,
                isAccountModalOpen,
                setAccountModalContent,
                accountModalContent,
                isolatedView,
                openTransactionModal,
                closeTransactionModal,
                isTransactionModalOpen,
                openTransactionToast,
                closeTransactionToast,
                isTransactionToastOpen,
                openUpgradeSmartAccountModal,
                closeUpgradeSmartAccountModal,
                isUpgradeSmartAccountModalOpen,
            }}
        >
            {children}
            <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
                {/* Lazy-load modals only when they are opened to reduce initial bundle size */}
                {isConnectModalOpen && (
                    <Suspense fallback={null}>
                        <LazyConnectModal
                            isOpen={isConnectModalOpen}
                            onClose={closeConnectModal}
                            initialContent={connectModalContent}
                            preventAutoClose={connectModalPreventAutoClose}
                        />
                    </Suspense>
                )}
                {isAccountModalOpen && (
                    <Suspense fallback={null}>
                        <LazyAccountModal
                            isOpen={isAccountModalOpen}
                            onClose={closeAccountModal}
                            initialContent={accountModalContent}
                        />
                    </Suspense>
                )}
                {isUpgradeSmartAccountModalOpen && (
                    <Suspense fallback={null}>
                        <LazyUpgradeSmartAccountModal
                            isOpen={isUpgradeSmartAccountModalOpen}
                            onClose={closeUpgradeSmartAccountModal}
                            style={upgradeSmartAccountModalStyle}
                        />
                    </Suspense>
                )}
            </VechainKitThemeProvider>
        </ModalContext.Provider>
    );
};
