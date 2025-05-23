import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

const tokenId = 1;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'getB3TRtoUpgrade',
    args: [BigInt(tokenId)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member B3TR to upgrade result:', result);
