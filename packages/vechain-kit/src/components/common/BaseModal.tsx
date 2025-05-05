import { VechainKitThemeProvider } from '@/providers';
import {
    Modal,
    ModalContent,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useVeChainKitConfig } from '@/providers';
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
    const { darkMode } = useVeChainKitConfig();

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
            portalProps={{ containerRef: undefined }}
            trapFocus={!allowExternalFocus}
            autoFocus={!allowExternalFocus}
        >
            <ModalOverlay backdropFilter={backdropFilter} />
            <ModalContent role="dialog" aria-modal={!allowExternalFocus}>
                {children}
            </ModalContent>
        </Modal>
    );

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

    return (
        <VechainKitThemeProvider darkMode={darkMode}>
            {isDesktop ? modalContent : bottomSheetContent}
        </VechainKitThemeProvider>
    );
};
