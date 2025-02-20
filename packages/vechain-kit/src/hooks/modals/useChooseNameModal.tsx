import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useChooseNameModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = () => {
        setAccountModalContent('choose-name');
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

export const ChooseNameModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
