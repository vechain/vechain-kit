import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useEcosystemModal = () => {
    const {
        openEcosystemModal: open,
        closeEcosystemModal: close,
        isEcosystemModalOpen: isOpen,
    } = useVeChainKitConfig();
    return { open, close, isOpen };
};

export const EcosystemModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
