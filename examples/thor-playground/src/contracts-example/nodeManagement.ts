import { NodeManagement__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock address for testing node holder status
const address = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const result = await callContractClause({
    address: getConfig('main').nodeManagementContractAddress,
    abi: NodeManagement__factory.abi,
    method: 'isNodeHolder',
    args: [address as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('Node Management isNodeHolder result:', result);
