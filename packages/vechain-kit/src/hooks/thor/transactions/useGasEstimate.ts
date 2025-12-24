import type { Revision, TransactionClause } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

export const useGasEstimate = async (
    thor: ThorClient,
    clauses: TransactionClause[],
    caller: string,
    options?: {
        revision?: Revision;
        gasPadding?: number;
    },
) => {
    const response = await thor.transactions.estimateGas(
        clauses,
        caller,
        options,
    );

    if (response.reverted) throw new Error('Failed to estimate gas');

    let totalGas = response?.totalGas ?? 0;
    // Ensure it covers the case where the gas estimation is not a number
    if (!totalGas || Number.isNaN(totalGas)) {
        totalGas = 0;
    }

    return Math.ceil(totalGas);
};
