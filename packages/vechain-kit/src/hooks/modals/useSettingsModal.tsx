import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
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
