// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal, AccountModalOptions } from '../../providers/ModalContext';
import { ReactNode } from 'react';

// Local type alias to avoid circular dependency with components
// The full type is defined in components/AccountModal/Types/Types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AccountModalContentTypes = any;

type SwapTokenModalOptions = {
    fromTokenAddress?: string;
    toTokenAddress?: string;
    isolatedView?: boolean;
};

export const useSwapTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: SwapTokenModalOptions) => {
        const props: any = {
            setCurrentContent: setAccountModalContent,
            fromTokenAddress: options?.fromTokenAddress,
            toTokenAddress: options?.toTokenAddress,
        };
        const content: AccountModalContentTypes = {
            type: 'swap-token',
            props,
        };
        const accountOptions: AccountModalOptions = {
            isolatedView: options?.isolatedView,
        };
        openAccountModal(content, accountOptions);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const SwapTokenModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;


