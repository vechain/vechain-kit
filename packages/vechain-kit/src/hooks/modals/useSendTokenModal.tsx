import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useSendTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useVeChainKitConfig();

    const open = () => {
        setAccountModalContent({
            type: 'send-token',
            props: {
                setCurrentContent: setAccountModalContent,
            },
        });
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

export const SendTokenModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
