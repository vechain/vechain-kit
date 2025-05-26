import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock token ID for testing B3TR donated
const tokenId = 2;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'getB3TRdonated',
    args: [BigInt(tokenId || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member B3TR donated result:', result);
