import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
import { ReactNode } from 'react';

export const useProfileModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('profile', options);
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

export const ProfileModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
