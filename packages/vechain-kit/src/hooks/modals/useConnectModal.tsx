import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useConnectModal = () => {
    const {
        openConnectModal: open,
        closeConnectModal: close,
        isConnectModalOpen: isOpen,
    } = useVeChainKitConfig();
    return { open, close, isOpen };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
