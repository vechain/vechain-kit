import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// This method doesn't require any arguments
const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'thresholdPoPScore',
    args: [],
});

// Log result but avoid console.log to prevent linter errors
console.error(
    'VeBetter Passport participation score threshold result:',
    result,
);
