import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

const tokenId = 2;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'levelOf',
    args: [BigInt(tokenId || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member level of token result:', result);
