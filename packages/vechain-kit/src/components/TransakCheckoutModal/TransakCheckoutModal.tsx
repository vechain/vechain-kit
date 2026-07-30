'use client';

import {
    Box,
    Button,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    Icon,
    Spinner,
    useToken,
} from '@chakra-ui/react';
import { BaseModal, StatusScreen, StickyHeaderContainer } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { LuCreditCard, LuCircleCheck, LuCircleX } from 'react-icons/lu';
import type { TransakCheckoutStatus } from '@/hooks/payments/useTransakCheckout';

export type TransakCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransakCheckoutStatus;
    fiatAmount?: string;
    error: Error | null;
    onStart: () => void;
    onReset: () => void;
};

export const TransakCheckoutModal = ({
    isOpen,
    onClose,
    status,
    fiatAmount = '50',
    error,
    onStart,
    onReset,
}: TransakCheckoutModalProps) => {
    const { t } = useTranslation();

    const handleClose = () => {
        onReset();
        onClose();
    };

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={status !== 'processing'}>
            <StickyHeaderContainer>
                <ModalHeader>{t('Buy VET')}</ModalHeader>
                <ModalCloseButton isDisabled={status === 'processing'} />
            </StickyHeaderContainer>

            <ModalBody>
                {status === 'idle' && (
                    <VStack spacing={6} py={4}>
                        <Box
                            w="full"
                            p={6}
                            borderRadius="xl"
                            bg="gray.50"
                            _dark={{ bg: 'gray.700' }}
                        >
                            <VStack spacing={3} align="center">
                                <Icon as={LuCreditCard} boxSize={8} color="blue.400" />
                                <Text fontSize="3xl" fontWeight="bold">
                                    ${fiatAmount}
                                </Text>
                                <Text fontSize="sm" color={textSecondary} textAlign="center">
                                    {t('You will be redirected to Transak to complete your purchase.')}
                                </Text>
                            </VStack>
                        </Box>
                    </VStack>
                )}

                {status === 'processing' && (
                    <VStack spacing={4} align="center" py={8}>
                        <Spinner size="xl" />
                        <Text fontWeight="bold" fontSize="lg">
                            {t('Opening Transak...')}
                        </Text>
                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                            {t('Please complete the purchase in the Transak window.')}
                        </Text>
                    </VStack>
                )}

                {status === 'success' && (
                    <StatusScreen
                        status="success"
                        title={t('Purchase successful')}
                        description={t('Your VET will arrive in your wallet shortly.')}
                        icon={LuCircleCheck}
                        actions={
                            <Button variant="vechainKitPrimary" onClick={onClose} w="full">
                                {t('Done')}
                            </Button>
                        }
                    />
                )}

                {status === 'error' && (
                    <StatusScreen
                        status="error"
                        title={t('Purchase failed')}
                        description={error?.message ?? t('Something went wrong. Please try again.')}
                        icon={LuCircleX}
                        actions={
                            <VStack spacing={3} w="full">
                                <Button variant="vechainKitPrimary" onClick={onStart} w="full">
                                    {t('Try again')}
                                </Button>
                                <Button variant="vechainKitSecondary" onClick={handleClose} w="full">
                                    {t('Cancel')}
                                </Button>
                            </VStack>
                        }
                    />
                )}
            </ModalBody>

            {status === 'idle' && (
                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        onClick={onStart}
                        w="full"
                        size="lg"
                    >
                        {t('Buy ${{amount}} VET', { amount: fiatAmount })}
                    </Button>
                </ModalFooter>
            )}
        </BaseModal>
    );
};
