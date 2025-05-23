import { X2EarnApps__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock node ID for testing X-Node cooldown check
const nodeId = 2330;

const result = await callContractClause({
    address: getConfig('main').x2EarnAppsContractAddress,
    abi: X2EarnApps__factory.abi,
    method: 'checkCooldown',
    args: [BigInt(nodeId)],
});

// Log result but avoid console.log to prevent linter errors
console.error('X2Earn Apps X-Node check cooldown result:', result);
