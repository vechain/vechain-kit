import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock delegator address for testing get pending delegations delegator POV
const delegator = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'getPendingDelegations',
    args: [delegator as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error(
    'VeBetter Passport get pending delegations delegator POV result:',
    result,
);
