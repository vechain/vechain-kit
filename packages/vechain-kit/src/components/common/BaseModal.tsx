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
    /**
     * Whether to use bottom sheet on mobile devices.
     * When false (default), uses regular modal on all screen sizes.
     * When true, uses bottom sheet on mobile (< 768px) and regular modal on desktop.
     */
    useBottomSheetOnMobile?: boolean;
    /**
     * Minimum and maximum height for the modal on mobile devices.
     */
    mobileMinHeight?: string;
    mobileMaxHeight?: string;
    desktopMinHeight?: string;
    desktopMaxHeight?: string;
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
    useBottomSheetOnMobile,
    mobileMinHeight,
    mobileMaxHeight = '57vh',
    desktopMinHeight,
    desktopMaxHeight,
}: BaseModalProps) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { portalRootRef, themeConfig, tokens } = useVechainKitThemeConfig();

    // Get useBottomSheetOnMobile from theme config if not provided as prop
    // Prop takes precedence over theme config
    const shouldUseBottomSheetOnMobile =
        useBottomSheetOnMobile ??
        themeConfig?.modal?.useBottomSheetOnMobile ??
        false;

    // Use semantic tokens for modal and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');

    // Get backdrop filter from tokens context
    const defaultBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBackdropFilter = tokens?.effects?.backdropFilter?.modal;
    const effectiveBackdropFilter =
        backdropFilter ?? defaultBackdropFilter ?? 'blur(3px)';

    const modalContentProps: ModalContentProps = isDesktop
        ? {
              minHeight: desktopMinHeight,
              maxHeight: desktopMaxHeight,
          }
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px !important',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
              minHeight: mobileMinHeight,
              maxHeight: mobileMaxHeight,
          };

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
                {...modalContentProps}
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
            blockScrollOnMount={false}
            trapFocus={false}
        >
            <BaseBottomSheet
                isOpen={isOpen}
                onClose={onClose}
                ariaTitle={'Dialog'}
                ariaDescription={'Dialog content area'}
                isDismissable={isCloseable}
                minHeight={mobileMinHeight}
                maxHeight={mobileMaxHeight}
            >
                {children}
            </BaseBottomSheet>
        </Modal>
    );

    // Use bottom sheet only on mobile when explicitly enabled
    // By default, use regular modal on all screen sizes
    const shouldUseBottomSheet = !isDesktop && shouldUseBottomSheetOnMobile;

    return <>{shouldUseBottomSheet ? bottomSheetContent : modalContent}</>;
};
