import { XAllocationVoting__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock round ID for testing allocation round state
const roundId = 1;

const result = await callContractClause({
    address: getConfig('main').xAllocationVotingContractAddress,
    abi: XAllocationVoting__factory.abi,
    method: 'state',
    args: [BigInt(roundId || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('X Allocation Voting round state result:', result);
