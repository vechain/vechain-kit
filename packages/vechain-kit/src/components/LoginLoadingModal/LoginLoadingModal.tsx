import { BaseModal } from '../common/BaseModal';
import {
    ModalBody,
    ModalHeader,
    Spinner,
    VStack,
    ModalCloseButton,
    Text,
    ModalFooter,
    Icon,
    Button,
} from '@chakra-ui/react';
import { StickyHeaderContainer } from '@/components/common';
import { MdOutlineErrorOutline, MdOutlineRefresh } from 'react-icons/md';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';

type LoginLoadingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    error?: string;
    title?: string;
    loadingText?: string;
    onTryAgain?: () => void;
};

export const LoginLoadingModal = ({
    isOpen,
    onClose,
    error,
    title,
    loadingText,
    onTryAgain = () => {},
}: LoginLoadingModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            autoFocus={false}
            backdropFilter={'blur(3px)'}
        >
            {error ? (
                <ErrorContent
                    error={error}
                    onClose={onClose}
                    onTryAgain={onTryAgain}
                />
            ) : (
                <LoadingContent
                    loadingText={loadingText}
                    title={title}
                    onTryAgain={onTryAgain}
                />
            )}
        </BaseModal>
    );
};

const LoadingContent = ({
    loadingText,
    title,
    onTryAgain,
}: {
    loadingText?: string;
    title?: string;
    onTryAgain?: () => void;
}) => {
    const { t } = useTranslation();
    const [showTimeout, setShowTimeout] = React.useState(false);

    React.useEffect(() => {
        // Keep the regular timeout for non-mobile browsers
        const timer = setTimeout(() => {
            setShowTimeout(true);
        }, 7000);

        return () => clearTimeout(timer);
    }, [isMobile]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{title ?? t('Connecting...')}</ModalHeader>
            </StickyHeaderContainer>

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
                {loadingText && !showTimeout && (
                    <Text size="sm" textAlign={'center'}>
                        {loadingText}
                    </Text>
                )}
                {showTimeout && (
                    <VStack mt={4} spacing={2}>
                        <Text color="orange.300" size="sm" textAlign={'center'}>
                            {t('This is taking longer than expected.')}
                        </Text>
                        <Text size="sm" textAlign={'center'}>
                            {t(
                                'You may want to try establishing the connection again.',
                            )}
                        </Text>
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter justifyContent={'center'}>
                {showTimeout && (
                    <Button variant="vechainKitSecondary" onClick={onTryAgain}>
                        <Icon mr={2} as={MdOutlineRefresh} />
                        {t('Try again')}
                    </Button>
                )}
            </ModalFooter>
        </>
    );
};

const ErrorContent = ({
    error,
    onClose,
    onTryAgain,
}: {
    error: string;
    onClose: () => void;
    onTryAgain: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Connection Failed')}</ModalHeader>
                <ModalCloseButton
                    onClick={() => {
                        onClose();
                    }}
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack
                    align={'center'}
                    p={6}
                    w={'full'}
                    justifyContent={'center'}
                    minH={'100px'}
                    gap={4}
                >
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
                            color={'#ef4444'}
                            fontSize={'60px'}
                            opacity={0.5}
                        />
                    </motion.div>
                    <Text w={'full'} size="sm" textAlign={'center'}>
                        {error}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter justifyContent={'center'}>
                <Button variant="vechainKitSecondary" onClick={onTryAgain}>
                    <Icon mr={2} as={MdOutlineRefresh} />
                    {t('Try again')}
                </Button>
            </ModalFooter>
        </>
    );
};
