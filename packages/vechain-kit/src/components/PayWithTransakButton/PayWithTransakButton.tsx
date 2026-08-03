'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { TransakCheckoutModal } from '@/components/TransakCheckoutModal';
import { useTransakCheckout } from '@/hooks/payments/useTransakCheckout';
import { useTranslation } from 'react-i18next';

export type PayWithTransakButtonProps = {
    fiatAmount?: string;
    fiatCurrency?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    buttonProps?: ButtonProps;
};

export const PayWithTransakButton = ({
    fiatAmount = '10',
    fiatCurrency,
    onSuccess,
    onError,
    buttonProps,
}: PayWithTransakButtonProps) => {
    const { t } = useTranslation();

    const { open, close, status, error, reset } = useTransakCheckout(
        onSuccess,
        onError,
    );

    return (
        <>
            <Button
                variant="vechainKitPrimary"
                onClick={() => open({ fiatAmount, fiatCurrency })}
                isLoading={status === 'processing'}
                loadingText={t('Processing...')}
                {...buttonProps}
            >
                {buttonProps?.children ?? t('Buy ${{amount}} VET', { amount: fiatAmount })}
            </Button>

            <TransakCheckoutModal
                isOpen={status !== 'idle'}
                onClose={close}
                status={status}
                fiatAmount={fiatAmount}
                error={error}
                onStart={() => open({ fiatAmount, fiatCurrency })}
                onReset={reset}
            />
        </>
    );
};
