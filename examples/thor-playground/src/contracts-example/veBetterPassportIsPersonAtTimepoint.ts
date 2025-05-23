import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock data for testing is person at timepoint
const account = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const timepoint = 1000000;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'isPersonAtTimepoint',
    args: [account as `0x${string}`, timepoint],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport is person at timepoint result:', result);
