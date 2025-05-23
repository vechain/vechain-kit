import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig, weAreTestersAddress } from '../config';

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'balanceOf',
    args: [weAreTestersAddress],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member GM balance result:', result);
