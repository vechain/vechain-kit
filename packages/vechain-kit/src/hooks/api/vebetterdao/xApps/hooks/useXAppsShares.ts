import { useQuery } from '@tanstack/react-query';
import { XAllocationPool__factory } from '@/contracts';
import { getConfig } from '@/config';
import { useVeChainKitConfig } from '@/providers';
import { useThor } from '@vechain/dapp-kit-react';

/**
 *  Returns the query key for the shares of multiple xApps in an allocation round.
 * @param roundId  the roundId the get the shares for
 */
export const getXAppsSharesQueryKey = (roundId?: number | string) => [
    'VECHAIN_KIT',
    'XApps',
    'Shares',
    roundId,
];

/**
 * Fetch shares of multiple xApps in an allocation round
 * @param apps  the xApps to get the shares for
 * @param roundId  the round id to get the shares for
 * @returns  the shares (% of allocation pool) for the xApps in the round { allocated: number, unallocated: number }
 *
 */
export const useXAppsShares = (apps: string[], roundId?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppsSharesQueryKey(roundId),
        queryFn: async () => {
            const contract = thor.contracts.load(
                getConfig(network.type).xAllocationPoolContractAddress,
                XAllocationPool__factory.abi,
            );
            const clauses = apps.map((app) =>
                contract.clause.getAppShares(roundId, app),
            );
            const res = await thor.transactions.executeMultipleClausesCall(
                clauses,
            );
            if (!res.every((r) => r.success))
                throw new Error(
                    `Failed to fetch xApps shares for ${apps} in round ${roundId}`,
                );

            const shares = res.map((r, index) => {
                return {
                    app: apps[index] as string,
                    share: Number(r.result.array?.[0]) / 100,
                    unallocatedShare: Number(r.result.array?.[1]) / 100,
                };
            });
            return shares;
        },
        enabled: !!roundId && !!apps.length,
    });
};
