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
import {
    BaseModal,
    StatusScreen,
    StickyHeaderContainer,
} from '@/components/common';
import { useSubscriptionCheckout } from '@/hooks/payments/useSubscriptionCheckout';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import { useTranslation } from 'react-i18next';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';
import type { SubscriptionPlan } from '@/types';
import { humanAddress } from '@/utils';
import { ZERO_ADDRESS } from '@/utils/subscriptions';

export type SubscriptionCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    plan?: SubscriptionPlan;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

export const SubscriptionCheckoutModal = ({
    isOpen,
    onClose,
    plan: externalPlan,
    onSuccess,
    onError,
}: SubscriptionCheckoutModalProps) => {
    const { t } = useTranslation();
    const { darkMode, theme } = useVeChainKitConfig();
    const {
        plan,
        subscribe,
        status,
        availablePlans,
        isLoading,
        error,
        isSigningPending,
        isWaitingForWalletConfirmation,
    } = useSubscriptionCheckout({ onSuccess, onError });

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleClose = () => {
        onClose();
    };

    if (isLoading && !availablePlans.length) {
        return (
            <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
                <BaseModal isOpen={isOpen} onClose={handleClose}>
                    <ModalBody py={10}>
                        <VStack spacing={4} align="center">
                            <Spinner size="xl" />
                            <Text>{t('Processing...')}</Text>
                        </VStack>
                    </ModalBody>
                </BaseModal>
            </VechainKitThemeProvider>
        );
    }

    const effectivePlan = plan ?? externalPlan ?? null;
    const isProcessing = status === 'processing';

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                closeOnOverlayClick={!isProcessing}
            >
                <StickyHeaderContainer>
                    <ModalHeader>{t('Complete Subscription')}</ModalHeader>
                    <ModalCloseButton isDisabled={isProcessing} />
                </StickyHeaderContainer>

                <ModalBody>
                    {effectivePlan && (
                        <VStack spacing={6} py={4}>
                            <Box
                                w="full"
                                p={6}
                                borderRadius="xl"
                                bg="gray.50"
                                _dark={{ bg: 'gray.700' }}
                            >
                                <VStack spacing={3} align="center">
                                    <Text
                                        fontWeight="bold"
                                        fontSize="lg"
                                        textAlign="center"
                                    >
                                        {effectivePlan.name}
                                    </Text>
                                    {effectivePlan.description && (
                                        <Text
                                            fontSize="sm"
                                            color={textSecondary}
                                            textAlign="center"
                                        >
                                            {effectivePlan.description}
                                        </Text>
                                    )}

                                    {effectivePlan.cryptoPayment ? (
                                        <>
                                            <Text
                                                fontSize="3xl"
                                                fontWeight="bold"
                                            >
                                                {t(
                                                    'Send {{amount}} {{token}}',
                                                    {
                                                        amount:
                                                            effectivePlan
                                                                .cryptoPayment
                                                                .amount,
                                                        token:
                                                            effectivePlan
                                                                .cryptoPayment
                                                                .tokenAddress &&
                                                            effectivePlan
                                                                .cryptoPayment
                                                                .tokenAddress !==
                                                                ZERO_ADDRESS
                                                                ? 'B3TR'
                                                                : 'VET',
                                                    },
                                                )}
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                color={textSecondary}
                                            >
                                                {t('To')}{' '}
                                                {humanAddress(
                                                    effectivePlan.cryptoPayment
                                                        .recipientAddress,
                                                )}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                        >
                                            ${Number(effectivePlan.amount).toFixed(2)}
                                            <Text
                                                as="span"
                                                fontSize="sm"
                                                fontWeight="normal"
                                                color={textSecondary}
                                            >
                                                /
                                                {effectivePlan.interval ===
                                                'month'
                                                    ? t('month')
                                                    : t('year')}
                                            </Text>
                                        </Text>
                                    )}

                                    <VStack align="start" spacing={1} mt={2}>
                                        {effectivePlan.features.map(
                                            (feature, i) => (
                                                <Text key={i} fontSize="sm">
                                                    <Icon
                                                        as={LuCircleCheck}
                                                        color="green.400"
                                                        mr={2}
                                                        boxSize={3}
                                                    />
                                                    {feature}
                                                </Text>
                                            ),
                                        )}
                                    </VStack>
                                </VStack>
                            </Box>
                        </VStack>
                    )}

                    {status === 'processing' && (
                        <VStack spacing={4} align="center" py={8}>
                            <Spinner size="xl" />
                            <Text fontWeight="bold" fontSize="lg">
                                {isWaitingForWalletConfirmation ||
                                isSigningPending
                                    ? t('Confirm subscription in your wallet')
                                    : t('Processing subscription...')}
                            </Text>
                            <Text
                                fontSize="sm"
                                color={textSecondary}
                                textAlign="center"
                            >
                                {t('Confirm the transaction in your wallet')}
                            </Text>
                        </VStack>
                    )}

                    {status === 'success' && (
                        <StatusScreen
                            status="success"
                            title={t('Subscription created')}
                            description={t(
                                'Your subscription has been created successfully.',
                            )}
                            icon={LuCircleCheck}
                            actions={
                                <Button
                                    variant="vechainKitPrimary"
                                    onClick={onClose}
                                    w="full"
                                >
                                    {t('Done')}
                                </Button>
                            }
                        />
                    )}

                    {status === 'error' && (
                        <StatusScreen
                            status="error"
                            title={t('Subscription failed')}
                            description={
                                error?.message ??
                                t('Something went wrong. Please try again.')
                            }
                            icon={LuCircleX}
                            actions={
                                <VStack spacing={3} w="full">
                                    <Button
                                        variant="vechainKitPrimary"
                                        onClick={subscribe}
                                        w="full"
                                    >
                                        {t('Try again')}
                                    </Button>
                                    <Button
                                        variant="vechainKitSecondary"
                                        onClick={handleClose}
                                        w="full"
                                    >
                                        {t('Cancel')}
                                    </Button>
                                </VStack>
                            }
                        />
                    )}
                </ModalBody>

                {effectivePlan && status !== 'success' && status !== 'error' && (
                    <ModalFooter>
                        <Button
                            variant="vechainKitPrimary"
                            onClick={subscribe}
                            w="full"
                            size="lg"
                            isLoading={isLoading || isProcessing}
                            loadingText={
                                isWaitingForWalletConfirmation ||
                                isSigningPending
                                    ? t('Confirm subscription in your wallet')
                                    : t('Processing...')
                            }
                        >
                            {effectivePlan.cryptoPayment
                                ? t('Send {{amount}} {{token}}', {
                                      amount:
                                          effectivePlan.cryptoPayment.amount,
                                      token:
                                          effectivePlan.cryptoPayment
                                              .tokenAddress &&
                                          effectivePlan.cryptoPayment
                                              .tokenAddress !== ZERO_ADDRESS
                                              ? 'B3TR'
                                              : 'VET',
                                  })
                                : t('Subscribe {{amount}}', {
                                      amount: `$${Number(effectivePlan.amount).toFixed(2)}/${effectivePlan.interval === 'month' ? t('month') : t('year')}`,
                                  })}
                        </Button>
                    </ModalFooter>
                )}
            </BaseModal>
        </VechainKitThemeProvider>
    );
};
