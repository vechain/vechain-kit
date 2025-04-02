'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useThor } from '@vechain/dapp-kit-react';
import { type TransactionReceipt, signerUtils } from '@vechain/sdk-network';
import { usePrivyWalletProvider, useVeChainKitConfig } from '@/providers';
import {
    EnhancedClause,
    TransactionStatus,
    TransactionStatusErrorType,
} from '@/types';
import { useGetNodeUrl, useWallet, useTxReceipt } from '@/hooks';
import { Clause } from '@vechain/sdk-core';

const estimateTxGasWithNext = async (
    clauses: Clause[],
    caller: string,
    buffer = 1.25,
    nodeUrl: string,
) => {
    type InspectClausesResponse = {
        data: string;
        gasUsed: number;
        reverted: boolean;
        vmError: string;
        events: any[];
        transfers: any[];
    }[];

    // Send tx details to the node to get the gas estimate
    const response = await fetch(`${nodeUrl}/accounts/*?revision=next`, {
        method: 'POST',
        body: JSON.stringify({
            clauses: clauses.map((clause) => ({
                to: clause.to,
                value: clause.value || '0x0',
                data: clause.data,
            })),
            caller,
        }),
    });

    if (!response.ok) throw new Error('Failed to estimate gas');

    const outputs = (await response.json()) as InspectClausesResponse;

    const execGas = outputs.reduce((sum, out) => sum + out.gasUsed, 0);

    // Calculate the intrinsic gas (transaction fee)
    const intrinsicGas = clauses.reduce((sum, clause) => {
        const data = clause.data || '0x';
        const dataLength = (data.length - 2) / 2; // Remove '0x' prefix and convert to bytes
        return sum + (dataLength === 0 ? 21000 : 21000 + dataLength * 68);
    }, 0);

    // 15000 is the fee for invoking the VM
    // Gas estimate is the sum of intrinsic gas and execution gas
    const gasEstimate = intrinsicGas + (execGas ? execGas + 15000 : 0);

    // Add a % buffer to the gas estimate
    return Math.round(gasEstimate * buffer);
};

/**
 * Props for the {@link useSendTransaction} hook
 * @param signerAccountAddress the signer account to use
 * @param clauses clauses to send in the transaction
 * @param onTxConfirmed callback to run when the tx is confirmed
 * @param onTxFailedOrCancelled callback to run when the tx fails or is cancelled
 * @param suggestedMaxGas the suggested max gas for the transaction
 */
type UseSendTransactionProps = {
    signerAccountAddress?: string | null;
    clauses?:
        | EnhancedClause[]
        | (() => EnhancedClause[])
        | (() => Promise<EnhancedClause[]>);
    onTxConfirmed?: () => void | Promise<void>;
    onTxFailedOrCancelled?: (error?: Error | string) => void | Promise<void>;
    suggestedMaxGas?: number;
    privyUIOptions?: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
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
    sendTransaction: (clauses?: EnhancedClause[]) => Promise<void>;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
    txReceipt: TransactionReceipt | null;
    status: TransactionStatus;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
};

/**
 * Generic hook to send a transaction using the VeChain SDK.
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
 * @returns see {@link UseSendTransactionReturnValue}
 */
