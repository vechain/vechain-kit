import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useAccountModal = () => {
    const {
        openAccountModal: open,
        closeAccountModal: close,
        isAccountModalOpen: isOpen,
    } = useVeChainKitConfig();
    return { open, close, isOpen };
};

export const AccountModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
