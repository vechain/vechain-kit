import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { Emissions__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'ethers';
import { type ThorClient } from '@vechain/sdk-network';

type AllocationAmount = {
    treasury: string;
    voteX2Earn: string;
    voteXAllocations: string;
};

/**
 *
 * Returns the allocation amount for a given roundId
 * @param thor  the thor client
 * @param roundId  the roundId the get the amount for
 * @param networkType  the network type
 * @returns the allocation amount for a given roundId see {@link AllocationAmount}
 */
export const getAllocationAmount = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<AllocationAmount> => {
    const emissionsContract = getConfig(networkType).emissionsContractAddress;

    const [resTreasury, resVoteX2Earn, voteXAllocations] = await Promise.all([
        thor.contracts
            .load(emissionsContract, Emissions__factory.abi)
            .read.getTreasuryAmount(roundId),
        thor.contracts
            .load(emissionsContract, Emissions__factory.abi)
            .read.getVote2EarnAmount(roundId),
        thor.contracts
            .load(emissionsContract, Emissions__factory.abi)
            .read.getXAllocationAmount(roundId),
    ]);

    if (!resTreasury) return Promise.reject(new Error('Reverted'));
    if (!resVoteX2Earn) return Promise.reject(new Error('Reverted'));
    if (!voteXAllocations) return Promise.reject(new Error('Reverted'));

    return {
        treasury: formatEther(resTreasury[0].toString()),
        voteX2Earn: formatEther(resVoteX2Earn[0].toString()),
        voteXAllocations: formatEther(voteXAllocations[0].toString()),
    };
};

export const getAllocationAmountQueryKey = (roundId?: string) => [
    'VECHAIN_KIT',
    'allocationsRound',
    'amount',
    roundId,
];

/**
 *  Hook to get the allocation amount for a given roundId
 * @param roundId  the roundId the get the amount for
 * @returns the allocation amount for a given roundId see {@link AllocationAmount}
 */
export const useAllocationAmount = (roundId?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationAmountQueryKey(roundId),
        queryFn: async () =>
            await getAllocationAmount(thor, network.type, roundId),
        enabled: !!thor && !!roundId && !!network.type,
    });
};
