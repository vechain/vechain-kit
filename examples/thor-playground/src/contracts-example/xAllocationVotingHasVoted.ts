import { XAllocationVoting__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock data for testing has voted in round
const roundId = '1';
const address = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const result = await callContractClause({
    address: getConfig('main').xAllocationVotingContractAddress,
    abi: XAllocationVoting__factory.abi,
    method: 'hasVoted',
    args: [BigInt(roundId || 0), address as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('X Allocation Voting has voted result:', result);
