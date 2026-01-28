import {
    ModalBody,
    ModalHeader,
    VStack,
    ModalCloseButton,
    Text,
    ModalFooter,
    Icon,
    Button,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '../../common';
import { LuCircleAlert, LuRefreshCw } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type ErrorContentProps = {
    error: string;
    onClose: () => void;
    onTryAgain: () => void;
    onGoBack: () => void;
};

export const ErrorContent = ({
    error,
    onClose,
    onTryAgain,
    onGoBack,
}: ErrorContentProps) => {
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>
                    <ModalBackButton onClick={onGoBack} />
                    {t('Connection Failed')}
                    <ModalCloseButton onClick={onClose} />
                </ModalHeader>
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
                            repeat: shouldReduceMotion ? 0 : Infinity,
                        }}
                        animate={{
                            scale: shouldReduceMotion ? [1] : [1, 1.1, 1],
                        }}
                    >
                        <Icon
                            as={LuCircleAlert}
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
                <Button variant="vechainKitPrimary" onClick={onTryAgain}>
                    <Icon mr={2} as={LuRefreshCw} />
                    {t('Try again')}
                </Button>
            </ModalFooter>
        </>
    );
};
