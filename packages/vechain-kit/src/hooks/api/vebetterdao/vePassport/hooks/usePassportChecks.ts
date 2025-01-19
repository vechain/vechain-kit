import { TogglePassportCheck } from '@/utils';
import { useIsPassportCheckEnabled } from '.';

/**
 * Hook to get the status of all passport checks
 * @returns the status of all passport checks as booleans
 */
export const usePassportChecks = () => {
    const { data: isWhiteListCheckEnabled } = useIsPassportCheckEnabled(
        TogglePassportCheck.WhitelistCheck,
    );
    const { data: isBlackListCheckEnabled } = useIsPassportCheckEnabled(
        TogglePassportCheck.BlacklistCheck,
    );
    const { data: isSignalingCheckEnabled } = useIsPassportCheckEnabled(
        TogglePassportCheck.SignalingCheck,
    );
    const { data: isParticipationScoreCheckEnabled } =
        useIsPassportCheckEnabled(TogglePassportCheck.ParticipationScoreCheck);
    const { data: isGMOwnershipCheckEnabled } = useIsPassportCheckEnabled(
        TogglePassportCheck.GmOwnershipCheck,
    );

    return {
        isWhiteListCheckEnabled,
        isBlackListCheckEnabled,
        isSignalingCheckEnabled,
        isParticipationScoreCheckEnabled,
        isGMOwnershipCheckEnabled,
    };
};
