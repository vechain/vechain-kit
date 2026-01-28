import { useQuery } from '@tanstack/react-query';
import type { EstimationResponse } from '../../types/gasEstimation';
import type { EnhancedClause, GasTokenType } from '../../types';
import { useSmartAccount, useWallet, estimateGas, useTokenBalances, useGasTokenSelection } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TransactionClause } from '@vechain/sdk-core';

export interface useGenericDelegatorFeeEstimationParams {
    clauses: EnhancedClause[];
    enabled?: boolean;
    tokens: string[]; // Array of tokens to try in order
    sendingAmount?: string; // Amount being sent
    sendingTokenSymbol?: string; // Symbol of token being sent
}

export const useGenericDelegatorFeeEstimation = ({
    clauses,
    enabled = true,
    tokens,
    sendingAmount,
    sendingTokenSymbol,
}: useGenericDelegatorFeeEstimationParams) => {
    const { connectedWallet, account } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { feeDelegation } = useVeChainKitConfig();
    const { balances } = useTokenBalances(account?.address ?? '');
    const { updatePreferences } = useGasTokenSelection();
    // Only include essential data in query key to prevent unnecessary refetches
    const queryKey = ['gas-estimation', JSON.stringify(clauses), JSON.stringify(tokens), sendingAmount, sendingTokenSymbol];
    
    return useQuery<EstimationResponse & { usedToken: string }, Error>({
        queryKey,
        queryFn: async () => {
            let lastError: Error | null = null;
            // Try each token in sequence until one succeeds AND has sufficient balance
            for (const token of tokens) {
                try {
                    const estimation = await estimateGas(
                        smartAccount?.address ?? '',
                        feeDelegation?.genericDelegatorUrl ?? '',
                        clauses as TransactionClause[],
                        token as GasTokenType,
                        'medium',
                    );
                    // Check if user has enough balance for this token
                    const gasCost = estimation.transactionCost;
                    const tokenBalance = Number(balances.find(t => t.symbol === token)?.balance || 0);
                    // If sending the same token as gas token, need balance for both
                    // If no sendingAmount is provided, we're only checking for gas fees
                    const additionalAmount = (sendingAmount && sendingTokenSymbol && token === sendingTokenSymbol) 
                        ? Number(sendingAmount)
                        : 0;
                    const requiredBalance = gasCost + additionalAmount;
                    
                    if (tokenBalance >= requiredBalance) {
                        // Has enough balance, return this token
                        updatePreferences({ gasTokenToUse: token as GasTokenType });
                        return { ...estimation, usedToken: token };
                    }
                    // Not enough balance, try next token
                    lastError = new Error(`Insufficient ${token} balance: has ${tokenBalance}, needs ${requiredBalance}`);
                } catch (error) {
                    lastError = error as Error;
                }
            }
            throw lastError || new Error('All gas tokens failed estimation or have insufficient balance');
        },
        enabled: enabled && clauses.length > 0 && !!smartAccount?.address && !!feeDelegation?.genericDelegatorUrl && tokens.length > 0 && balances.length > 0,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: false,
        retryDelay: 1000,
    });
};
