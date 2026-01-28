'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionMessage } from '@vechain/dapp-kit';
// Import from specific provider files to avoid circular dependencies
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';
import { useOptionalPrivyWalletProvider } from '../../../providers/PrivyWalletProvider';
import type { TransactionStatus, TransactionStatusErrorType } from '../../../types';
// Direct imports to avoid circular dependencies
import { useGetNodeUrl } from '../../utils/useGetNodeUrl';
import { useTxReceipt } from './useTxReceipt';
import { useWallet } from '../../api/wallet/useWallet';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';
import { useOptionalDAppKitWallet } from '../../api/dappkit/useOptionalDAppKitWallet';
import { useGasEstimate } from './useGasEstimate';
import { TransactionReceipt } from '@vechain/sdk-network';
import { Revision, TransactionClause } from '@vechain/sdk-core';

/**
 * Props for the {@link useSendTransaction} hook
 * @param signerAccountAddress the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 * @param privyUIOptions options to pass to the Privy UI
 * @param gasPadding the gas padding to use for the transaction (Eg. 0.1 for 10%)
 * @param delegationUrl the dApp sponsored delegator url.
 */
type UseSendTransactionProps = {
    signerAccountAddress?: string | null;
    clauses?: TransactionClause[];
    onTxConfirmed?: () => void | Promise<void>;
    onTxFailedOrCancelled?: (error?: Error | string) => void | Promise<void>;
    suggestedMaxGas?: number;
    privyUIOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
    gasPadding?: number;
    delegationUrl?: string;
};

/**
 * Return value of the {@link useSendTransaction} hook
 * @param sendTransaction function to trigger the transaction
 * @param isTransactionPending boolean indicating if the transaction is waiting for the wallet to sign it
 * @param isWaitingForWalletConfirmation boolean indicating if the transaction is waiting for the wallet to confirm it
 * @param txReceipt the transaction receipt
 * @param status the status of the transaction (see {@link TransactionStatus})
 * @param resetStatus function to reset the status to "ready"
 * @param error error that occurred while sending the transaction
 */
