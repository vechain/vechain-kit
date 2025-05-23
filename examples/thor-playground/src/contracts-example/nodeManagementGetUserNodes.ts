import { NodeManagement__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock user address for testing user nodes
const userAddress = '0x987b68E1B71D87B82ffce7539aE95b1B11aC7Eb0';

const result = await callContractClause({
    address: getConfig('main').nodeManagementContractAddress,
    abi: NodeManagement__factory.abi,
    method: 'getUserNodes',
    args: [userAddress as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('Node Management get user nodes result:', result);
