import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '../api';
import { useSendTransaction } from './useSendTransaction';
import { EnhancedClause } from '@/types';
import { useGasTokenSelection } from './useGasTokenSelection';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { createGasEstimationService } from '@/services/api/gas-estimation';
import {
    appendPaymentClause,
    encodeTransactionBody,
} from '@/utils/paymentClauseBuilder';
import { GENERIC_DELEGATOR_URL } from '@/utils/Constants';

export type BuildTransactionProps<ClausesParams> = {
    clauseBuilder: (props: ClausesParams) => EnhancedClause[];
    refetchQueryKeys?: (string | undefined)[][];
    onSuccess?: () => void;
    invalidateCache?: boolean;
    suggestedMaxGas?: number;
    onFailure?: () => void;
    onInsufficientBalance?: (estimatedCost: string) => void;
    transactionType?: string;
};

/**
 * Custom hook for building and sending transactions.
 * @param clauseBuilder - A function that builds an array of enhanced clauses based on the provided parameters.
 * @param refetchQueryKeys - An optional array of query keys to refetch after the transaction is sent.
 * @param invalidateCache - A flag indicating whether to invalidate the cache and refetch queries after the transaction is sent.
 * @param onSuccess - An optional callback function to be called after the transaction is successfully sent.
 * @param onFailure - An optional callback function to be called after the transaction is failed or cancelled.
 * @param suggestedMaxGas - The suggested maximum gas for the transaction.
 * @returns An object containing the result of the `useSendTransaction` hook and a `sendTransaction` function.
 */
