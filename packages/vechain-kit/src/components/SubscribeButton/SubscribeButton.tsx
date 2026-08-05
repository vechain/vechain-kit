'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import { SubscriptionCheckoutModal } from '@/components/SubscriptionCheckoutModal';
import { useSubscriptionCheckout } from '@/hooks/payments/useSubscriptionCheckout';
import type { SubscriptionPlan } from '@/types';
import { useTranslation } from 'react-i18next';

export type SubscribeButtonProps = {
    plan?: SubscriptionPlan;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    buttonProps?: ButtonProps;
};

export const SubscribeButton = ({
    plan,
    onSuccess,
    onError,
    buttonProps,
}: SubscribeButtonProps) => {
    const { t } = useTranslation();
    const { isOpen, open, close, isLoading } = useSubscriptionCheckout({
        onSuccess,
        onError,
    });

    return (
        <>
            <Button
                variant="vechainKitPrimary"
                onClick={() => open(plan)}
                isLoading={isLoading}
                loadingText={t('Processing...')}
                {...buttonProps}
            >
                {buttonProps?.children ??
                    (plan
                        ? t('Subscribe {{amount}}', {
                              amount: `$${Number(plan.amount).toFixed(2)}/${plan.interval === 'month' ? t('month') : t('year')}`,
                          })
                        : t('Subscribe'))}
            </Button>

            <SubscriptionCheckoutModal
                isOpen={isOpen}
                onClose={close}
                plan={plan}
                onSuccess={onSuccess}
                onError={onError}
            />
        </>
    );
};
