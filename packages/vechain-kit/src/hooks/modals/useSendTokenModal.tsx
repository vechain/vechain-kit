import { useModal, AccountModalOptions } from '../../providers/ModalProvider';
import { ReactNode } from 'react';

export const useSendTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal(
            {
                type: 'send-token',
                props: {
                    setCurrentContent: setAccountModalContent,
                },
            },
            options,
        );
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
