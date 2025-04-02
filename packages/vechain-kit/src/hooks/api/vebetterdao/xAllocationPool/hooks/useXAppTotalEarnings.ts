import { useQuery } from '@tanstack/react-query';
import { getXAppRoundEarningsQueryKey } from './useXAppRoundEarnings';
import { getConfig } from '@/config';
import { getOrCreateQueryClient } from '@/providers/EnsureQueryClient';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';
import { useThor } from '@vechain/dapp-kit-react';
import { XAllocationPool__factory } from '@/contracts';
import { type ContractClause } from '@vechain/sdk-network';

/**
 * Get the clauses for the total earnings of an xApp in multiple rounds
 * @param roundIds ids of the rounds
 * @param app id of the xApp
 * @param networkType network type
 * @returns the clauses for the total earnings of an xApp in multiple rounds
 */
export const getXAppTotalEarningsClauses = (
    roundIds: number[],
    app: string,
    networkType: NETWORK_TYPE,
): ContractClause[] => {
    const thor = useThor();
    const contract = thor.contracts.load(
        getConfig(networkType).xAllocationPoolContractAddress,
        XAllocationPool__factory.abi,
    );
    const clauses: ContractClause[] = roundIds.map((roundId) =>
        contract.clause.roundEarnings(roundId, app),
    );

    return clauses;
};

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
            const clauses = getXAppTotalEarningsClauses(
                roundIds,
                appId,
                network.type,
            );
            const res = await thor.contracts.executeMultipleClausesCall(
                clauses,
            );

            const decoded = res.map((r, index) => {
                if (!r.result) throw new Error(`Clause ${index + 1} reverted`);
                const parsedAmount = formatEther(
                    BigInt(r.result.array?.[0]?.toString() || '0'),
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
