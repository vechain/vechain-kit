import { useVeChainKitConfig } from '@/providers';
import { Button, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type TransactionButtonAndStatusProps = {
    isSubmitting: boolean;
    isTxWaitingConfirmation: boolean;
    handleSend: () => void;
    transactionPendingText: string;
    txReceipt: Connex.Thor.Transaction.Receipt | null;
    error: string | null;
    isSubmitForm?: boolean;
};

export const TransactionButtonAndStatus = ({
    error,
    isSubmitting,
    isTxWaitingConfirmation,
    handleSend,
    transactionPendingText,
    txReceipt,
    isSubmitForm = false,
}: TransactionButtonAndStatusProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <VStack width="full" spacing={4}>
            {error && (
                <Text color="#da5a5a" textAlign="center" width="full">
                    {error}
                </Text>
            )}
            <Button
                px={4}
                width="full"
                height="48px"
                variant="solid"
                borderRadius="xl"
                colorScheme="blue"
                onClick={handleSend}
                type={isSubmitForm ? 'submit' : 'button'}
                isLoading={isSubmitting}
                loadingText={
                    isTxWaitingConfirmation
                        ? t('Waiting wallet confirmation...')
                        : transactionPendingText
                }
            >
                {error ? t('Retry') : t('Confirm')}
            </Button>
            {error && txReceipt?.meta.txID && (
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
