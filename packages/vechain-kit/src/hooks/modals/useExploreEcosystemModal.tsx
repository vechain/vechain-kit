import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useExploreEcosystemModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = () => {
        openAccountModal('ecosystem');
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
