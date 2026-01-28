// Direct import to avoid circular dependency through hooks barrel
import { useWallet } from '../api/wallet/useWallet';
import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
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

    const open = (options?: AccountModalOptions) => {
        if (connection.isConnected) {
            openAccountModal(undefined, options);
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
