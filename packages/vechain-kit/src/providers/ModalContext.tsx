/**
 * ModalContext.tsx
 *
 * This file contains the Modal context and useModal hook, extracted from ModalProvider.tsx
 * to break circular dependencies.
 *
 * The pattern is similar to VeChainKitContext.tsx:
 * - ModalContext.tsx contains only the context, types, and hook (no components)
 * - ModalProvider.tsx imports from ModalContext.tsx and provides the implementation
 * - Hooks import from ModalContext.tsx instead of ModalProvider.tsx
 *
 * This breaks the cycle:
 *   hooks/modals/useXModal.tsx → providers/ModalProvider.tsx → components → hooks
 *
 * Now:
 *   hooks/modals/useXModal.tsx → providers/ModalContext.tsx (no components imported)
 */
import { createContext, useContext } from 'react';
// Import modal types from types/modal.ts to avoid circular dependency with components
import type {
    ConnectModalContentsTypes,
    UpgradeSmartAccountModalStyle,
} from '../types/modal';

// Internal type alias to avoid circular dependency with components/AccountModal/Types
// The full AccountModalContentTypes is defined in components/AccountModal/Types/Types.ts
// Here we use 'any' to avoid importing from components which would create cycles
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AccountModalContentTypesInternal = any;

export type AccountModalOptions = {
    isolatedView?: boolean;
};

export type ModalContextType = {
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
        content?: AccountModalContentTypesInternal,
        options?: AccountModalOptions,
    ) => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
    // Account Modal Content State
    accountModalContent: AccountModalContentTypesInternal;
    setAccountModalContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypesInternal>
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

export const ModalContext = createContext<ModalContextType | null>(null);

// Default no-op modal context for headless mode
// Provides safe defaults so hooks work without ModalProvider
export const headlessModalContext: ModalContextType = {
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

/**
 * Hook to access the modal context.
 * Import this from ModalContext.tsx instead of ModalProvider.tsx to avoid circular dependencies.
 */
export const useModal = () => {
    const context = useContext(ModalContext);
    // In headless mode, ModalProvider is not rendered, so context will be null
    // Return no-op context to allow hooks to work without errors
    if (!context) {
        return headlessModalContext;
    }
    return context;
};
