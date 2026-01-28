import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
import { ReactNode } from 'react';

export const useReceiveModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('receive-token', options);
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

export const ReceiveModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
