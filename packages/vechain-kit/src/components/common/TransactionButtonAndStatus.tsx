import { useVeChainKitConfig } from '@/providers';
import { Button, Link, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TransactionStatusErrorType } from '@/types';
import { getConfig } from '@/config';

export type TransactionButtonAndStatusProps = {
    isSubmitting: boolean;
    isTxWaitingConfirmation: boolean;
    onConfirm: () => void;
    transactionPendingText: string;
    txReceipt: Connex.Thor.Transaction.Receipt | null;
    transactionError?: Error | TransactionStatusErrorType | null;
    isSubmitForm?: boolean;
    buttonText: string;
    isDisabled?: boolean;
    style?: {
        accentColor?: string;
    };
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
    isDisabled = false,
    style,
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
                onClick={onConfirm}
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
