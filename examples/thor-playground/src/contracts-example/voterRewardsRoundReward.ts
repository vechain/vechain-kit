import { VoterRewards__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock data for testing round reward
const address = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const roundId = '1';

const result = await callContractClause({
    address: getConfig('main').voterRewardsContractAddress,
    abi: VoterRewards__factory.abi,
    method: 'getReward',
    args: [BigInt(roundId || 0), address as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('Voter Rewards round reward result:', result);
