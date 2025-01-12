import { useDAppKitPrivyConfig } from '@/providers';
import { ReactNode } from 'react';

export const useConnectModal = () => {
    const {
        openConnectModal: open,
        closeConnectModal: close,
        isConnectModalOpen: isOpen,
    } = useDAppKitPrivyConfig();
    return { open, close, isOpen };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
