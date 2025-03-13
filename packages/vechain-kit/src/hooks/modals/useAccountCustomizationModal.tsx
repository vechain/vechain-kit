import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountCustomizationModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = () => {
        openAccountModal('account-customization');
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
