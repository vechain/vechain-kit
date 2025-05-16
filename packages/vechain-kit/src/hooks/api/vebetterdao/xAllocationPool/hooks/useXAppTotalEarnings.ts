import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';
import { getXAppRoundEarningsQueryKey } from '@/hooks';
import { getConfig } from '@/config';
import { XAllocationPool__factory } from '@/contracts';
import { getOrCreateQueryClient } from '@/providers/EnsureQueryClient';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';

export const getXAppTotalEarningsQueryKey = (
    tillRoundId: string | number,
    appId: string,
) => [
    'VECHAIN_KIT',
    'XAllocationPool',
    'xApp',
    appId,
    'totalEarningsTillRound',
    tillRoundId,
];
/**
 * Total earnings of an xApp in multiple rounds
 * @param roundIds ids of the rounds
 * @param appId id of the xApp
 * @returns the total earnings of the xApp until the last round
 */
export const useXAppTotalEarnings = (roundIds: number[], appId: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const queryClient = getOrCreateQueryClient();
    const lastRound = roundIds[roundIds.length - 1] ?? 0;
    return useQuery({
        queryKey: getXAppTotalEarningsQueryKey(lastRound, appId),
        queryFn: async () => {
            const contract = thor.contracts.load(
                getConfig(network.type).xAllocationPoolContractAddress,
                XAllocationPool__factory.abi,
            );
            const clauses = roundIds.map((roundId) =>
                contract.clause.roundEarnings(roundId, appId),
            );
            const res = await thor.transactions.executeMultipleClausesCall(
                clauses,
            );
            if (!res.every((r) => r.success))
                throw new Error(
                    `Failed to fetch xApp total earnings of ${appId}`,
                );

            const decoded = res.map((r, index) => {
                const parsedAmount = formatEther(
                    (r.result.array?.[0] as bigint) || BigInt(0),
                );
                // Update the cache with the new amount
                queryClient.setQueryData(
                    getXAppRoundEarningsQueryKey(
                        roundIds[index] as number,
                        appId,
                    ),
                    {
                        amount: parsedAmount,
                        appId,
                    },
                );
                return parsedAmount;
            });

            return decoded.reduce((acc, amount) => {
                return acc + Number(amount);
            }, 0);
        },
    });
};
