// Import from types/modal to avoid circular dependency with components
import type { UpgradeSmartAccountModalStyle } from '../../types/modal';
// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from '../../providers/ModalContext';
import { ReactNode } from 'react';

export const useUpgradeSmartAccountModal = (
    style?: UpgradeSmartAccountModalStyle,
) => {
    const {
        openUpgradeSmartAccountModal: open,
        closeUpgradeSmartAccountModal: close,
        isUpgradeSmartAccountModalOpen: isOpen,
    } = useModal();
    return { open: () => open(style), close, isOpen };
};

export const UpgradeSmartAccountModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
