import type { TransactionClause } from '@vechain/sdk-core';
import type { ThorClient } from '@vechain/sdk-network';

// "best": Refers to the latest (most recent) block on the chain.

// "next": Refers to the next block after the current best block.

// "justified": Represents a checkpoint block that has received a 2/3 supermajority of votes but is not yet finalized.

// "finalized": Refers to the most recent block that has been finalized by the network consensus.
// Once a block is finalized, it is considered immutable and cannot be reverted or changed.

type Revision = 'best' | 'next' | 'justified' | 'finalized';

export const estimateTxGas = async (
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
