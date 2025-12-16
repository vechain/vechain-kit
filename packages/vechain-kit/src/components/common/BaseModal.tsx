import {
    Modal,
    ModalContent,
    ModalOverlay,
    useMediaQuery,
    useToken,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useVechainKitThemeConfig } from '@/providers';
import { BaseBottomSheet } from './BaseBottomSheet';

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

    // Get backdrop filter from tokens context
    const { tokens } = useVechainKitThemeConfig();
    const defaultBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBackdropFilter = tokens?.effects?.backdropFilter?.modal;
    const effectiveBackdropFilter =
        backdropFilter ?? defaultBackdropFilter ?? 'blur(3px)';

    const modalContent = (
        <Modal
            motionPreset={motionPreset}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={isCentered}
            size={size}
            returnFocusOnClose={false}
            blockScrollOnMount={blockScrollOnMount}
            closeOnOverlayClick={closeOnOverlayClick && isCloseable}
            preserveScrollBarGap={true}
            portalProps={{ containerRef: portalRootRef }}
            trapFocus={!allowExternalFocus}
            autoFocus={!allowExternalFocus}
            variant="vechainKitBase"
        >
            <ModalOverlay
                bg={overlayBg}
                backdropFilter={effectiveBackdropFilter}
            />
            <ModalContent
                role="dialog"
                aria-modal={!allowExternalFocus}
                bg={modalBg}
                sx={{
                    backdropFilter: modalBackdropFilter,
                    WebkitBackdropFilter: modalBackdropFilter,
                }}
            >
                {children}
            </ModalContent>
        </Modal>
    );

    // We still wrap the bottomsheet within the modal,
    // because we need access to the modal context (eg: setCurrentContent())
    const bottomSheetContent = (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            blockScrollOnMount={blockScrollOnMount}
        >
            <BaseBottomSheet
                isOpen={isOpen}
                onClose={onClose}
                ariaTitle={'Modal'}
                ariaDescription={'Modal content'}
                isDismissable={isCloseable}
            >
                {children}
            </BaseBottomSheet>
        </Modal>
    );

    return <>{isDesktop ? modalContent : bottomSheetContent}</>;
};
