import type { UpgradeSmartAccountModalStyle } from '@/components';
import { useModal } from '../../providers/ModalProvider';
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
