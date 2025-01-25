import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useEmbeddedWalletSettingsModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

    const open = () => {
        setAccountModalContent('embedded-wallet');
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

export const EmbeddedWalletSettingsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
