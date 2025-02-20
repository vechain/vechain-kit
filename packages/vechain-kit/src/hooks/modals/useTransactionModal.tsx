import { useModal } from '@/providers/ModalProvider';
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
