import { useModal } from '../../providers/ModalProvider';

export const useAccountModalOptions = () => {
    const { isolatedView, closeAccountModal } = useModal();

    return {
        isolatedView,
        closeAccountModal,
    };
};
