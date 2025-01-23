import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { Emissions__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';

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
    thor: Connex.Thor,
    networkType: NETWORK_TYPE,
    roundId?: string,
): Promise<AllocationAmount> => {
    const emissionsContract = getConfig(networkType).emissionsContractAddress;

    const emissionsInterface = Emissions__factory.createInterface();
    const functionFragmentTreasuryAmount = emissionsInterface
        .getFunction('getTreasuryAmount')
        .format('json');
    const functionFragmentVoteX2EarnAmount = emissionsInterface
        .getFunction('getVote2EarnAmount')
        .format('json');
    const functionFragmentXAllocationsAmount = emissionsInterface
        .getFunction('getXAllocationAmount')
        .format('json');

    const [resTreasury, resVoteX2Earn, voteXAllocations] = await Promise.all([
        thor
            .account(emissionsContract)
            .method(JSON.parse(functionFragmentTreasuryAmount))
            .call(roundId),
        thor
            .account(emissionsContract)
            .method(JSON.parse(functionFragmentVoteX2EarnAmount))
            .call(roundId),
        thor
            .account(emissionsContract)
            .method(JSON.parse(functionFragmentXAllocationsAmount))
            .call(roundId),
    ]);

    if (resTreasury.vmError)
        return Promise.reject(new Error(resTreasury.vmError));
    if (resVoteX2Earn.vmError)
        return Promise.reject(new Error(resVoteX2Earn.vmError));
    if (voteXAllocations.vmError)
        return Promise.reject(new Error(voteXAllocations.vmError));

    return {
        treasury: formatEther(resTreasury.decoded[0]),
        voteX2Earn: formatEther(resVoteX2Earn.decoded[0]),
        voteXAllocations: formatEther(voteXAllocations.decoded[0]),
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAllocationAmountQueryKey(roundId),
        queryFn: async () =>
            await getAllocationAmount(thor, network.type, roundId),
        enabled: !!thor && !!roundId && !!network.type,
    });
};
