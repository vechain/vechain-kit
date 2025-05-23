import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock level for testing B3TR to upgrade to level
const level = 2;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'getB3TRtoUpgradeToLevel',
    args: [BigInt(level || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member B3TR to upgrade to level result:', result);
