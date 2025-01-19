import { useWallet } from '@/hooks';
import { useParticipatedInGovernance } from './useParticipatedInGovernance';
import { useGMbalance } from './useGMbalance';

/**
 * Returns whether the user can claim a GM NFT
 * @returns Whether the user can claim a GM NFT
 */

export const useIsGMclaimable = () => {
    const { account } = useWallet();
    const { data: hasVoted } = useParticipatedInGovernance(account.address);

    const { data: nftBalance } = useGMbalance(account.address);

    if (Number(nftBalance) > 0) return { isClaimable: false, isOwned: true };

    if (hasVoted === true) return { isClaimable: true, isOwned: false };

    return { isClaimable: false, isOwned: false };
};
