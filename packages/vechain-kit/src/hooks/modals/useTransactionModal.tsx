import { useVeChainKitConfig } from '@/providers';
import { ReactNode } from 'react';

export const useTransactionModal = () => {
    const {
        openTransactionModal: open,
        closeTransactionModal: close,
        isTransactionModalOpen: isOpen,
    } = useVeChainKitConfig();
    return { open, close, isOpen };
};

export const TransactionModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
