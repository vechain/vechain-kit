import { useVeChainKitConfig } from '@/providers';
import { Button, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TransactionStatusErrorType } from '@/types';

export type TransactionButtonAndStatusProps = {
    isSubmitting: boolean;
    isTxWaitingConfirmation: boolean;
    onConfirm: () => void;
    transactionPendingText: string;
    txReceipt: Connex.Thor.Transaction.Receipt | null;
    transactionError?: Error | TransactionStatusErrorType | null;
    isSubmitForm?: boolean;
    buttonText: string;
};

export const TransactionButtonAndStatus = ({
    transactionError,
    isSubmitting,
    isTxWaitingConfirmation,
    onConfirm,
    transactionPendingText,
    txReceipt,
    isSubmitForm = false,
    buttonText,
}: TransactionButtonAndStatusProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const errorMessage = useMemo(() => {
        if (!transactionError) return null;
        return (
            (transactionError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [transactionError, t]);

    return (
        <VStack width="full" spacing={4}>
            {errorMessage && (
                <Text color="#da5a5a" textAlign="center" width="full">
                    {errorMessage}
                </Text>
            )}
            <Button
                px={4}
                width="full"
                height="48px"
                variant="solid"
                borderRadius="xl"
                colorScheme="blue"
                onClick={onConfirm}
                type={isSubmitForm ? 'submit' : 'button'}
                isLoading={isSubmitting}
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
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'gray.500'}
                    textAlign="center"
                    width="full"
                >
                    <a
                        href={`https://explore-testnet.vechain.org/transactions/${txReceipt?.meta.txID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('View transaction on the explorer')}
                    </a>
                </Text>
            )}
        </VStack>
    );
};
