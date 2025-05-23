import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock timepoint for testing threshold participation score at timepoint
const timepoint = 1000000;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'thresholdPoPScoreAtTimepoint',
    args: [timepoint],
});

// Log result but avoid console.log to prevent linter errors
console.error(
    'VeBetter Passport threshold participation score at timepoint result:',
    result,
);
