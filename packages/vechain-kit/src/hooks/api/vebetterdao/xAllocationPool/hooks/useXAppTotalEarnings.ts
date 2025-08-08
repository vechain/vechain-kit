import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getXAppRoundEarningsQueryKey } from './useXAppRoundEarnings';
import { getConfig } from '@/config';
import { XAllocationPool__factory } from '@vechain/vechain-contract-types';
import { abi } from 'thor-devkit';
import { getOrCreateQueryClient } from '@/providers/EnsureQueryClient';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';

const roundEarningsFragment = XAllocationPool__factory.createInterface()
    .getFunction('roundEarnings')
    .format('json');
const roundEarningsAbi = new abi.Function(JSON.parse(roundEarningsFragment));

export const getXAppTotalEarningsClauses = (
    roundIds: number[],
    app: string,
    networkType: NETWORK_TYPE,
): Connex.VM.Clause[] => {
    const clauses: Connex.VM.Clause[] = roundIds.map((roundId) => ({
        to: getConfig(networkType).xAllocationPoolContractAddress,
        value: 0,
        data: roundEarningsAbi.encode(roundId, app),
    }));

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
    const { thor } = useConnex();
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
            const res = await thor.explain(clauses).execute();

            const decoded = res.map((r, index) => {
                if (r.reverted)
                    throw new Error(
                        `Clause ${index + 1} reverted with reason ${
                            r.revertReason
                        }`,
                    );
                const decoded = roundEarningsAbi.decode(r.data);
                const parsedAmount = formatEther(decoded[0]);
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
