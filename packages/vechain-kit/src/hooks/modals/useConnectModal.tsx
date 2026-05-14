import { useVeChainKitConfig } from '@/providers';
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';
import { useDAppKitWalletModal } from '..';
import { ConnectModalContentsTypes } from '@/components';

export const useConnectModal = () => {
    const { loginMethods } = useVeChainKitConfig();
    // Only the legacy `'dappkit'` method delegates to dapp-kit's native modal.
    // Granular methods ('veworld' | 'sync2' | 'wallet-connect') keep using
    // vechain-kit's modal so the custom loading/error UI is shown.
    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { openConnectModal, closeConnectModal, isConnectModalOpen } =
        useModal();

    const { open: openDappKit, close: closeDappKit } = useDAppKitWalletModal();

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
