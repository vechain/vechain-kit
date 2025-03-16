import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useProfileModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = () => {
        openAccountModal('profile');
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
