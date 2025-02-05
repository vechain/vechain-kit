import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useReceiveModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

    const open = () => {
        setAccountModalContent('receive-token');
        openAccountModal();
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

export const ReceiveModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
