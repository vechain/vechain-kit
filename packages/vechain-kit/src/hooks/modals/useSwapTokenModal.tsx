import { useModal } from '@/providers/ModalProvider';
import type { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { ReactNode } from 'react';

type SwapTokenModalOptions = {
    fromTokenAddress?: string;
    toTokenAddress?: string;
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
        openAccountModal(content);
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


