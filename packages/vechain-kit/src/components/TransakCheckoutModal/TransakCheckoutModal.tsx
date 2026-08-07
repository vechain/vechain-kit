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
import { useTranslation } from 'react-i18next';
import { LuCreditCard, LuCircleCheck, LuCircleX } from 'react-icons/lu';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import { type TransakCheckoutStatus } from '@/hooks/payments/useTransakCheckout';

export type TransakCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransakCheckoutStatus;
    fiatAmount?: string;
    widgetUrl: string | null;
    error: Error | null;
    onStart: () => void;
    onReset: () => void;
    /** Call once the user confirms they finished the purchase in the Transak tab. */
    onMarkCompleted: () => void;
};

export const TransakCheckoutModal = ({
    isOpen,
    onClose,
    status,
    fiatAmount = '10',
    widgetUrl,
    error,
    onStart,
    onReset,
    onMarkCompleted,
}: TransakCheckoutModalProps) => {
    const { t } = useTranslation();
    const { darkMode, theme } = useVeChainKitConfig();

    const handleClose = () => {
        onReset();
        onClose();
    };

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
            <BaseModal
                isOpen={isOpen}
                onClose={handleClose}
                size="lg"
                closeOnOverlayClick={
                    status !== 'processing' && status !== 'ready'
                }
                useBottomSheetOnMobile
                mobileMaxHeight="calc(100dvh - 24px)"
            >
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
                                    <Icon
                                        as={LuCreditCard}
                                        boxSize={8}
                                        color="blue.400"
                                    />
                                    <Text fontSize="3xl" fontWeight="bold">
                                        ${fiatAmount}
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color={textSecondary}
                                        textAlign="center"
                                    >
                                        {t(
                                            'You will be redirected to Transak to complete your purchase.',
                                        )}
                                    </Text>
                                </VStack>
                            </Box>
                        </VStack>
                    )}

                    {status === 'processing' && (
                        <VStack py={10}>
                            <Spinner size="lg" color="blue.400" />
                        </VStack>
                    )}

                    {status === 'ready' && (
                        // Opens in a new tab instead of an embedded iframe -- Transak's
                        // widget rejects the embedded (containerId) request in some
                        // production setups (403 "Access Denied", error code
                        // T-INF-102) while the exact same Secure Widget URL loads fine
                        // as a top-level navigation. See the PR description for the
                        // full diagnosis. There is no postMessage/order event to
                        // detect completion from a separate tab, so the user confirms
                        // manually below.
                        <VStack spacing={6} py={4}>
                            <Box
                                w="full"
                                p={6}
                                borderRadius="xl"
                                bg="gray.50"
                                _dark={{ bg: 'gray.700' }}
                            >
                                <VStack spacing={3} align="center">
                                    <Icon
                                        as={LuCreditCard}
                                        boxSize={8}
                                        color="blue.400"
                                    />
                                    <Text
                                        fontSize="sm"
                                        color={textSecondary}
                                        textAlign="center"
                                    >
                                        {t(
                                            'Continue in the new tab to complete your purchase with Transak, then come back here to confirm.',
                                        )}
                                    </Text>
                                </VStack>
                            </Box>
                            <Button
                                as="a"
                                href={widgetUrl ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="vechainKitPrimary"
                                w="full"
                                size="lg"
                                isDisabled={!widgetUrl}
                            >
                                {t('Continue with Transak')}
                            </Button>
                        </VStack>
                    )}

                    {status === 'success' && (
                        <StatusScreen
                            status="success"
                            title={t('Purchase successful')}
                            description={t(
                                'Your VET will arrive in your wallet shortly.',
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
                            title={t('Purchase failed')}
                            description={
                                error?.message ??
                                t('Something went wrong. Please try again.')
                            }
                            icon={LuCircleX}
                            actions={
                                <VStack spacing={3} w="full">
                                    <Button
                                        variant="vechainKitPrimary"
                                        onClick={onStart}
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

                {status === 'ready' && (
                    <ModalFooter>
                        <Button
                            variant="vechainKitSecondary"
                            onClick={onMarkCompleted}
                            w="full"
                        >
                            {t("I've completed my purchase")}
                        </Button>
                    </ModalFooter>
                )}
            </BaseModal>
        </VechainKitThemeProvider>
    );
};
