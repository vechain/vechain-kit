import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

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
    allowExternalFocus?: boolean;
};

export const BaseModal = ({
    isOpen,
    onClose,
    children,
    size = 'sm',
    isCentered = true,
    motionPreset = 'slideInBottom',
    closeOnOverlayClick = true,
    blockScrollOnMount = false,
    allowExternalFocus = false,
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

    return (
        <Modal
            motionPreset={isDesktop ? 'none' : motionPreset}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={isCentered}
            size={size}
            scrollBehavior="inside"
            returnFocusOnClose={false}
            blockScrollOnMount={blockScrollOnMount}
            closeOnOverlayClick={closeOnOverlayClick}
            preserveScrollBarGap={true}
            portalProps={{ containerRef: undefined }}
            trapFocus={!allowExternalFocus}
            autoFocus={!allowExternalFocus}
        >
            <ModalOverlay />
            <ModalContent
                role="dialog"
                aria-modal={!allowExternalFocus}
                {...modalContentProps}
            >
                {children}
            </ModalContent>
        </Modal>
    );
};
