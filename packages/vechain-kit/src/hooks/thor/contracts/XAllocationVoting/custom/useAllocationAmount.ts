import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { Emissions__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useThor } from '@vechain/dapp-kit-react';
import { executeMultipleClausesCall } from '@/utils';

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
        queryFn: async () => {
            if (!roundId) throw new Error('Round ID is required');

            const [treasury, voteX2Earn, voteXAllocations] =
                await executeMultipleClausesCall({
                    thor,
                    calls: [
                        {
                            abi: Emissions__factory.abi,
                            address: getConfig(network.type)
                                .emissionsContractAddress,
                            functionName: 'getTreasuryAmount',
                            args: [BigInt(roundId)],
                        },
                        {
                            abi: Emissions__factory.abi,
                            address: getConfig(network.type)
                                .emissionsContractAddress,
                            functionName: 'getVote2EarnAmount',
                            args: [BigInt(roundId)],
                        },
                        {
                            abi: Emissions__factory.abi,
                            address: getConfig(network.type)
                                .emissionsContractAddress,
                            functionName: 'getXAllocationAmount',
                            args: [BigInt(roundId)],
                        },
                    ],
                });

            return {
                treasury: formatEther(treasury),
                voteX2Earn: formatEther(voteX2Earn),
                voteXAllocations: formatEther(voteXAllocations),
            };
        },
        enabled: !!thor && !!roundId && !!network.type,
    });
};
