import { useModal } from '../../providers/ModalProvider';
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
