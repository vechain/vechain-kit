import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
    useToken,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useVechainKitThemeConfig } from '@/providers';

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
    backdropFilter?: string;
    isCloseable?: boolean;
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
    backdropFilter,
    isCloseable = true,
}: BaseModalProps) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { portalRootRef } = useVechainKitThemeConfig();

    // Use semantic tokens for modal and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');

    // Get backdrop filter and modal width from tokens context
    const { tokens } = useVechainKitThemeConfig();
    const defaultBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBackdropFilter = tokens?.effects?.backdropFilter?.modal;
    const effectiveBackdropFilter =
        backdropFilter ?? defaultBackdropFilter ?? 'blur(3px)';
    const modalWidth = tokens?.sizes?.modal;

    const modalContentProps: ModalContentProps = isDesktop
        ? modalWidth
            ? { width: modalWidth, maxW: modalWidth }
            : {}
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px !important',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
          };

    return (
        <Modal
            motionPreset={motionPreset}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={isCentered}
            size={size}
            // scrollBehavior="inside"
            returnFocusOnClose={false}
            blockScrollOnMount={blockScrollOnMount}
            closeOnOverlayClick={closeOnOverlayClick && isCloseable}
            preserveScrollBarGap={true}
            portalProps={{ containerRef: portalRootRef }}
            trapFocus={!allowExternalFocus}
            autoFocus={!allowExternalFocus}
        >
            <ModalOverlay
                bg={overlayBg}
                backdropFilter={effectiveBackdropFilter}
            />
            <ModalContent
                role="dialog"
                aria-modal={!allowExternalFocus}
                bg={modalBg}
                variant="vechainKitBase"
                sx={{
                    backdropFilter: modalBackdropFilter,
                    WebkitBackdropFilter: modalBackdropFilter,
                }}
                {...modalContentProps}
            >
                {children}
            </ModalContent>
        </Modal>
    );
};
