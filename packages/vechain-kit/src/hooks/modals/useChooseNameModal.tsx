import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useChooseNameModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal(
            {
                type: 'choose-name',
                props: {
                    setCurrentContent: setAccountModalContent,
                    onBack: () => setAccountModalContent('main'),
                    initialContentSource: 'main',
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

export const ChooseNameModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
