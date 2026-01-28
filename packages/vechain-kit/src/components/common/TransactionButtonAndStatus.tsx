import { useVeChainKitConfig } from '@/providers';
import { Button, Link, Text, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import type { TransactionStatusErrorType } from '../../types';
import { getConfig } from '../../config';
import { TransactionReceipt } from '@vechain/sdk-network';

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
    // Gas estimation error props
    gasEstimationError?: Error | null;
    hasEnoughGasBalance?: boolean;
    isLoadingGasEstimation?: boolean;
    showGasEstimationError?: boolean;
    context?: 'send' | 'customization' | 'domain' | 'transaction';
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
    gasEstimationError,
    hasEnoughGasBalance = true,
    isLoadingGasEstimation = false,
    showGasEstimationError = false,
    context = 'transaction',
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

    // Gas estimation error details - simplified
    const gasEstimationErrorDetails = useMemo(() => {
        // Don't show errors while loading or if we shouldn't show them
        if (!showGasEstimationError || isLoadingGasEstimation) {
            return null;
        }

        // Only show errors if we have an actual error OR if we've completed estimation
        // This prevents showing errors on initial render before estimation starts
        const hasAttemptedEstimation =
            gasEstimationError || hasEnoughGasBalance;
        if (!hasAttemptedEstimation) {
            return null;
        }

        // No gas tokens enabled (only if we have an error but no specific balance issue)
        if (!hasEnoughGasBalance && !gasEstimationError) {
            return {
                message: t(
                    "You don't have any gas tokens enabled. Please enable at least one gas token in Gas Token Preferences.",
                ),
            };
        }

        // Has estimation error - show simple contextual message
        if (gasEstimationError) {
            let message = '';
            switch (context) {
                case 'send':
                    message = t(
                        'Insufficient balance to complete this transfer and cover gas fees.' as any,
                    );
                    break;
                case 'customization':
                    message = t(
                        'Insufficient balance to update your profile and cover gas fees.' as any,
                    );
                    break;
                case 'domain':
                    message = t(
                        'Insufficient balance to claim this domain and cover gas fees.' as any,
                    );
                    break;
                default:
                    message = t(
                        'Insufficient balance to complete this transaction and cover gas fees.' as any,
                    );
            }

            return { message };
        }

        return null;
    }, [
        gasEstimationError,
        hasEnoughGasBalance,
        isLoadingGasEstimation,
        showGasEstimationError,
        context,
        t,
    ]);

    return (
        <VStack width="full" spacing={4}>
            {errorMessage && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg={
                        isDark
                            ? 'rgba(218, 90, 90, 0.1)'
                            : 'rgba(218, 90, 90, 0.05)'
                    }
                    borderWidth="1px"
                    borderColor={
                        isDark
                            ? 'rgba(218, 90, 90, 0.3)'
                            : 'rgba(218, 90, 90, 0.2)'
                    }
                    w="full"
                >
                    <Text
                        color="#da5a5a"
                        fontSize="sm"
                        fontWeight="medium"
                        data-testid="tx-send-error-msg"
                    >
                        {errorMessage}
                    </Text>
                </Box>
            )}

            {gasEstimationErrorDetails && !errorMessage && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg={
                        isDark
                            ? 'rgba(218, 90, 90, 0.1)'
                            : 'rgba(218, 90, 90, 0.05)'
                    }
                    borderWidth="1px"
                    borderColor={
                        isDark
                            ? 'rgba(218, 90, 90, 0.3)'
                            : 'rgba(218, 90, 90, 0.2)'
                    }
                    w="full"
                >
                    <Text
                        color="#da5a5a"
                        fontSize="sm"
                        fontWeight="medium"
                        data-testid="gas-estimation-error"
                    >
                        {gasEstimationErrorDetails.message}
                    </Text>
                </Box>
            )}

            <Button
                px={4}
                variant={
                    errorMessage ? 'vechainKitSecondary' : 'vechainKitPrimary'
                }
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
                data-testid="confirm-button"
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
