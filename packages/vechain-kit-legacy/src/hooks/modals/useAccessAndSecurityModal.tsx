import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccessAndSecurityModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = () => {
        openAccountModal('access-and-security');
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
