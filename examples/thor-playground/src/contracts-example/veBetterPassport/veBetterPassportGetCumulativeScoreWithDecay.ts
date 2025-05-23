import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock data for testing cumulative score with decay
const user = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const lastRound = 1;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'getCumulativeScoreWithDecay',
    args: [user as `0x${string}`, BigInt(lastRound)],
});

// Log result but avoid console.log to prevent linter errors
console.error(
    'VeBetter Passport get cumulative score with decay result:',
    result,
);
