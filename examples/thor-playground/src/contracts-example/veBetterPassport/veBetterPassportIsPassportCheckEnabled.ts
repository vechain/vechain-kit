import { VeBetterPassport__factory } from '@vechain/vechain-kit/contracts';

import { callContractClause } from '../../utils/callContractClause';
import { getConfig } from '../../config';

// TogglePassportCheck enum values
enum TogglePassportCheck {
    WhitelistCheck = 1,
    BlacklistCheck = 2,
    SignalingCheck = 3,
    ParticipationScoreCheck = 4,
    GmOwnershipCheck = 5,
}

// Mock check name for testing passport check enabled
const checkName = TogglePassportCheck.WhitelistCheck;

const result = await callContractClause({
    address: getConfig('main').veBetterPassportContractAddress,
    abi: VeBetterPassport__factory.abi,
    method: 'isCheckEnabled',
    args: [checkName],
});

// Log result but avoid console.log to prevent linter errors
console.error('VeBetter Passport is passport check enabled result:', result);