export const useBuildTransaction = <ClausesParams>({
    clauseBuilder,
    refetchQueryKeys,
    invalidateCache = true,
    onSuccess,
    onFailure,
    suggestedMaxGas,
    onInsufficientBalance,
    transactionType = 'Transaction',
}: BuildTransactionProps<ClausesParams>) => {
    const { account, connection } = useWallet();
    const queryClient = useQueryClient();
    const config = useVeChainKitConfig();
    const { selectOptimalGasToken, checkPreferredTokenAvailability } =
        useGasTokenSelection();

    /**
     * Callback function to be called when the transaction is successfully confirmed.
     * It cancels and refetches the specified queries if `invalidateCache` is `true`.
     */

    const handleOnSuccess = useCallback(async () => {
        if (invalidateCache) {
            refetchQueryKeys?.forEach(async (queryKey) => {
                await queryClient.cancelQueries({
                    queryKey,
                });
                await queryClient.refetchQueries({
                    queryKey,
                });
            });
        }

        onSuccess?.();
    }, []);

    const result = useSendTransaction({
        signerAccountAddress: account?.address,
        onTxConfirmed: handleOnSuccess,
        suggestedMaxGas,
        onTxFailedOrCancelled: onFailure,
    });

    // Note: useDelegatedTransaction can be used here when needed for specific gas token payments
    // const delegatedTxResult = useDelegatedTransaction({
    //     gasToken: selectedGasToken,
    //     useSmartAccount: !connection.isConnectedWithDappKit,
    //     onTxConfirmed: handleOnSuccess,
    //     onTxFailedOrCancelled: onFailure,
    // });

    /**
     * Function to send a transaction based on the provided parameters.
     * @param props - The parameters to be passed to the `clauseBuilder` function.
     */
    const sendTransaction = useCallback(
        async (props: ClausesParams) => {
            const clauses = clauseBuilder(props);

            // Detect connection method to determine payment flow
            const isDappKitUser = connection.isConnectedWithDappKit;

            if (isDappKitUser) {
                // ===== DAPPKIT USER FLOW =====
                // DappKit users rely on VeWorld's built-in fee delegation
                result.sendTransaction(clauses);
                return;
            } else {
                // ===== PRIVY USER FLOW =====
                // Priority 1: Traditional Fee Delegation (developer sponsors)
                // Priority 2: Generic Delegator (user pays with tokens)
                // Priority 3: Transaction fails (cannot fund Privy accounts)

                // Priority 1: Check Fee Delegation FIRST for Privy users (if configured)
                if (config?.feeDelegation?.delegatorUrl) {
                    try {
                        result.sendTransaction(clauses);
                        return;
                    } catch (error) {
                        console.info(
                            'Traditional fee delegation failed, trying alternatives:',
                            error,
                        );
                    }
                }

                // Priority 2: Try Generic Delegator (user pays with their tokens)
                try {
                    // Step 1: Create delegator service and estimate gas fees
                    const delegatorService = createGasEstimationService(
                        GENERIC_DELEGATOR_URL,
                        true, // TODO: Use mock for now until real URL is configured
                    );

                    // Estimate gas costs for the transaction
                    const gasEstimation = await delegatorService.estimateGas(
                        clauses,
                    );
                    console.info('Gas estimation received:', gasEstimation);

                    // Step 2: Check token availability based on estimated costs
                    const {
                        preferredAvailable,
                        preferredEstimate,
                        alternatives,
                    } = await checkPreferredTokenAvailability(clauses);

                    if (
                        !preferredAvailable &&
                        preferredEstimate &&
                        alternatives.length > 0
                    ) {
                        // If preferred token is insufficient but alternatives exist,
                        // the generic delegator will automatically use an alternative
                        console.info(
                            'Preferred token insufficient, will use alternative:',
                            alternatives[0]?.token,
                        );
                    }

                    const gasTokenSelection = await selectOptimalGasToken(
                        clauses,
                    );

                    if (gasTokenSelection) {
                        console.info(
                            'Gas token selected:',
                            gasTokenSelection.selectedToken,
                        );

                        // Step 3: deposit account (only if we have sufficient balance)
                        try {
                            const { depositAccount } =
                                await delegatorService.getDepositAccount();

                            // Step 2: append payment clause
                            const clausesWithPayment = appendPaymentClause(
                                clauses,
                                gasTokenSelection.selectedToken,
                                gasTokenSelection.cost,
                                depositAccount,
                            );

                            // Step 3: encode tx body with fee delegation
                            // TODO: Get actual chainTag and blockRef from network
                            const encodedTx = encodeTransactionBody(
                                clausesWithPayment,
                                account?.address || '',
                                39, // TODO: get from network config
                                '0x0000000000000000', // TODO: get latest blockRef from network
                                200000, // TODO: use actual estimated gas
                            );

                            // Step 4: get signature from delegator
                            const signedTx =
                                await delegatorService.signTransaction(
                                    gasTokenSelection.selectedToken,
                                    encodedTx,
                                );

                            console.info(
                                'Generic delegator signed transaction:',
                                signedTx,
                            );

                            // Step 5: submit the signed transaction
                            // TODO: submit the signed transaction
                            result.sendTransaction(clausesWithPayment); // temp: TODO: submit the signed transaction
                            return;
                        } catch (delegatorError) {
                            console.error(
                                'Generic delegator flow failed:',
                                delegatorError,
                            );
                            result.sendTransaction(clauses);
                            return;
                        }
                    }
                } catch (error) {
                    console.error(
                        'Gas token selection failed for Privy user:',
                        error,
                    );
                }

                // Priority 3: Transaction fails (Smart account users cannot fund accounts directly)
                onInsufficientBalance?.(
                    'Transaction cannot be completed. Smart accounts cannot be funded directly. Please contact the app developer to configure fee delegation.',
                );
            }
        },
        [
            clauseBuilder,
            result,
            selectOptimalGasToken,
            checkPreferredTokenAvailability,
            onInsufficientBalance,
            config?.feeDelegation?.delegatorUrl,
            connection.isConnectedWithDappKit,
            transactionType,
            onFailure,
        ],
    );

    return { ...result, sendTransaction };
};
