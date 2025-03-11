import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useUpgradeSmartAccountModal = () => {
    const {
        openUpgradeSmartAccountModal: open,
        closeUpgradeSmartAccountModal: close,
        isUpgradeSmartAccountModalOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const UpgradeSmartAccountModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
