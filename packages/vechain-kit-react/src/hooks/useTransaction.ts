import { useCallback, useState } from 'react';

// These would be imported from '@vechain/vechain-kit-core' once the package is properly set up
// For now, defining the types locally to demonstrate the concept
export interface TransactionParams {
    clauses: any[];
    signerAddress: string;
    maxGas?: number;
    delegated?: boolean;
}

export type TransactionState =
    | 'idle'
    | 'building'
    | 'estimating'
    | 'signing'
    | 'broadcasting'
    | 'pending'
    | 'confirmed'
    | 'failed'
    | 'cancelled';

export interface TransactionErrorDetails {
    code: string;
    message: string;
    category: string;
    retryable: boolean;
    userFriendlyMessage: string;
}

export interface TrackedTransaction {
    id: string;
    status: TransactionState;
    wait(options?: {
        onConfirmed?: (receipt: any) => void;
        onFailed?: (error: TransactionErrorDetails) => void;
    }): Promise<any>;
    on(event: string, listener: (...args: any[]) => void): void;
}

export interface TransactionManager {
    send(params: TransactionParams): Promise<TrackedTransaction>;
    cancelTransaction(id: string): Promise<boolean>;
}

/**
 * React hook for managing transactions using the core TransactionManager
 * This replaces the complex useSendTransaction hook from the legacy package
 *
 * Example usage:
 * ```tsx
 * const { sendTransaction, isLoading, error, status } = useTransaction(transactionManager);
 *
 * const handleSend = async () => {
 *   const tx = await sendTransaction({
 *     clauses: [clause1, clause2],
 *     signerAddress: '0x...'
 *   });
 *
 *   await tx.wait({
 *     onConfirmed: (receipt) => console.log('Success!', receipt),
 *     onFailed: (error) => console.error('Failed:', error)
 *   });
 * };
 */
export function useTransaction(transactionManager: TransactionManager) {
    const [currentTransaction, setCurrentTransaction] =
        useState<TrackedTransaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<TransactionErrorDetails | null>(null);

    const sendTransaction = useCallback(
        async (params: TransactionParams) => {
            try {
                setIsLoading(true);
                setError(null);

                const tx = await transactionManager.send(params);
                setCurrentTransaction(tx);

                // Set up listeners for transaction updates
                tx.on(
                    'statusChange',
                    (eventData: {
                        status: TransactionState;
                        error?: TransactionErrorDetails;
                    }) => {
                        if (eventData.status === 'failed' && eventData.error) {
                            setError(eventData.error);
                        }
                        if (
                            ['confirmed', 'failed', 'cancelled'].includes(
                                eventData.status,
                            )
                        ) {
                            setIsLoading(false);
                        }
                    },
                );

                return tx;
            } catch (err) {
                const txError = err as TransactionErrorDetails;
                setError(txError);
                setIsLoading(false);
                throw err;
            }
        },
        [transactionManager],
    );

    const cancelTransaction = useCallback(async () => {
        if (!currentTransaction) return false;

        const cancelled = await transactionManager.cancelTransaction(
            currentTransaction.id,
        );
        if (cancelled) {
            setCurrentTransaction(null);
            setIsLoading(false);
        }
        return cancelled;
    }, [transactionManager, currentTransaction]);

    const resetState = useCallback(() => {
        setCurrentTransaction(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        sendTransaction,
        cancelTransaction,
        resetState,
        transaction: currentTransaction,
        isLoading,
        error,
        status: currentTransaction?.status || ('idle' as TransactionState),
    };
}

/**
 * Higher-level hook for building and sending transactions
 * Replaces the useBuildTransaction hook from legacy package
 *
 * Example usage:
 * ```tsx
 * const { buildAndSend, isLoading, error } = useBuildTransaction(
 *   transactionManager,
 *   (params) => [transferClause(params.to, params.amount)],
 *   {
 *     onSuccess: () => toast.success('Transfer completed!'),
 *     onError: (error) => toast.error(error.userFriendlyMessage)
 *   }
 * );
 */
export function useBuildTransaction<T>(
    transactionManager: TransactionManager,
    clauseBuilder: (params: T) => any[],
    options?: {
        onSuccess?: () => void;
        onError?: (error: TransactionErrorDetails) => void;
    },
) {
    const { sendTransaction, ...rest } = useTransaction(transactionManager);

    const buildAndSend = useCallback(
        async (params: T & { signerAddress: string }) => {
            try {
                const clauses = clauseBuilder(params);
                const tx = await sendTransaction({
                    clauses,
                    signerAddress: params.signerAddress,
                });

                await tx.wait({
                    onConfirmed: () => options?.onSuccess?.(),
                    onFailed: (error: TransactionErrorDetails) =>
                        options?.onError?.(error),
                });

                return tx;
            } catch (error) {
                options?.onError?.(error as TransactionErrorDetails);
                throw error;
            }
        },
        [sendTransaction, clauseBuilder, options],
    );

    return {
        buildAndSend,
        ...rest,
    };
}
