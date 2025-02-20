import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccessAndSecurityModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

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
