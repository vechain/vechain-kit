import { useCallback } from 'react';
import { useSendTransaction } from '@/hooks/thor/transactions/useSendTransaction';
import { useWallet } from '@/hooks';
import type { SwapParams, SwapQuote } from '../../../types/swap';
import { useTranslation } from 'react-i18next';

/**
 * Hook to execute a swap transaction
 */
export const useSwapTransaction = (
    params: SwapParams | null,
    quote: SwapQuote | null,
) => {
    const { account } = useWallet();
    const { t } = useTranslation();

    const {
        sendTransaction,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        resetStatus,
        error,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
        privyUIOptions: {
            title: t('ConfirmSwapTitle', { defaultValue: 'Confirm Swap' }),
            description: t('ConfirmSwapDescription', { defaultValue: 'Please confirm the swap transaction in your wallet' }),
            buttonText: t('Confirm', { defaultValue: 'Confirm' }),
        },
    });

    const executeSwap = useCallback(async () => {
        if (!params || !quote) {
            throw new Error('Missing swap parameters or quote');
        }

        // Use the aggregator reference from the quote
        if (!quote.aggregator) {
            throw new Error(`Aggregator not found for quote from ${quote.aggregatorName}`);
        }

        // Build transaction clauses
        const clauses = await quote.aggregator.buildSwapTransaction(params, quote);

        if (clauses.length === 0) {
            throw new Error('Failed to build swap transaction');
        }

        // Send the transaction
        await sendTransaction(clauses);
    }, [params, quote, sendTransaction]);

    return {
        executeSwap,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        resetStatus,
        error,
    };
};

