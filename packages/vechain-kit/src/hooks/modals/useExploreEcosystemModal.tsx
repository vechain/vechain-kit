import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useExploreEcosystemModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

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
