import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useConnectModal = () => {
    const {
        openConnectModal: open,
        closeConnectModal: close,
        isConnectModalOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
