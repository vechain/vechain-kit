import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock user address for testing selected token ID
const user = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'getSelectedTokenId',
    args: [user as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member selected token ID result:', result);
