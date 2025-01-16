import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
    FocusLock,
} from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';

type BaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: string;
    isCentered?: boolean;
    motionPreset?: 'slideInBottom' | 'none';
    trapFocus?: boolean;
    closeOnOverlayClick?: boolean;
    blockScrollOnMount?: boolean;
    autoFocus?: boolean;
    initialFocusRef?: React.RefObject<HTMLElement>;
};

export const BaseModal = ({
    isOpen,
    onClose,
    children,
    size = 'sm',
    isCentered = true,
    motionPreset = 'slideInBottom',
    trapFocus = true,
    closeOnOverlayClick = true,
    blockScrollOnMount = true,
    autoFocus = true,
    initialFocusRef,
}: BaseModalProps) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    const modalContentProps: ModalContentProps = isDesktop
        ? {}
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
          };

    // Ensure proper focus management
    useEffect(() => {
        if (isOpen && initialFocusRef?.current) {
            initialFocusRef.current.focus();
        }
    }, [isOpen, initialFocusRef]);

    return (
        <Modal
            motionPreset={isDesktop ? 'none' : motionPreset}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={isCentered}
            size={size}
            scrollBehavior="inside"
            returnFocusOnClose={true}
            blockScrollOnMount={blockScrollOnMount}
            closeOnOverlayClick={closeOnOverlayClick}
            autoFocus={autoFocus}
        >
            <ModalOverlay />
            <FocusLock isDisabled={!trapFocus} restoreFocus>
                <ModalContent
                    role="dialog"
                    aria-modal="true"
                    {...modalContentProps}
                >
                    {children}
                </ModalContent>
            </FocusLock>
        </Modal>
    );
};
