import {
    useParticipatedInGovernance,
    useGMbalance,
} from '@/hooks/thor/contracts/GalaxyMember';

/**
 * Returns whether the user can claim a GM NFT
 *
 * @param address - The address of the account.
 * @returns Whether the user can claim a GM NFT
 */

export const useIsGMClaimable = (address?: string) => {
    const { data: hasVoted } = useParticipatedInGovernance(
        address as `0x${string}` | null,
    );

    const { data: nftBalance } = useGMbalance(address as `0x${string}` | null);

    if (Number(nftBalance) > 0) return { isClaimable: false, isOwned: true };

    if (hasVoted === true) return { isClaimable: true, isOwned: false };

    return { isClaimable: false, isOwned: false };
};
