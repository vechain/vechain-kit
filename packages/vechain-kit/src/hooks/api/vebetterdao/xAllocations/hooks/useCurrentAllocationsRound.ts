import { useCurrentAllocationsRoundId } from './useCurrentAllocationsRoundId';
import { useAllocationsRound } from './useAllocationsRound';

/**
 * Hook to get info about the current allocation round
 * @returns the current allocation round info see {@link AllocationRoundWithState}
 */
export const useCurrentAllocationsRound = () => {
    const currentRoundId = useCurrentAllocationsRoundId();
    const allocationsRound = useAllocationsRound(currentRoundId.data);

    return {
        ...allocationsRound,
        isLoading: currentRoundId.isLoading || allocationsRound.isLoading,
        isError: currentRoundId.isError || allocationsRound.isError,
        error: currentRoundId.error || allocationsRound.error,
    };
};
