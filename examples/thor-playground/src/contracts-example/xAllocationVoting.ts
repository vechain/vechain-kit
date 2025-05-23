import { XAllocationVoting__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// This method doesn't require any arguments
const result = await callContractClause({
    address: getConfig('main').xAllocationVotingContractAddress,
    abi: XAllocationVoting__factory.abi,
    method: 'currentRoundId',
    args: [],
});

// Log result but avoid console.log to prevent linter errors
console.error('X Allocation Voting current round ID result:', result);
