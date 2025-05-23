import { VoterRewards__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

const address = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa' as `0x${string}`;

const roundId = 1n;

const result = await callContractClause({
    address: getConfig('main').voterRewardsContractAddress,
    abi: VoterRewards__factory.abi,
    method: 'getReward',
    args: [roundId, address],
});

console.error('Voter Rewards getReward result:', result);
