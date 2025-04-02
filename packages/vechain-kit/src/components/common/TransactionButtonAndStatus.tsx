import { useVeChainKitConfig } from '@/providers';
import { Button, Link, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { TransactionStatusErrorType } from '@/types';
import { getConfig } from '@/config';
import { type TransactionReceipt } from '@vechain/sdk-network';

export type TransactionButtonAndStatusProps = {
    isSubmitting: boolean;
    isTxWaitingConfirmation: boolean;
    onConfirm: () => void;
    onRetry?: () => void;
    transactionPendingText: string;
    txReceipt: TransactionReceipt | null;
    transactionError?: Error | TransactionStatusErrorType | null;
    isSubmitForm?: boolean;
    buttonText: string;
    isDisabled?: boolean;
    style?: {
        accentColor?: string;
    };
    onError?: (error: string) => void;
};

export const TransactionButtonAndStatus = ({
    transactionError,
    isSubmitting,
    isTxWaitingConfirmation,
    onConfirm,
    onRetry,
    transactionPendingText,
    txReceipt,
    isSubmitForm = false,
    buttonText,
    isDisabled = false,
    style,
    onError,
}: TransactionButtonAndStatusProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { network } = useVeChainKitConfig();

    const errorMessage = useMemo(() => {
        if (!transactionError) return null;
        return (
            (transactionError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [transactionError, t]);

    useEffect(() => {
        if (errorMessage) {
            onError?.(errorMessage);
        }
    }, [errorMessage, onError]);

    const buttonBg = useMemo(() => {
        if (style?.accentColor) return `${style.accentColor} !important`;
        return undefined;
    }, [style?.accentColor]);

    return (
        <VStack width="full" spacing={4}>
            {errorMessage && (
                <Text color="#da5a5a" textAlign="center" width="full">
                    {errorMessage}
                </Text>
            )}
            <Button
                px={4}
                variant="vechainKitPrimary"
                bg={buttonBg}
                onClick={() =>
                    errorMessage && onRetry ? onRetry() : onConfirm()
                }
                type={isSubmitForm ? 'submit' : 'button'}
                isLoading={isSubmitting}
                isDisabled={isDisabled}
                loadingText={
                    isTxWaitingConfirmation
                        ? t('Waiting wallet confirmation...')
                        : transactionPendingText
                }
            >
                {errorMessage
                    ? t('Retry')
                    : buttonText
                    ? buttonText
                    : t('Confirm')}
            </Button>
            {errorMessage && txReceipt?.meta.txID && (
                <Link
                    isExternal
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    textAlign="center"
                    width="full"
                    href={`${getConfig(network.type).explorerUrl}/${
                        txReceipt?.meta.txID
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('View transaction on the explorer')}
                </Link>
            )}
        </VStack>
    );
};
