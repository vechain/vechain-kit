import {
    Box,
    BoxProps,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    IconButton,
    ButtonProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

type CommonProps = BoxProps & {
    children?: ReactNode;
    isBottomSheet?: boolean;
};

type CloseButtonProps = ButtonProps & {
    isBottomSheet?: boolean;
    onClose?: () => void;
};

export const AdaptiveModalBody = ({
    children,
    isBottomSheet,
    ...props
}: CommonProps) => {
    if (isBottomSheet) {
        return (
            <Box flex="1" px={4} py={2} overflowY="auto" {...props}>
                {children}
            </Box>
        );
    }
    return <ModalBody {...props}>{children}</ModalBody>;
};

export const AdaptiveModalHeader = ({
    children,
    isBottomSheet,
    ...props
}: CommonProps) => {
    if (isBottomSheet) {
        return (
            <Box
                px={4}
                py={3}
                fontWeight="bold"
                fontSize="lg"
                position="relative"
                {...props}
            >
                {children}
            </Box>
        );
    }
    return <ModalHeader {...props}>{children}</ModalHeader>;
};

export const AdaptiveModalFooter = ({
    children,
    isBottomSheet,
    ...props
}: CommonProps) => {
    if (isBottomSheet) {
        return (
            <Box px={4} py={3} {...props}>
                {children}
            </Box>
        );
    }
    return <ModalFooter {...props}>{children}</ModalFooter>;
};

export const AdaptiveModalCloseButton = ({
    isBottomSheet,
    onClose,
    ...props
}: CloseButtonProps) => {
    if (isBottomSheet) {
        return (
            <IconButton
                icon={<IoCloseOutline />}
                size="sm"
                variant="ghost"
                position="absolute"
                right={4}
                top={4}
                aria-label="Close"
                onClick={onClose}
                {...props}
            />
        );
    }
    return <ModalCloseButton {...props} />;
};
