import { XAllocationVotingGovernor__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock data for testing X app votes
const roundId = 1;
const appId =
    '0xfa4b77192f38b7f1284a995d0d2f9514ce8ec8ba9a39e5a24b5d0668b33b7b9c';

const result = await callContractClause({
    address: getConfig('main').xAllocationVotingContractAddress,
    abi: XAllocationVotingGovernor__factory.abi,
    method: 'getAppVotes',
    args: [BigInt(roundId || 0), appId as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('X Allocation Voting Governor app votes result:', result);