export type UseSendTransactionReturnValue = {
    sendTransaction: (
        clauses?: TransactionClause[],
        delegationUrl?: string,
        privyUIOptions?: {
            title?: string;
            description?: string;
            buttonText?: string;
        },
    ) => Promise<void>;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
    txReceipt: TransactionReceipt | null;
    status: TransactionStatus;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction using dapp-kit-react.
 * This hook supports both Privy and VeChain wallets.
 *
 * It returns a function to send the transaction and a status to indicate the state
 * of the transaction (together with the transaction id).
 *
 * * ⚠️ IMPORTANT: When using this hook with Privy cross-app connections, ensure all
 * data fetching is done before triggering the transaction. Fetching data after
 * the transaction is triggered may cause browser popup blocking. Pre-fetch any
 * required data and pass it to your transaction building logic.
 *
 * @example
 * ```typescript
 * // ❌ Bad: Fetching during transaction
 * const sendTx = async () => {
 *   const data = await fetchSomeData(); // May cause popup blocking
 *   return sendTransaction(data);
 * };
 *
 * // ✅ Good: Pre-fetch data
 * const { data } = useQuery(['someData'], fetchSomeData);
 * const sendTx = () => sendTransaction(data); // No async operations
 * ```
 *
 * @param signerAccount the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 * @param privyUIOptions options to pass to the Privy UI
 * @param gasPadding the gas padding to use for the transaction (Eg. 0.1 for 10%)
 * @param delegationUrl the dApp sponsored delegator url.
 * @returns see {@link UseSendTransactionReturnValue}
 */
export const useSendTransaction = ({
    signerAccountAddress,
    clauses,
    onTxConfirmed,
    onTxFailedOrCancelled,
    suggestedMaxGas,
    privyUIOptions,
    gasPadding,
    delegationUrl,
}: UseSendTransactionProps): UseSendTransactionReturnValue => {
    // Use optional hooks that handle missing providers gracefully
    const thor = useOptionalThor();
    const { signer, requestTransaction } = useOptionalDAppKitWallet();
    const { connection } = useWallet();
    const { feeDelegation } = useVeChainKitConfig();
    const nodeUrl = useGetNodeUrl();
    // Use optional provider - returns null when Privy is not configured
    const privyWalletProvider = useOptionalPrivyWalletProvider();

    /**
     * Send a transaction with the given clauses (in case you need to pass data to build the clauses to mutate directly)
     * If the wallet is connected with Privy, the smart account provider will be used to send the transaction
     * @returns see {@link UseSendTransactionReturnValue}
     */
    const sendTransaction = useCallback(
        async (
            clauses?:
                | TransactionClause[]
                | (() => TransactionClause[])
                | (() => Promise<TransactionClause[]>),
            delegationUrl?: string,
            privyUIOptions?: {
                title?: string;
                description?: string;
                buttonText?: string;
            },
        ) => {
            const _clauses =
                typeof clauses === 'function' ? await clauses() : clauses ?? [];
            if (connection.isConnectedWithPrivy) {
                if (!privyWalletProvider) {
                    throw new Error(
                        'Privy is not configured. Please configure the privy prop in VeChainKitContext to use this feature.',
                    );
                }
                return await privyWalletProvider.sendTransaction({
                    txClauses: _clauses,
                    ...privyUIOptions,
                    delegationUrl,
                });
            }

            if (!signerAccountAddress) {
                throw new Error('signerAccountAddress is required');
            }

            let estimatedGas = 0;
            try {
                if (thor) {
                    estimatedGas = await useGasEstimate(
                        thor,
                        [..._clauses],
                        signerAccountAddress,
                        {
                            revision: Revision.NEXT,
                            ...(gasPadding ? { gasPadding } : {}), //If gasPadding is provided, use it, otherwise it will apply only revision
                        },
                    );
                }
            } catch (e) {
                console.error('Gas estimation failed', e);
            }

            // Use signerAccountAddress (stored active wallet) as signer when on desktop with dappkit
            // This ensures the extension uses the correct wallet that the user selected
            const signerAddress = connection.isConnectedWithDappKit && !connection.isInAppBrowser && signerAccountAddress
                ? signerAccountAddress
                : signer.address;

            const response = await requestTransaction(
                _clauses as TransactionMessage[],
                {
                    signer: signerAddress,
                    gas: suggestedMaxGas ?? estimatedGas,
                    ...(feeDelegation?.delegateAllTransactions || delegationUrl ? {
                        delegator: {
                            url: delegationUrl ?? feeDelegation?.delegatorUrl ?? '',
                            signer: signerAccountAddress,
                        }
                    } : {}),
                }
            );
            return response.txid;
        },
        [
            signerAccountAddress,
            suggestedMaxGas,
            nodeUrl,
            privyWalletProvider,
            privyUIOptions,
            feeDelegation,
            thor,
            signer,
            gasPadding,
            delegationUrl,
            requestTransaction,
            connection.isConnectedWithDappKit,
            connection.isInAppBrowser,
        ],
    );

    /**
     * Adapter to send the transaction with the clauses passed to the hook or the ones passed to the function,
     * and to store the transaction id and the status of the transaction (pending, success, error).
     */
    const [txHash, setTxHash] = useState<string | null>(null);
    const [sendTransactionPending, setSendTransactionPending] = useState(false);
    const [sendTransactionError, setSendTransactionError] = useState<
        string | null
    >(null);

    const sendTransactionAdapter = useCallback(
        async (_clauses?: TransactionClause[], _delegationUrl?: string): Promise<void> => {
            if (!_clauses && !clauses) throw new Error('clauses are required');
            try {
                setTxHash(null);
                setSendTransactionPending(true);
                setSendTransactionError(null);
                setError(undefined);
                const response = await sendTransaction(_clauses ?? [], _delegationUrl, {
                    ...privyUIOptions,
                });

                setTxHash(response);
            } catch (error) {
                setSendTransactionError(
                    error && typeof error === 'object' && 'message' in error
                        ? (error.message as string)
                        : String(error),
                );
                onTxFailedOrCancelled?.(
                    error instanceof Error ? error : new Error(String(error)),
                );
            } finally {
                setSendTransactionPending(false);
            }
        },
        [sendTransaction, clauses, privyUIOptions, delegationUrl],
    );

    /**
     * Fetch the transaction receipt once the transaction is broadcasted
     */
    const {
        data: txReceipt,
        isLoading: isTxReceiptLoading,
        error: txReceiptError,
    } = useTxReceipt(txHash ?? '');

    /**
     * Explain the revert reason of the transaction
     * @param txReceipt the transaction receipt
     * @returns the revert reason
     */
    const explainTxRevertReason = useCallback(
        async (txReceipt: TransactionReceipt) => {
            if (!txReceipt.reverted || !txReceipt.meta.txID || !thor) return;

            return await thor.transactions.getRevertReason(txReceipt.meta.txID);
        },
        [thor],
    );

    /**
     * General error that is set when
     * - unable to send the tx
     * - unable to fetch the receipt
     * - the transaction is reverted
     */
    const [error, setError] = useState<TransactionStatusErrorType>();

    /**
     * The status of the transaction
     */
    const status = useMemo(() => {
        if (sendTransactionPending) return 'pending';

        if (sendTransactionError) {
            return 'error';
        }

        if (txHash) {
            if (isTxReceiptLoading) return 'waitingConfirmation';
            if (txReceiptError) {
                return 'error';
            }
            if (txReceipt) {
                if (txReceipt.reverted) {
                    return 'error';
                }
                return 'success';
            }
        }

        return 'ready';
    }, [
        isTxReceiptLoading,
        sendTransactionError,
        sendTransactionPending,
        txHash,
        txReceipt,
        txReceiptError,
    ]);

    /**
     * If the transaction is successful or in error, explain the revert reason
     */
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            if (sendTransactionError && !error) {
                setError({
                    type: 'UserRejectedError',
                    reason: sendTransactionError,
                });
                return;
            }

            if (txReceipt?.reverted && !error?.type) {
                (async () => {
                    const revertReason = await explainTxRevertReason(txReceipt);

                    setError({
                        type: 'RevertReasonError',
                        reason: revertReason
                            ? 'Transaction reverted with: ' + revertReason
                            : 'Transaction reverted',
                    });
                })();
                return;
            }

            if (txReceipt && !txReceipt.reverted) {
                onTxConfirmed?.();
            }
        }
    }, [
        status,
        txReceipt,
        onTxConfirmed,
        explainTxRevertReason,
        sendTransactionError,
    ]);

    /**
     * Reset the status of the transaction
     */
    const resetStatus = useCallback(() => {
        setTxHash(null);
        setSendTransactionPending(false);
        setSendTransactionError(null);
        setError(undefined);
    }, []);

    /**
     * Check if the transaction is pending
     */
    const isTransactionPending = useMemo(() => {
        return (
            sendTransactionPending ||
            isTxReceiptLoading ||
            status === 'pending' ||
            status === 'waitingConfirmation'
        );
    }, [sendTransactionPending, isTxReceiptLoading, status]);

    const isWaitingForWalletConfirmation = useMemo(() => {
        return status === 'pending';
    }, [sendTransactionPending, status]);

    return {
        sendTransaction: sendTransactionAdapter,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt: txReceipt ?? null,
        status,
        resetStatus,
        error,
    };
};
