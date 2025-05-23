import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

const appId =
    '0xfa4b77192f38b7f1284a995d0d2f9514ce8ec8ba9a39e5a24b5d0668b33b7b9c';

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'appSecurity',
    args: [appId as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport app security level result:', result);
