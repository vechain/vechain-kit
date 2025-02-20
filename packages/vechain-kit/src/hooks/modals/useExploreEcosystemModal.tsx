import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useExploreEcosystemModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = () => {
        setAccountModalContent('ecosystem');
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

export const ExploreEcosystemModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
