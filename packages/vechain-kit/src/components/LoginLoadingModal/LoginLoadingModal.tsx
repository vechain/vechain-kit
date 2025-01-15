import {
    ModalBody,
    ModalHeader,
    ModalFooter,
    Spinner,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { BaseModal } from '../common/BaseModal';
import { FadeInViewFromBottom } from '../common';

type LoginLoadingModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const LoginLoadingModal = ({
    isOpen,
    onClose,
}: LoginLoadingModalProps) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            autoFocus={false}
        >
            <ModalHeader
                fontSize={'md'}
                fontWeight={'500'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
                justifyContent={'center'}
                alignItems={'center'}
                display={'flex'}
                gap={2}
            >
                <Text fontSize="sm">Connecting...</Text>
            </ModalHeader>

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
