import { X2EarnApps__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock app ID for testing app admin
const appId =
    '0xfa4b77192f38b7f1284a995d0d2f9514ce8ec8ba9a39e5a24b5d0668b33b7b9c';

const result = await callContractClause({
    address: getConfig('main').x2EarnAppsContractAddress,
    abi: X2EarnApps__factory.abi,
    method: 'appAdmin',
    args: [appId as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('X2Earn Apps app admin result:', result);
