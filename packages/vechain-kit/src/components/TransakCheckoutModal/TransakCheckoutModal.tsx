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
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import {
    TRANSAK_WIDGET_CONTAINER_ID,
    type TransakCheckoutStatus,
} from '@/hooks/payments/useTransakCheckout';

export type TransakCheckoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransakCheckoutStatus;
    fiatAmount?: string;
    error: Error | null;
    onStart: () => void;
    onReset: () => void;
    /** False while the Transak iframe is still loading its remote app -- shows a spinner over the (otherwise blank) container. */
    widgetReady?: boolean;
};

export const TransakCheckoutModal = ({
    isOpen,
    onClose,
    status,
    fiatAmount = '10',
    error,
    onStart,
    onReset,
    widgetReady = false,
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
            closeOnOverlayClick={status !== 'processing'}
            allowExternalFocus={status === 'processing'}
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
                    // Transak's own single-embed guidance (docs.transak.com/integration/web/iframe)
                    // sizes the container at `height: 80dvh` with no lower cap — the deeper steps
                    // of the flow (KYC, add-card-details) need close to that much room. The
                    // previous 620px ceiling clipped those steps, so the "add card details" panel
                    // rendered cut off and overlapping the quote screen underneath it.
                    //
                    // The spinner lives in a SIBLING overlay, never inside the
                    // SDK's own container div: the SDK appends/removes the
                    // iframe with direct DOM calls (containerId mode), which
                    // would fight React for ownership of that node's children.
                    <Box
                        w="full"
                        h="80dvh"
                        minH="560px"
                        maxH="900px"
                        position="relative"
                    >
                        <Box
                            id={TRANSAK_WIDGET_CONTAINER_ID}
                            w="full"
                            h="full"
                            borderRadius="xl"
                            overflow="hidden"
                            position="relative"
                        />
                        {!widgetReady && (
                            <Box
                                position="absolute"
                                inset={0}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="xl"
                                pointerEvents="none"
                            >
                                <Spinner size="lg" color="blue.400" />
                            </Box>
                        )}
                    </Box>
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
        </VechainKitThemeProvider>
    );
};
