// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useTransactionToast = () => {
    const {
        openTransactionToast: open,
        closeTransactionToast: close,
        isTransactionToastOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const TransactionToastProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
