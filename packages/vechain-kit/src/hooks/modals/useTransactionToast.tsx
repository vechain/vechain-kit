import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useTransactionToast = () => {
    const {
        openTransactionToast: open,
        closeTransactionToast: close,
        isTransactionToastOpen: isOpen,
    } = useVeChainKitConfig();
    return { open, close, isOpen };
};

export const TransactionToastProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
