'use client';

import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    FormControl,
    FormLabel,
    Select,
    Icon,
    Spinner,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useTransakCheckout } from '@/hooks/payments/useTransakCheckout';
import { useEffect, useState } from 'react';
import { LuDollarSign, LuCircleCheck, LuCircleX } from 'react-icons/lu';

export type TransakOnrampContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type OnrampStep = 'form' | 'processing' | 'ready' | 'success' | 'error';

export const TransakOnrampContent = ({
    setCurrentContent,
}: TransakOnrampContentProps) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const [step, setStep] = useState<OnrampStep>('form');
    const [amount, setAmount] = useState('50');
    const [currency, setCurrency] = useState<'usd' | 'eur' | 'gbp'>('usd');

    const {
        open: startCheckout,
        close: closeCheckout,
        status,
        widgetUrl,
        widgetUrlExpired,
        markWidgetUrlOpened,
        markCompleted,
    } = useTransakCheckout(
        () => setStep('success'),
        () => setStep('error'),
    );

    // Mirror the hook's status into this component's own step state (which
    // additionally tracks the pre-checkout 'form' step the hook has no
    // concept of). Skipped once the user has navigated back to 'form' --
    // otherwise a widgetUrlBuilder() call still in flight when they clicked
    // Back would resolve afterwards and silently pull them into 'ready'.
    useEffect(() => {
        if (step === 'form') return;
        if (status === 'ready') setStep('ready');
        else if (status === 'error') setStep('error');
        else if (status === 'success') setStep('success');
    }, [status, step]);

    const handleBuy = async () => {
        setStep('processing');
        startCheckout({
            fiatAmount: amount,
            fiatCurrency: currency.toUpperCase(),
        });
    };

    const handleBack = () => {
        setCurrentContent('main');
    };

    const goBackToForm = () => {
        // Cancels any in-flight (or already-'ready') checkout so it can't
        // resurface after the user has already navigated back.
        closeCheckout();
        setStep('form');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Buy VET')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={step === 'form' ? handleBack : goBackToForm}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                {step === 'form' && (
                    <ModalBody>
                        <VStack spacing={6} align="stretch" w="full">
                            <Text fontSize="sm" textAlign="center">
                                {t(
                                    'Buy VET with your preferred payment method. Powered by Transak.',
                                )}
                            </Text>

                            <FormControl>
                                <FormLabel>{t('Amount')}</FormLabel>
                                <InputGroup>
                                    <InputLeftElement>
                                        <Icon as={LuDollarSign} />
                                    </InputLeftElement>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        placeholder={t('Enter amount')}
                                        min={10}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl>
                                <FormLabel>{t('Currency')}</FormLabel>
                                <Select
                                    value={currency}
                                    onChange={(e) =>
                                        setCurrency(
                                            e.target.value as
                                                | 'usd'
                                                | 'eur'
                                                | 'gbp',
                                        )
                                    }
                                >
                                    <option value="usd">USD</option>
                                    <option value="eur">EUR</option>
                                    <option value="gbp">GBP</option>
                                </Select>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                )}

                {step === 'processing' && (
                    <ModalBody>
                        <VStack py={10}>
                            <Spinner size="lg" color="blue.400" />
                        </VStack>
                    </ModalBody>
                )}

                {step === 'ready' && (
                    // Opens in a new tab instead of an embedded iframe -- Transak's
                    // widget rejects the embedded (containerId) request in some
                    // production setups (403 "Access Denied", error code
                    // T-INF-102) while the exact same Secure Widget URL loads fine
                    // as a top-level navigation. See the PR description for the
                    // full diagnosis. There is no postMessage/order event to
                    // detect completion from a separate tab, so the user confirms
                    // manually below.
                    <ModalBody>
                        <VStack spacing={6} align="stretch" w="full" py={4}>
                            <Text fontSize="sm" textAlign="center">
                                {widgetUrlExpired
                                    ? t(
                                          'This link has expired or was already opened. Get a new one to continue.',
                                      )
                                    : t(
                                          'Continue in the new tab to complete your purchase with Transak, then come back here to confirm.',
                                      )}
                            </Text>
                            {widgetUrlExpired ? (
                                <Button
                                    onClick={handleBuy}
                                    variant="vechainKitPrimary"
                                    w="full"
                                    size="lg"
                                >
                                    {t('Get a new link')}
                                </Button>
                            ) : (
                                <Button
                                    as="a"
                                    href={widgetUrl ?? undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={markWidgetUrlOpened}
                                    variant="vechainKitPrimary"
                                    w="full"
                                    size="lg"
                                    isDisabled={!widgetUrl}
                                >
                                    {t('Continue with Transak')}
                                </Button>
                            )}
                        </VStack>
                    </ModalBody>
                )}

                {step === 'success' && (
                    <ModalBody>
                        <VStack spacing={4} align="center" py={8}>
                            <Icon
                                as={LuCircleCheck}
                                boxSize={12}
                                color="green.400"
                            />
                            <Text fontWeight="bold" fontSize="lg">
                                {t('VET purchased successfully')}
                            </Text>
                            <Text fontSize="sm" textAlign="center">
                                {t(
                                    'Your VET will arrive in your wallet shortly.',
                                )}
                            </Text>
                        </VStack>
                    </ModalBody>
                )}

                {step === 'error' && (
                    <ModalBody>
                        <VStack spacing={4} align="center" py={8}>
                            <Icon as={LuCircleX} boxSize={12} color="red.400" />
                            <Text fontWeight="bold" fontSize="lg">
                                {t('Purchase failed')}
                            </Text>
                            <Text fontSize="sm" textAlign="center">
                                {t('Something went wrong. Please try again.')}
                            </Text>
                        </VStack>
                    </ModalBody>
                )}
            </Container>

            {step === 'form' && (
                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        onClick={handleBuy}
                        isLoading={status === 'processing'}
                        loadingText={t('Processing...')}
                        w="full"
                    >
                        {t('Continue to payment')}
                    </Button>
                </ModalFooter>
            )}

            {step === 'ready' && (
                <ModalFooter>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={markCompleted}
                        w="full"
                    >
                        {t("I've completed my purchase")}
                    </Button>
                </ModalFooter>
            )}

            {step === 'error' && (
                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        onClick={() => setStep('form')}
                        w="full"
                    >
                        {t('Try again')}
                    </Button>
                </ModalFooter>
            )}

            {step === 'success' && (
                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        onClick={handleBack}
                        w="full"
                    >
                        {t('Back')}
                    </Button>
                </ModalFooter>
            )}
        </>
    );
};
