import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useFAQModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = () => {
        openAccountModal({
            type: 'faq',
            props: { onGoBack: () => setAccountModalContent('main') },
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

export const FAQModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
