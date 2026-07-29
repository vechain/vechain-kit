'use client';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    VStack,
    Text,
    Box,
    Badge,
    Spinner,
    useToast,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/hooks/payments/useSubscription';
import { LuCheck, LuX } from 'react-icons/lu';
import { useMemo } from 'react';
import { SubscriptionPlan } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const SubscriptionModal = ({ isOpen, onClose }: Props) => {
    const { t } = useTranslation();
    const toast = useToast();

    const {
        createSubscription,
        cancelSubscription,
        currentSubscription,
        availablePlans,
        isLoading,
        error,
    } = useSubscription();

    const activePlan = useMemo(() => {
        if (!currentSubscription) return null;
        return availablePlans.find(
            (p) => p.id === currentSubscription.planId,
        );
    }, [currentSubscription, availablePlans]);

    const handleSelectPlan = async (plan: SubscriptionPlan) => {
        try {
            await createSubscription(plan.id, 'stripe_payment_method');
            toast({
                title: t('Subscription created'),
                status: 'success',
                duration: 5000,
            });
            onClose();
        } catch {
            toast({
                title: t('Failed to create subscription'),
                status: 'error',
                duration: 5000,
            });
        }
    };

    const handleCancel = async () => {
        if (!currentSubscription) return;

        try {
            await cancelSubscription(currentSubscription.id);
            toast({
                title: t('Subscription cancelled'),
                status: 'info',
                duration: 5000,
            });
        } catch {
            toast({
                title: t('Failed to cancel subscription'),
                status: 'error',
                duration: 5000,
            });
        }
    };

    if (isLoading && !availablePlans.length) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalBody py={10}>
                        <VStack spacing={4} align="center">
                            <Spinner size="xl" />
                            <Text>{t('Loading...')}</Text>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    if (error) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('Subscription')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4} align="center" py={6}>
                            <Icon as={LuX} boxSize={8} color="red.400" />
                            <Text color="red.400">
                                {error.message || t('Something went wrong')}
                            </Text>
                            <Button variant="vechainKitSecondary" onClick={onClose}>
                                {t('Close')}
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Subscription')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
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
                                            : currentSubscription.status === 'canceled'
                                              ? 'red'
                                              : 'yellow'
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

                            <Button
                                variant="vechainKitSecondary"
                                colorScheme="red"
                                onClick={handleCancel}
                                isLoading={isLoading}
                            >
                                {t('Cancel subscription')}
                            </Button>
                        </VStack>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            <Text fontSize="sm" textAlign="center">
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
                                            color="gray.500"
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
                                        onClick={() => handleSelectPlan(plan)}
                                        isLoading={isLoading}
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

                <ModalFooter>
                    <Button variant="vechainKitSecondary" onClick={onClose}>
                        {t('Close')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
