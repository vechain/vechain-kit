// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal, AccountModalOptions } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useExploreEcosystemModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('ecosystem', options);
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

export const ExploreEcosystemModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
