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
import { useFiatCheckout, FiatCheckoutProduct } from '@/hooks/payments/useFiatCheckout';
import type { CURRENCY } from '@/types';
import { useTranslation } from 'react-i18next';
import { LuCreditCard, LuCircleCheck, LuCircleX } from 'react-icons/lu';

export type FiatCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    amount: string;
    product?: FiatCheckoutProduct;
    currency?: CURRENCY;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const FiatCheckoutModal = ({
    isOpen,
    onClose,
    amount,
    product,
    currency,
    onSuccess,
    onError,
}: FiatCheckoutModalProps) => {
    const { t } = useTranslation();
    const effectiveCurrency = currency ?? 'usd';

    const { checkout, status, error, reset } = useFiatCheckout({
        amount,
        product,
        currency: effectiveCurrency,
        onSuccess,
        onError,
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={status !== 'processing'}>
            <StickyHeaderContainer>
                <ModalHeader>{t('Checkout')}</ModalHeader>
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
                                {product?.name && (
                                    <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                        {product.name}
                                    </Text>
                                )}
                                {product?.description && (
                                    <Text fontSize="sm" color={textSecondary} textAlign="center">
                                        {product.description}
                                    </Text>
                                )}
                                <Text fontSize="3xl" fontWeight="bold">
                                    {amount}
                                </Text>
                            </VStack>
                        </Box>

                        <Text fontSize="xs" color={textSecondary} textAlign="center">
                            {t('Secured by Privy and Stripe')}
                        </Text>
                    </VStack>
                )}

                {status === 'processing' && (
                    <VStack spacing={4} align="center" py={8}>
                        <Spinner size="xl" />
                        <Text fontWeight="bold" fontSize="lg">
                            {t('Processing payment...')}
                        </Text>
                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                            {t('Please complete the payment in the Privy window.')}
                        </Text>
                    </VStack>
                )}

                {status === 'success' && (
                    <StatusScreen
                        status="success"
                        title={t('Payment successful')}
                        description={t('Your payment has been processed successfully.')}
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
                        title={t('Payment failed')}
                        description={error?.message ?? t('Something went wrong. Please try again.')}
                        icon={LuCircleX}
                        actions={
                            <VStack spacing={3} w="full">
                                <Button variant="vechainKitPrimary" onClick={checkout} w="full">
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
                    <Button variant="vechainKitPrimary" onClick={checkout} w="full" size="lg">
                        {t('Pay {{amount}}', { amount })}
                    </Button>
                </ModalFooter>
            )}
        </BaseModal>
    );
};
