import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useNotificationsModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = () => {
        openAccountModal('notifications');
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
