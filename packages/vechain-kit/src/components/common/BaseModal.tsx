import { VechainKitThemeProvider } from '@/providers';
import {
    Modal,
    ModalContent,
    ModalOverlay,
    useMediaQuery,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react';
import { ReactNode, Children, isValidElement, cloneElement } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { BaseBottomSheet } from './BaseBottomSheet';
import {
    AdaptiveModalBody,
    AdaptiveModalHeader,
    AdaptiveModalFooter,
    AdaptiveModalCloseButton,
} from './ModalComponents';

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

const adaptChildrenToView = (
    children: ReactNode,
    isBottomSheet: boolean,
    onClose: () => void,
): ReactNode => {
    return Children.map(children, (child) => {
        if (!isValidElement(child)) return child;

        // Replace Chakra Modal components with our adaptive components
        switch (child.type) {
            case ModalBody:
                return (
                    <AdaptiveModalBody
                        isBottomSheet={isBottomSheet}
                        {...child.props}
                    />
                );
            case ModalHeader:
                return (
                    <AdaptiveModalHeader
                        isBottomSheet={isBottomSheet}
                        {...child.props}
                    />
                );
            case ModalFooter:
                return (
                    <AdaptiveModalFooter
                        isBottomSheet={isBottomSheet}
                        {...child.props}
                    />
                );
            case ModalCloseButton:
                return (
                    <AdaptiveModalCloseButton
                        isBottomSheet={isBottomSheet}
                        onClose={onClose}
                        {...child.props}
                    />
                );
            default:
                // If the child has children, recursively adapt them
                if (child.props.children) {
                    return cloneElement(child, {
                        ...child.props,
                        children: adaptChildrenToView(
                            child.props.children,
                            isBottomSheet,
                            onClose,
                        ),
                    });
                }
                return child;
        }
    });
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

    const adaptedChildren = adaptChildrenToView(children, !isDesktop, onClose);

    return (
        <VechainKitThemeProvider darkMode={darkMode}>
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
                {isDesktop ? (
                    <>
                        <ModalOverlay backdropFilter={backdropFilter} />
                        <ModalContent
                            role="dialog"
                            aria-modal={!allowExternalFocus}
                        >
                            {adaptedChildren}
                        </ModalContent>
                    </>
                ) : (
                    <BaseBottomSheet
                        isOpen={isOpen}
                        onClose={onClose}
                        ariaTitle={'Modal'}
                        ariaDescription={'Modal content'}
                        isDismissable={isCloseable}
                    >
                        {adaptedChildren}
                    </BaseBottomSheet>
                )}
            </Modal>
        </VechainKitThemeProvider>
    );
};
