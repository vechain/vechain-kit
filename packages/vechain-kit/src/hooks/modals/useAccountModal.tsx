import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountModal = () => {
    const {
        openAccountModal: open,
        closeAccountModal: close,
        isAccountModalOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const AccountModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
