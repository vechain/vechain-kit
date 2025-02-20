import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useSendTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

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
