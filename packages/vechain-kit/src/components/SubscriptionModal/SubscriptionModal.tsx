'use client';

import {
    Button,
    VStack,
    Text,
    Box,
    Badge,
    Spinner,
    Icon,
    HStack,
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/hooks/payments/useSubscription';
import { LuCheck, LuX } from 'react-icons/lu';
import { useMemo } from 'react';
import {
    BaseModal,
    StickyHeaderContainer,
} from '@/components/common';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
} from '@chakra-ui/react';
import { SubscriptionPlan } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe?: (plan: SubscriptionPlan) => void;
};

export const SubscriptionModal = ({ isOpen, onClose, onSubscribe }: Props) => {
    const { t } = useTranslation();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const {
        currentSubscription,
        availablePlans,
        isLoading,
        isSigningPending,
        error,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
    } = useSubscription();

    const activePlan = useMemo(() => {
        if (!currentSubscription) return null;
        return availablePlans.find(
            (p) => p.id === currentSubscription.planId,
        );
    }, [currentSubscription, availablePlans]);

    if (isLoading && !availablePlans.length && !currentSubscription) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose}>
                <ModalBody py={10}>
                    <VStack spacing={4} align="center">
                        <Spinner size="xl" />
                        <Text>{t('Processing...')}</Text>
                    </VStack>
                </ModalBody>
            </BaseModal>
        );
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="lg">
            <StickyHeaderContainer>
                <ModalHeader>{t('Subscription')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody pb={6}>
                {error && (
                    <VStack spacing={3} align="center" py={4}>
                        <Icon as={LuX} boxSize={8} color="red.400" />
                        <Text color="red.400" fontSize="sm">
                            {error.message || t('Something went wrong')}
                        </Text>
                    </VStack>
                )}

                {currentSubscription && activePlan ? (
                    <VStack spacing={4} align="stretch">
                        <Box
                            p={4}
                            borderRadius="lg"
                            bg="gray.50"
                            _dark={{ bg: 'gray.700' }}
                        >
                            <Text fontWeight="bold" fontSize="lg">
                                {t('Current plan')}: {activePlan.name}
                            </Text>
                            <Badge
                                colorScheme={
                                    currentSubscription.status === 'active'
                                        ? 'green'
                                        : currentSubscription.status ===
                                            'paused'
                                          ? 'yellow'
                                          : currentSubscription.status ===
                                              'canceled'
                                            ? 'red'
                                            : 'gray'
                                }
                                mt={2}
                            >
                                {currentSubscription.status}
                            </Badge>
                            {currentSubscription.currentPeriodEnd && (
                                <Text fontSize="sm" mt={2}>
                                    {t('Next billing date')}:{' '}
                                    {new Date(
                                        currentSubscription.currentPeriodEnd,
                                    ).toLocaleDateString()}
                                </Text>
                            )}
                        </Box>

                        <HStack spacing={3}>
                            {currentSubscription.status === 'active' ? (
                                <Button
                                    variant="vechainKitSecondary"
                                    onClick={() =>
                                        pauseSubscription(
                                            currentSubscription.id,
                                        )
                                    }
                                    isLoading={isSigningPending}
                                    flex={1}
                                >
                                    {t('Pause subscription')}
                                </Button>
                            ) : (
                                currentSubscription.status === 'paused' && (
                                    <Button
                                        variant="vechainKitSecondary"
                                        onClick={() =>
                                            resumeSubscription(
                                                currentSubscription.id,
                                            )
                                        }
                                        isLoading={isSigningPending}
                                        flex={1}
                                    >
                                        {t('Resume subscription')}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="vechainKitSecondary"
                                colorScheme="red"
                                onClick={() =>
                                    cancelSubscription(currentSubscription.id)
                                }
                                isLoading={isSigningPending}
                                flex={1}
                            >
                                {t('Cancel subscription')}
                            </Button>
                        </HStack>
                    </VStack>
                ) : (
                    <VStack spacing={4} align="stretch">
                        <Text
                            fontSize="sm"
                            color={textSecondary}
                            textAlign="center"
                        >
                            {t(
                                'You are not subscribed to any plan. Choose a plan below to get started.',
                            )}
                        </Text>

                        {availablePlans.map((plan) => (
                            <Box
                                key={plan.id}
                                p={4}
                                borderWidth="1px"
                                borderRadius="lg"
                                _hover={{ borderColor: 'blue.400' }}
                                transition="border-color 0.2s"
                            >
                                <Text fontWeight="bold" fontSize="lg">
                                    {plan.name}
                                </Text>
                                <Text fontSize="2xl" fontWeight="bold" mt={2}>
                                    ${plan.amount}
                                    <Text
                                        as="span"
                                        fontSize="sm"
                                        fontWeight="normal"
                                        color={textSecondary}
                                    >
                                        /
                                        {plan.interval === 'month'
                                            ? t('month')
                                            : t('year')}
                                    </Text>
                                </Text>

                                <VStack align="start" spacing={1} mt={3}>
                                    {plan.features.map((feature, i) => (
                                        <Text key={i} fontSize="sm">
                                            <Icon
                                                as={LuCheck}
                                                color="green.400"
                                                mr={2}
                                            />
                                            {feature}
                                        </Text>
                                    ))}
                                </VStack>

                                <Button
                                    mt={4}
                                    variant="vechainKitPrimary"
                                    w="full"
                                    onClick={() => onSubscribe?.(plan)}
                                >
                                    {t('Subscribe')} - ${plan.amount}/
                                    {plan.interval === 'month'
                                        ? t('month')
                                        : t('year')}
                                </Button>
                            </Box>
                        ))}
                    </VStack>
                )}
            </ModalBody>
        </BaseModal>
    );
};
