import type { TransactionClause } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

export const estimateTxGas = async (
    thor: ThorClient,
    clauses: TransactionClause[],
    caller: string,
) => {
    const response = await thor.transactions.estimateGas(clauses, caller);

    if (response.reverted) throw new Error('Failed to estimate gas');

    return response.totalGas;
};
