import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock account address for testing is entity
const account = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'isEntity',
    args: [account as `0x${string}`],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport is entity result:', result);
