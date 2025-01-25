import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useChooseNameModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

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
