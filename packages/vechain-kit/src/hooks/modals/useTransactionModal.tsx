// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useTransactionModal = () => {
    const {
        openTransactionModal: open,
        closeTransactionModal: close,
        isTransactionModalOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const TransactionModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
