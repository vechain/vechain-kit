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
    useToast,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useBuyCrypto } from '@/hooks/payments/useBuyCrypto';
import { useState } from 'react';
import { LuDollarSign, LuCircleCheck, LuCircleX } from 'react-icons/lu';

export type FiatOnrampContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type OnrampStep = 'form' | 'processing' | 'success' | 'error';

export const FiatOnrampContent = ({
    setCurrentContent,
}: FiatOnrampContentProps) => {
    const { t } = useTranslation();
    const { fiatOnramp } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();
    const { buyCrypto, isBuying } = useBuyCrypto();
    const toast = useToast();

    const [step, setStep] = useState<OnrampStep>('form');
    const [amount, setAmount] = useState(fiatOnramp?.defaultAmount ?? '50');
    const [currency, setCurrency] = useState<'usd' | 'eur' | 'gbp'>(
        fiatOnramp?.defaultFiat ?? 'usd',
    );

    const handleBuy = async () => {
        setStep('processing');

        try {
            const result = await buyCrypto({ amount, currency });

            if (result.status === 'confirmed') {
                setStep('success');
                toast({
                    title: t('Crypto purchased successfully'),
                    status: 'success',
                    duration: 5000,
                });
            } else {
                setStep('success');
                toast({
                    title: t('Purchase submitted'),
                    status: 'info',
                    duration: 5000,
                });
            }
        } catch {
            setStep('error');
            toast({
                title: t('Purchase failed'),
                status: 'error',
                duration: 5000,
            });
        }
    };

    const handleBack = () => {
        setCurrentContent('main');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Buy crypto')}</ModalHeader>
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
                                    'Buy crypto with your preferred payment method. Powered by Privy and Stripe.',
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
                        <VStack spacing={4} align="center" py={8}>
                            <Spinner size="xl" />
                            <Text fontWeight="bold" fontSize="lg">
                                {t('Processing...')}
                            </Text>
                            <Text fontSize="sm" textAlign="center">
                                {t(
                                    'Please complete the payment in the Privy modal.',
                                )}
                            </Text>
                        </VStack>
                    </ModalBody>
                )}

                {step === 'success' && (
                    <ModalBody>
                        <VStack spacing={4} align="center" py={8}>
                            <Icon as={LuCircleCheck} boxSize={12} color="green.400" />
                            <Text fontWeight="bold" fontSize="lg">
                                {t('Crypto purchased successfully')}
                            </Text>
                            <Text fontSize="sm" textAlign="center">
                                {t(
                                    'Your crypto will arrive in your wallet shortly.',
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
                        isLoading={isBuying}
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
