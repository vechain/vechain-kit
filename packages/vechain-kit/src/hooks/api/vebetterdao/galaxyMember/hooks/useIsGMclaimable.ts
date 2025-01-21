import { useParticipatedInGovernance } from './useParticipatedInGovernance';
import { useGMbalance } from './useGMbalance';

/**
 * Returns whether the user can claim a GM NFT
 *
 * @param address - The address of the account.
 * @returns Whether the user can claim a GM NFT
 */

export const useIsGMclaimable = (address?: string) => {
    const { data: hasVoted } = useParticipatedInGovernance(address ?? '');

    const { data: nftBalance } = useGMbalance(address ?? '');

    if (Number(nftBalance) > 0) return { isClaimable: false, isOwned: true };

    if (hasVoted === true) return { isClaimable: true, isOwned: false };

    return { isClaimable: false, isOwned: false };
};
