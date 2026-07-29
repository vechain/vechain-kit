'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { FiatCheckoutModal } from '@/components/FiatCheckoutModal';
import { useFiatCheckout, FiatCheckoutProduct } from '@/hooks/payments/useFiatCheckout';
import { CURRENCY } from '@/types';
import { useTranslation } from 'react-i18next';

export type PayWithFiatButtonProps = {
    amount: string;
    productName?: string;
    productDescription?: string;
    currency?: CURRENCY;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    buttonProps?: ButtonProps;
};

export const PayWithFiatButton = ({
    amount,
    productName,
    productDescription,
    currency,
    onSuccess,
    onError,
    buttonProps,
}: PayWithFiatButtonProps) => {
    const { t } = useTranslation();

    const product: FiatCheckoutProduct | undefined = productName
        ? { name: productName, description: productDescription }
        : undefined;

    const { isOpen, open, close, status } = useFiatCheckout({
        amount,
        product,
        currency,
        onSuccess,
        onError,
    });

    return (
        <>
            <Button
                variant="vechainKitPrimary"
                onClick={open}
                isLoading={status === 'processing'}
                loadingText={t('Processing...')}
                {...buttonProps}
            >
                {buttonProps?.children ?? t('Pay {{amount}}', { amount: `$${amount}` })}
            </Button>

            <FiatCheckoutModal
                isOpen={isOpen}
                onClose={close}
                amount={amount}
                product={product}
                currency={currency}
                onSuccess={onSuccess}
                onError={onError}
            />
        </>
    );
};
