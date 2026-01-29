// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useAccountModal = () => {
    const {
        openAccountModal: open,
        closeAccountModal: close,
        isAccountModalOpen: isOpen,
    } = useModal();
    return { open: () => open(), close, isOpen };
};

export const AccountModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
