import { ModalCloseButton as ChakraModalCloseButton } from '@chakra-ui/react';
import { ModalCloseButtonProps } from '@chakra-ui/react';
import { useBottomSheetContext } from './BottomSheetContext';

/**
 * Wrapper component for Chakra UI's ModalCloseButton that automatically
 * hides itself when rendered inside a BaseBottomSheet.
 *
 * This eliminates the need to conditionally render ModalCloseButton
 * in each content component based on whether it's inside a bottomsheet.
 */
export const ModalCloseButton = (props: ModalCloseButtonProps) => {
    const bottomSheetContext = useBottomSheetContext();

    // Hide the close button when inside a bottomsheet
    if (bottomSheetContext?.isInsideBottomSheet) {
        return null;
    }

    return <ChakraModalCloseButton {...props} />;
};
