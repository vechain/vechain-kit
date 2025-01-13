import {
    ModalBody,
    ModalHeader,
    ModalFooter,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BaseModal } from '../common/BaseModal';

type LoginLoadingModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const LoginLoadingModal = ({
    isOpen,
    onClose,
}: LoginLoadingModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="xs"
            trapFocus={false}
            autoFocus={false}
        >
            <ModalHeader />
            <ModalBody>
                <VStack w={'full'} justifyContent={'center'}>
                    <Spinner />
                    <Text mt={4} fontSize="sm">
                        Connecting...
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter />
        </BaseModal>
    );
};
