import { useVeChainKitConfig } from '@/providers';
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';
import { useDAppKitWalletModal } from '..';

export const useConnectModal = () => {
    const { loginMethods } = useVeChainKitConfig();
    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { openConnectModal, closeConnectModal, isConnectModalOpen } =
        useModal();

    const { open: openDappKit, close: closeDappKit } = useDAppKitWalletModal();

    return {
        open: hasOnlyDappKit ? openDappKit : openConnectModal,
        close: hasOnlyDappKit ? closeDappKit : closeConnectModal,
        isOpen: hasOnlyDappKit ? false : isConnectModalOpen,
    };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
