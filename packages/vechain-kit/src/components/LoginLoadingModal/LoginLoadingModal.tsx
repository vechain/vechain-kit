import { BaseModal } from '../common/BaseModal';
import {
    ModalBody,
    ModalHeader,
    Spinner,
    VStack,
    useColorMode,
    Container,
    ModalCloseButton,
    Text,
    ModalFooter,
    Icon,
} from '@chakra-ui/react';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
} from '@/components/common';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { motion } from 'framer-motion';

type LoginLoadingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    error?: string;
    title?: string;
    loadingText?: string;
};

export const LoginLoadingModal = ({
    isOpen,
    onClose,
    error,
    title,
    loadingText,
}: LoginLoadingModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            autoFocus={false}
        >
            {error ? (
                <ErrorContent error={error} onClose={onClose} />
            ) : (
                <LoadingContent loadingText={loadingText} title={title} />
            )}
        </BaseModal>
    );
};

const LoadingContent = ({
    loadingText,
    title,
}: {
    loadingText?: string;
    title?: string;
}) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {title || 'Connecting...'}
                </ModalHeader>
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack
                        align={'center'}
                        p={6}
                        gap={0}
                        w={'full'}
                        justifyContent={'center'}
                        minH={'150px'}
                    >
                        <Spinner size="xl" />
                    </VStack>
                    {loadingText && (
                        <Text size="sm" textAlign={'center'}>
                            {loadingText}
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter />
            </Container>
        </FadeInViewFromBottom>
    );
};

const ErrorContent = ({
    error,
    onClose,
}: {
    error: string;
    onClose: () => void;
}) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    Connection Failed
                </ModalHeader>
                <ModalCloseButton
                    onClick={() => {
                        onClose();
                    }}
                />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack
                        align={'center'}
                        p={6}
                        gap={0}
                        w={'full'}
                        justifyContent={'center'}
                        minH={'100px'}
                    >
                        <VStack gap={4}>
                            <motion.div
                                transition={{
                                    duration: 4,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                            >
                                <Icon
                                    as={MdOutlineErrorOutline}
                                    color={'red'}
                                    fontSize={'60px'}
                                />
                            </motion.div>
                        </VStack>
                    </VStack>
                    <Text size="sm" textAlign={'center'}>
                        {error}
                    </Text>
                </ModalBody>
                <ModalFooter />
            </Container>
        </FadeInViewFromBottom>
    );
};
