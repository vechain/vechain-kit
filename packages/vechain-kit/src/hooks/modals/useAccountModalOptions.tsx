// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from '../../providers/ModalContext';

export const useAccountModalOptions = () => {
    const { isolatedView, closeAccountModal } = useModal();

    return {
        isolatedView,
        closeAccountModal,
    };
};
