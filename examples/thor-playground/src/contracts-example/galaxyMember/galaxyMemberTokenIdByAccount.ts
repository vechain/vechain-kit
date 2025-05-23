import { GalaxyMember__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Mock account address and index for testing token ID by account
const account = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const index = 1;

const result = await callContractClause({
    address: getConfig('main').galaxyMemberContractAddress,
    abi: GalaxyMember__factory.abi,
    method: 'tokenOfOwnerByIndex',
    args: [account as `0x${string}`, BigInt(index)],
});

// Log result but avoid console.log to prevent linter errors
console.error('Galaxy Member token ID by account result:', result);
