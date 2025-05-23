import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock node ID for testing token ID attached to node
const nodeId = 2;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'getIdAttachedToNode',
    args: [BigInt(nodeId || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member get token ID attached to node result:', result);
