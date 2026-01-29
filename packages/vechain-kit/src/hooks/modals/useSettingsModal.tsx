// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal, AccountModalOptions } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useSettingsModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('settings', options);
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

export const SettingsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
