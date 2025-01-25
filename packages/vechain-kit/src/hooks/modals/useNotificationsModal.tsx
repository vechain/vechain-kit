import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useNotificationsModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

    const open = () => {
        setAccountModalContent('notifications');
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

export const NotificationsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