export const useSendTransaction = ({
    signerAccountAddress,
    clauses,
    onTxConfirmed,
    onTxFailedOrCancelled,
    suggestedMaxGas,
    privyUIOptions,
}: UseSendTransactionProps): UseSendTransactionReturnValue => {
    const thor = useThor();
    const { feeDelegation } = useVeChainKitConfig();
    const nodeUrl = useGetNodeUrl();

    const { connection } = useWallet();
    const privyWalletProvider = usePrivyWalletProvider();

    /**
     * Convert the clauses to the format expected by the vendor
     * If the clauses are a function, it will be executed and the result will be used
     * If the clauses are an array, it will be used directly
     * If the wallet is connected with Privy, the clauses will be converted to the format expected by the vendor
     * @param clauses the clauses to convert
     * @returns the converted clauses
     */
    async function convertClauses(
        clauses:
            | EnhancedClause[]
            | (() => EnhancedClause[])
            | (() => Promise<EnhancedClause[]>),
    ) {
        let parsedClauses;

        if (typeof clauses === 'function') {
            parsedClauses = await clauses();
        } else {
            parsedClauses = clauses;
        }

        // Don't strip the comment here anymore, just return the clauses
        return parsedClauses;
    }

    /**
     * Send a transaction with the given clauses (in case you need to pass data to build the clauses to mutate directly)
     * If the wallet is connected with Privy, the smart account provider will be used to send the transaction
     * @returns see {@link UseSendTransactionReturnValue}
     */
    const sendTransaction = useCallback(
        async (
            clauses: EnhancedClause[],
            options?: {
                title?: string;
                description?: string;
                buttonText?: string;
            },
        ) => {
            if (connection.isConnectedWithPrivy) {
                return await privyWalletProvider.sendTransaction({
                    txClauses: clauses,
                    ...privyUIOptions,
                    ...options,
                    suggestedMaxGas,
                });
            }

            let gasLimitNext;
            try {
                gasLimitNext = await estimateTxGasWithNext(
                    [...clauses],
                    signerAccountAddress ?? '',
                    undefined,
                    nodeUrl,
                );
            } catch (e) {
                console.error('Gas estimation failed', e);
            }

            const parsedGasLimit = Math.max(
                gasLimitNext ?? 0,
                suggestedMaxGas ?? 0,
            );

            // Build the transaction body with gas limit and delegation
            const txBody = await thor.transactions.buildTransactionBody(
                clauses,
                parsedGasLimit,
                {
                    isDelegated:
                        feeDelegation?.delegateAllTransactions ?? false,
                },
            );

            // Convert the transaction body to a transaction request input
            const txInput =
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    signerAccountAddress ?? '',
                );

            // Send the transaction directly to the node API
            const response = await fetch(`${nodeUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    raw: txInput,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send transaction');
            }

            const { id } = await response.json();
            return { id };
        },
        [
            thor,
            signerAccountAddress,
            suggestedMaxGas,
            nodeUrl,
            privyWalletProvider,
            privyUIOptions,
            feeDelegation,
            connection.isConnectedWithPrivy,
        ],
    );

    /**
     * Adapter to send the transaction with the clauses passed to the hook or the ones passed to the function,
     * and to store the transaction id and the status of the transaction (pending, success, error).
     */
    const [sendTransactionTx, setSendTransactionTx] = useState<string | null>(
        null,
    );
    const [sendTransactionPending, setSendTransactionPending] = useState(false);
    const [sendTransactionError, setSendTransactionError] = useState<
        string | null
    >(null);

    const sendTransactionAdapter = useCallback(
        async (_clauses?: EnhancedClause[]): Promise<void> => {
            if (!_clauses && !clauses) throw new Error('clauses are required');
            try {
                setSendTransactionTx(null);
                setSendTransactionPending(true);
                setSendTransactionError(null);
                setError(undefined);
                const response = await sendTransaction(
                    await convertClauses(_clauses ?? []),
                    {
                        ...privyUIOptions,
                    },
                );
                // If we send the transaction with the smart account, we get the txid as a string
                if (typeof response === 'string') {
                    setSendTransactionTx(response);
                } else if (typeof response === 'object' && 'id' in response) {
                    // If we send the transaction with the vendor, we get the txid from the response
                    setSendTransactionTx(response.id);
                }
            } catch (error) {
                setSendTransactionError(
                    error instanceof Error ? error.message : String(error),
                );
                onTxFailedOrCancelled?.(
                    error instanceof Error ? error : new Error(String(error)),
                );
            } finally {
                setSendTransactionPending(false);
            }
        },
        [sendTransaction, clauses, convertClauses, privyUIOptions],
    );

    /**
     * Fetch the transaction receipt once the transaction is broadcasted
     */
    const {
        data: txReceipt,
        isLoading: isTxReceiptLoading,
        error: txReceiptError,
    } = useTxReceipt(sendTransactionTx ?? '');

    /**
     * Explain the revert reason of the transaction
     * @param txReceipt the transaction receipt
     * @returns the revert reason
     */
    const explainTxRevertReason = useCallback(
        async (txReceipt: TransactionReceipt) => {
            if (!txReceipt.reverted) return;
            if (!txReceipt.meta.txID) return;

            const transactionData = await thor.transactions.getTransaction(
                txReceipt.meta.txID,
            );
            if (!transactionData) return;

            // Use the REST API to get the revert reason since the SDK doesn't support it yet
            const response = await fetch(`${nodeUrl}/accounts/*`, {
                method: 'POST',
                body: JSON.stringify({
                    clauses: transactionData.clauses,
                    caller: transactionData.origin,
                }),
            });

            if (!response.ok) return;

            const outputs = await response.json();
            return outputs;
        },
        [thor, nodeUrl],
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

        if (sendTransactionTx) {
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
        sendTransactionTx,
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

                    const message = revertReason
                        ?.filter(
                            (clause: {
                                reverted: boolean;
                                revertReason?: string;
                            }) => {
                                return clause.reverted && clause.revertReason;
                            },
                        )
                        .map((clause: { revertReason?: string }) => {
                            return clause.revertReason;
                        })
                        .join(', ');

                    setError({
                        type: 'RevertReasonError',
                        reason: message
                            ? 'Transaction reverted with: ' + message
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
        setSendTransactionTx(null);
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
