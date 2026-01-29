import { ReactNode, useCallback, useState, lazy, Suspense } from 'react';
// Import context and types from ModalContext to avoid circular dependencies
// Note: ModalContext exports are made available through providers/index.ts
import { ModalContext, type AccountModalOptions } from './ModalContext';
// Use local type alias to avoid conflict with components/AccountModal/Types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AccountModalContentTypes = any;
// Import modal types from types/modal.ts to avoid circular dependency with components
import type {
    ConnectModalContentsTypes,
    UpgradeSmartAccountModalStyle,
} from '../types/modal';
// Use optional hook to handle missing DAppKitProvider during Suspense loading
import { useOptionalDAppKitWallet } from '../hooks/api/dappkit/useOptionalDAppKitWallet';
import { isBrowser } from '../utils/ssrUtils';
import { VechainKitThemeProvider } from './VechainKitThemeProvider';
// Import from VeChainKitContext to avoid circular dependency with VeChainKitProvider
import { useVeChainKitConfig } from './VeChainKitContext';

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

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const { darkMode, theme } = useVeChainKitConfig();
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectModalContent, setConnectModalContent] =
        useState<ConnectModalContentsTypes>('main');
    const [connectModalPreventAutoClose, setConnectModalPreventAutoClose] =
        useState(false);
    const { setSource, connectV2 } = useOptionalDAppKitWallet();
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
