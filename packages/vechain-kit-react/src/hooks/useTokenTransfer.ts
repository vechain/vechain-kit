import { useCallback, useState } from 'react';
import {
    TokenTransferManager,
    VETTransferParams,
    ERC20TransferParams,
    TransferResult,
} from '@vechain/vechain-kit-core';
import { useTransaction } from './useTransaction';

// Types for the hooks
export interface UseVETTransferProps {
    fromAddress: string;
    toAddress: string;
    amount: string;
    onSuccess?: (result: TransferResult) => void;
    onError?: (error: Error) => void;
}

export interface UseERC20TransferProps {
    fromAddress: string;
    toAddress: string;
    amount: string;
    tokenAddress: string;
    tokenSymbol: string;
    onSuccess?: (result: TransferResult) => void;
    onError?: (error: Error) => void;
}

/**
 * React hook for VET transfers using the core TokenTransferManager
 * Replaces the old useTransferVET hook that had coupled business logic
 *
 * Example usage:
 * ```tsx
 * const { transferVET, isLoading, error } = useVETTransfer({
 *   fromAddress: '0x...',
 *   toAddress: '0x...',
 *   amount: '10.5',
 *   onSuccess: (result) => console.log('Transfer successful!', result),
 *   onError: (error) => console.error('Transfer failed:', error)
 * });
 * ```
 */
export function useVETTransfer(
    transferManager: TokenTransferManager,
    props: UseVETTransferProps,
) {
    const {
        sendTransaction,
        isLoading,
        error,
        transaction,
        status,
        resetState,
    } = useTransaction(transferManager.transactionManager);

    const [transferResult, setTransferResult] = useState<TransferResult | null>(
        null,
    );

    const transferVET = useCallback(async () => {
        try {
            resetState();
            setTransferResult(null);

            const result = await transferManager.transferVET({
                fromAddress: props.fromAddress,
                toAddress: props.toAddress,
                amount: props.amount,
            });

            setTransferResult(result);

            // Wait for transaction confirmation
            await result.transaction.wait({
                onConfirmed: () => {
                    props.onSuccess?.(result);
                },
                onFailed: (txError) => {
                    props.onError?.(new Error(txError.userFriendlyMessage));
                },
            });

            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            props.onError?.(error);
            throw error;
        }
    }, [transferManager, props, resetState]);

    return {
        transferVET,
        isLoading,
        error,
        transaction,
        status,
        transferResult,
        resetState,
    };
}

/**
 * React hook for ERC20 transfers using the core TokenTransferManager
 * Replaces the old useTransferERC20 hook that had coupled business logic
 *
 * Example usage:
 * ```tsx
 * const { transferERC20, isLoading, error } = useERC20Transfer({
 *   fromAddress: '0x...',
 *   toAddress: '0x...',
 *   amount: '100',
 *   tokenAddress: '0x...',
 *   tokenSymbol: 'USDC',
 *   onSuccess: (result) => console.log('Transfer successful!', result),
 *   onError: (error) => console.error('Transfer failed:', error)
 * });
 * ```
 */
export function useERC20Transfer(
    transferManager: TokenTransferManager,
    props: UseERC20TransferProps,
) {
    const {
        sendTransaction,
        isLoading,
        error,
        transaction,
        status,
        resetState,
    } = useTransaction(transferManager.transactionManager);

    const [transferResult, setTransferResult] = useState<TransferResult | null>(
        null,
    );

    const transferERC20 = useCallback(async () => {
        try {
            resetState();
            setTransferResult(null);

            const result = await transferManager.transferERC20({
                fromAddress: props.fromAddress,
                toAddress: props.toAddress,
                amount: props.amount,
                tokenAddress: props.tokenAddress,
                tokenSymbol: props.tokenSymbol,
            });

            setTransferResult(result);

            // Wait for transaction confirmation
            await result.transaction.wait({
                onConfirmed: () => {
                    props.onSuccess?.(result);
                },
                onFailed: (txError) => {
                    props.onError?.(new Error(txError.userFriendlyMessage));
                },
            });

            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            props.onError?.(error);
            throw error;
        }
    }, [transferManager, props, resetState]);

    return {
        transferERC20,
        isLoading,
        error,
        transaction,
        status,
        transferResult,
        resetState,
    };
}

/**
 * Higher-level hook that provides both VET and ERC20 transfer capabilities
 * Can automatically detect transfer type and route accordingly
 */
export function useTokenTransfer(transferManager: TokenTransferManager) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [transferResult, setTransferResult] = useState<TransferResult | null>(
        null,
    );

    const transfer = useCallback(
        async (
            params: (VETTransferParams | ERC20TransferParams) & {
                type?: 'VET' | 'ERC20';
            },
        ) => {
            try {
                setIsLoading(true);
                setError(null);
                setTransferResult(null);

                let result: TransferResult;

                // Auto-detect or use explicit type
                const isERC20 =
                    params.type === 'ERC20' || 'tokenAddress' in params;

                if (isERC20) {
                    result = await transferManager.transferERC20(
                        params as ERC20TransferParams,
                    );
                } else {
                    result = await transferManager.transferVET(
                        params as VETTransferParams,
                    );
                }

                setTransferResult(result);

                // Wait for confirmation
                await result.transaction.wait();

                return result;
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error(String(err));
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [transferManager],
    );

    const resetState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setTransferResult(null);
    }, []);

    return {
        transfer,
        isLoading,
        error,
        transferResult,
        resetState,
    };
}
