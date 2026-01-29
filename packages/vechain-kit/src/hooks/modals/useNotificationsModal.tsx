// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal, AccountModalOptions } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useNotificationsModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('notifications', options);
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

export const NotificationsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
