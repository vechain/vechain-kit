'use client';

import {
    Box,
    Button,
    HStack,
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
import { useSubscriptionCheckout, PaymentMethod } from '@/hooks/payments/useSubscriptionCheckout';
import { useTranslation } from 'react-i18next';
import { LuCircleCheck, LuCircleX, LuWallet, LuCreditCard } from 'react-icons/lu';
import type { SubscriptionPlan } from '@/types';
import { humanAddress } from '@/utils';

export type SubscriptionCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    plan?: SubscriptionPlan;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

const PaymentMethodToggle = ({
    value,
    onChange,
    hasCrypto,
    hasFiat,
}: {
    value: PaymentMethod;
    onChange: (v: PaymentMethod) => void;
    hasCrypto: boolean;
    hasFiat: boolean;
}) => (
    <HStack spacing={2} w="full">
        {hasFiat && (
            <Button
                size="sm"
                variant={value === 'fiat' ? 'solid' : 'outline'}
                colorScheme={value === 'fiat' ? 'blue' : 'gray'}
                leftIcon={<Icon as={LuCreditCard} />}
                onClick={() => onChange('fiat')}
                flex={1}
            >
                Pay with Card
            </Button>
        )}
        {hasCrypto && (
            <Button
                size="sm"
                variant={value === 'crypto' ? 'solid' : 'outline'}
                colorScheme={value === 'crypto' ? 'blue' : 'gray'}
                leftIcon={<Icon as={LuWallet} />}
                onClick={() => onChange('crypto')}
                flex={1}
            >
                Pay with Crypto
            </Button>
        )}
    </HStack>
);

export const SubscriptionCheckoutModal = ({
    isOpen,
    onClose,
    plan: externalPlan,
    onSuccess,
    onError,
}: SubscriptionCheckoutModalProps) => {
    const { t } = useTranslation();
    const {
        plan,
        subscribe,
        status,
        paymentMethod,
        selectPaymentMethod,
        availablePlans,
        isLoading,
        error,
        selectPlan,
        hasFiat,
    } = useSubscriptionCheckout({ onSuccess, onError });

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleClose = () => {
        onClose();
    };

    if (isLoading && !availablePlans.length) {
        return (
            <BaseModal isOpen={isOpen} onClose={handleClose}>
                <ModalBody py={10}>
                    <VStack spacing={4} align="center">
                        <Spinner size="xl" />
                        <Text>{t('Processing...')}</Text>
                    </VStack>
                </ModalBody>
            </BaseModal>
        );
    }

    const effectivePlan = plan ?? externalPlan ?? null;
    const hasCrypto = !!effectivePlan?.cryptoPayment;
    const hasToggle = hasFiat || hasCrypto;
    const hasAnyPaymentMethod = hasFiat || hasCrypto;

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={status !== 'processing'}>
            <StickyHeaderContainer>
                <ModalHeader>{t('Complete Subscription')}</ModalHeader>
                <ModalCloseButton isDisabled={status === 'processing'} />
            </StickyHeaderContainer>

            <ModalBody>
                {status === 'idle' || status === 'selecting' ? (
                    effectivePlan ? (
                        <VStack spacing={6} py={4}>
                            {(status === 'idle' || status === 'selecting') && hasToggle && (
                                <PaymentMethodToggle
                                    value={paymentMethod}
                                    onChange={selectPaymentMethod}
                                    hasCrypto={hasCrypto}
                                    hasFiat={hasFiat}
                                />
                            )}

                            <Box
                                w="full"
                                p={6}
                                borderRadius="xl"
                                bg="gray.50"
                                _dark={{ bg: 'gray.700' }}
                            >
                                <VStack spacing={3} align="center">
                                    <Text fontWeight="bold" fontSize="lg" textAlign="center">
                                        {effectivePlan.name}
                                    </Text>
                                    {effectivePlan.description && (
                                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                                            {effectivePlan.description}
                                        </Text>
                                    )}

                                    {paymentMethod === 'crypto' && effectivePlan.cryptoPayment ? (
                                        <>
                                            <Text fontSize="3xl" fontWeight="bold">
                                                {t('Send {{amount}} {{token}}', {
                                                    amount: effectivePlan.cryptoPayment.amount,
                                                    token: effectivePlan.cryptoPayment.tokenAddress
                                                        ? 'B3TR'
                                                        : 'VET',
                                                })}
                                            </Text>
                                            <Text fontSize="sm" color={textSecondary}>
                                                {t('To')}{' '}
                                                {humanAddress(
                                                    effectivePlan.cryptoPayment.recipientAddress,
                                                )}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text fontSize="3xl" fontWeight="bold">
                                            ${Number(effectivePlan.amount).toFixed(2)}
                                            <Text
                                                as="span"
                                                fontSize="sm"
                                                fontWeight="normal"
                                                color={textSecondary}
                                            >
                                                /
                                                {effectivePlan.interval === 'month'
                                                    ? t('month')
                                                    : t('year')}
                                            </Text>
                                        </Text>
                                    )}

                                    <VStack align="start" spacing={1} mt={2}>
                                        {effectivePlan.features.map((feature, i) => (
                                            <Text key={i} fontSize="sm">
                                                <Icon
                                                    as={LuCircleCheck}
                                                    color="green.400"
                                                    mr={2}
                                                    boxSize={3}
                                                />
                                                {feature}
                                            </Text>
                                        ))}
                                    </VStack>
                                </VStack>
                            </Box>
                        </VStack>
                    ) : (
                        <VStack spacing={4} py={4}>
                            <Text fontSize="sm" color={textSecondary} textAlign="center">
                                {t('Select a plan to subscribe.')}
                            </Text>
                            {availablePlans.map((p) => (
                                <Box
                                    key={p.id}
                                    w="full"
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    cursor="pointer"
                                    _hover={{ borderColor: 'blue.400' }}
                                    onClick={() => selectPlan(p)}
                                >
                                    <Text fontWeight="bold">{p.name}</Text>
                                    <Text fontSize="xl" fontWeight="bold">
                                        ${Number(p.amount).toFixed(2)}
                                        <Text
                                            as="span"
                                            fontSize="sm"
                                            fontWeight="normal"
                                            color={textSecondary}
                                        >
                                            /
                                            {p.interval === 'month' ? t('month') : t('year')}
                                        </Text>
                                    </Text>
                                </Box>
                            ))}
                        </VStack>
                    )
                ) : null}

                {status === 'processing' && (
                    <VStack spacing={4} align="center" py={8}>
                        <Spinner size="xl" />
                        <Text fontWeight="bold" fontSize="lg">
                            {paymentMethod === 'crypto'
                                ? t('Confirm subscription in your wallet')
                                : t('Processing subscription...')}
                        </Text>
                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                            {paymentMethod === 'crypto'
                                ? t('Confirm the transaction in your wallet')
                                : t('Please complete the purchase in the Transak window.')}
                        </Text>
                    </VStack>
                )}

                {status === 'success' && (
                    <StatusScreen
                        status="success"
                        title={
                            paymentMethod === 'crypto'
                                ? t('Subscription confirmed on-chain')
                                : t('Subscription created')
                        }
                        description={t('Your subscription has been created successfully.')}
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
                        title={t('Subscription failed')}
                        description={error?.message ?? t('Something went wrong. Please try again.')}
                        icon={LuCircleX}
                        actions={
                            <VStack spacing={3} w="full">
                                <Button variant="vechainKitPrimary" onClick={subscribe} w="full">
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

            {(status === 'idle' || status === 'selecting') && effectivePlan && (
                <ModalFooter>
                    {hasAnyPaymentMethod ? (
                        <Button
                            variant="vechainKitPrimary"
                            onClick={subscribe}
                            w="full"
                            size="lg"
                            isLoading={isLoading}
                            loadingText={
                                paymentMethod === 'crypto'
                                    ? t('Confirm subscription in your wallet')
                                    : t('Processing...')
                            }
                        >
                            {paymentMethod === 'crypto' && effectivePlan.cryptoPayment
                                ? t('Send {{amount}} {{token}}', {
                                      amount: effectivePlan.cryptoPayment.amount,
                                      token: effectivePlan.cryptoPayment.tokenAddress
                                          ? 'B3TR'
                                          : 'VET',
                                  })
                                : t('Subscribe {{amount}}', {
                                      amount: `$${Number(effectivePlan.amount).toFixed(2)}/${effectivePlan.interval === 'month' ? t('month') : t('year')}`,
                                  })}
                        </Button>
                    ) : (
                        <Text fontSize="sm" color={textSecondary} textAlign="center" w="full">
                            {t('No payment method available for this plan.')}
                        </Text>
                    )}
                </ModalFooter>
            )}
        </BaseModal>
    );
};
