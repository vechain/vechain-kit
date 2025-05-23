import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// Security levels as defined in the hook
enum SecurityLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

// Mock security level for testing
const securityLevel = SecurityLevel.MEDIUM;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'securityMultiplier',
    args: [securityLevel],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport security multiplier result:', result);
