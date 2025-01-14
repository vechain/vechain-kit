import {
    ModalBody,
    ModalHeader,
    ModalFooter,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BaseModal } from '../common/BaseModal';
import { FadeInViewFromBottom, StickyHeaderContainer } from '../common';

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
            <StickyHeaderContainer>
                <ModalHeader>
                    <Text fontSize="sm">Connecting...</Text>
                </ModalHeader>
            </StickyHeaderContainer>
            <FadeInViewFromBottom>
                <ModalBody>
                    <VStack
                        w={'full'}
                        justifyContent={'center'}
                        minH={'100px'}
                        alignItems={'center'}
                        spacing={4}
                    >
                        <Spinner size="xl" />
                    </VStack>
                </ModalBody>
                <ModalFooter />
            </FadeInViewFromBottom>
        </BaseModal>
    );
};
