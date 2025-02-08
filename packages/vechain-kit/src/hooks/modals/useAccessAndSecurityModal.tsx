import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useAccessAndSecurityModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

    const open = () => {
        setAccountModalContent('access-and-security');
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

export const AccessAndSecurityModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
