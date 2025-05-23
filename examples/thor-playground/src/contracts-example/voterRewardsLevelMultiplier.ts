import { VoterRewards__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock level for testing
const level = 5n;

const result = await callContractClause({
    address: getConfig('main').voterRewardsContractAddress,
    abi: VoterRewards__factory.abi,
    method: 'levelToMultiplier',
    args: [level],
});

// Log result but avoid console.log to prevent linter errors
console.error('Voter Rewards level multiplier result:', result);
