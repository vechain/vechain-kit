import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccessAndSecurityModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('access-and-security', options);
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
