import { useVeChainKitConfig } from '../../providers';
import { useModal } from '../../providers/ModalProvider';
import { ReactNode } from 'react';
import { useOptionalDAppKitWalletModal } from '../api/dappkit/useOptionalDAppKitWalletModal';
import type { ConnectModalContentsTypes } from '../../components';

export const useConnectModal = () => {
    const { loginMethods } = useVeChainKitConfig();
    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { openConnectModal, closeConnectModal, isConnectModalOpen } =
        useModal();

    // Use optional DAppKit wallet modal hook that handles missing provider gracefully
    const { open: openDappKit, close: closeDappKit } = useOptionalDAppKitWalletModal();

    return {
        open: hasOnlyDappKit
            ? openDappKit
            : (initialContent?: ConnectModalContentsTypes) =>
                  openConnectModal(initialContent),
        close: hasOnlyDappKit ? closeDappKit : closeConnectModal,
        isOpen: hasOnlyDappKit ? false : isConnectModalOpen,
    };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
