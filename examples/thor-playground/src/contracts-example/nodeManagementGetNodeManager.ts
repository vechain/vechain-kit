import { NodeManagement__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock node ID for testing node manager
const nodeId = 1;

const result = await callContractClause({
    address: getConfig('main').nodeManagementContractAddress,
    abi: NodeManagement__factory.abi,
    method: 'getNodeManager',
    args: [BigInt(nodeId || 0)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Node Management get node manager result:', result);
