import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../utils/callContractClause';
import { getConfig } from '../config';

// Mock data for testing user round score
const user = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const roundId = 1n;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'userRoundScore',
    args: [user as `0x${string}`, roundId],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport user round score result:', result);
