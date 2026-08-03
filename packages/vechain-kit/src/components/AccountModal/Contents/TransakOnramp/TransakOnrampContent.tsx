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
    Box,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    TRANSAK_WIDGET_CONTAINER_ID,
    useTransakCheckout,
} from '@/hooks/payments/useTransakCheckout';
import { useEffect, useState } from 'react';
import { LuDollarSign, LuCircleCheck, LuCircleX } from 'react-icons/lu';

export type TransakOnrampContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type OnrampStep = 'form' | 'processing' | 'success' | 'error';

export const TransakOnrampContent = ({
    setCurrentContent,
}: TransakOnrampContentProps) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const [step, setStep] = useState<OnrampStep>('form');
    const [amount, setAmount] = useState('50');
    const [currency, setCurrency] = useState<'usd' | 'eur' | 'gbp'>('usd');

    const { open: startCheckout, status } = useTransakCheckout(
        () => setStep('success'),
        () => setStep('error'),
    );

    // When the Transak widget closes without completing, status returns to
    // idle -- bring the user back to the form instead of leaving them on the
    // processing step with no widget.
    useEffect(() => {
        if (step === 'processing' && status === 'idle') {
            setStep('form');
        }
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

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Buy VET')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={
                            step === 'form' ? handleBack : () => setStep('form')
                        }
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
                        <Box
                            id={TRANSAK_WIDGET_CONTAINER_ID}
                            w="full"
                            h="calc(100vh - 240px)"
                            minH="420px"
                            maxH="620px"
                            borderRadius="xl"
                            overflow="hidden"
                            position="relative"
                        />
                    </ModalBody>
                )}

                {step === 'success' && (
                    <ModalBody>
                        <VStack spacing={4} align="center" py={8}>
                            <Icon as={LuCircleCheck} boxSize={12} color="green.400" />
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
                                {t(
                                    'Something went wrong. Please try again.',
                                )}
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
