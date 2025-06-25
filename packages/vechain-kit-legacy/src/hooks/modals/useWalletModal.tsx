import { useWallet } from '@/hooks';
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useWalletModal = () => {
    const { connection } = useWallet();
    const {
        openConnectModal,
        closeConnectModal,
        isConnectModalOpen,
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
    } = useModal();

    const open = () => {
        if (connection.isConnected) {
            openAccountModal();
        } else {
            openConnectModal();
        }
    };

    const close = () => {
        if (isAccountModalOpen) {
            closeAccountModal();
        }
        if (isConnectModalOpen) {
            closeConnectModal();
        }
    };

    const isOpen = isConnectModalOpen || isAccountModalOpen;

    return { open, close, isOpen };
};

export const WalletModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
