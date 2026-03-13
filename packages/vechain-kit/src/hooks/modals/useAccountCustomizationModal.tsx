import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountCustomizationModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('account-customization', options);
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

export const AccountCustomizationModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
