import { useModal } from '../../providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountCustomizationModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = () => {
        openAccountModal({
            type: 'account-customization',
            props: {
                setCurrentContent: setAccountModalContent,
            },
        });
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

export const AccountCustomizationModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
