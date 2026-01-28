import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
import type { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { ReactNode } from 'react';

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


