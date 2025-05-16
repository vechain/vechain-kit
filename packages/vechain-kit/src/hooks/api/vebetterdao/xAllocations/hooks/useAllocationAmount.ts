import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { Emissions__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { useThor } from '@vechain/dapp-kit-react2';

type AllocationAmount = {
    treasury: string;
    voteX2Earn: string;
    voteXAllocations: string;
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
        queryFn: async () => {
            const contract = thor.contracts.load(
                getConfig(network.type).emissionsContractAddress,
                Emissions__factory.abi,
            );
            const clauses = [
                contract.clause.getTreasuryAmount(roundId),
                contract.clause.getVote2EarnAmount(roundId),
                contract.clause.getXAllocationAmount(roundId),
            ];

            const res = await thor.transactions.executeMultipleClausesCall(
                clauses,
            );
            if (!res.every((r) => r.success))
                throw new Error(
                    `Failed to fetch allocation amount of round ${roundId}`,
                );

            return {
                treasury: formatEther(res[0].result.array?.[0] as bigint),
                voteX2Earn: formatEther(res[1].result.array?.[0] as bigint),
                voteXAllocations: formatEther(
                    res[2].result.array?.[0] as bigint,
                ),
            } as AllocationAmount;
        },
        enabled: !!thor && !!roundId && !!network.type,
    });
};
