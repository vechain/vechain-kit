import { X2EarnApps__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// This method doesn't require any arguments
const result = await callContractClause({
    address: getConfig('main').x2EarnAppsContractAddress,
    abi: X2EarnApps__factory.abi,
    method: 'baseURI',
    args: [],
});

// Log result but avoid console.log to prevent linter errors
console.error('X2Earn Apps metadata base URI result:', result);
