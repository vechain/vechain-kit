import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { XAllocationPool__factory } from '@/contracts';
import { getConfig } from '@/config';
import { getCallKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ContractClause } from '@vechain/sdk-network';

/**
 *  Get the clauses to get the votes for the xApps in an allocation round
 *
 * @param networkType  the network type to get the clauses for
 * @param apps  the xApps to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns  the clauses to get the votes for the xApps in the round
 */
export const getAppsShareClauses = (
    networkType: NETWORK_TYPE,
    apps: string[],
    roundId?: string,
): ContractClause[] => {
    const allocationPoolContract =
        getConfig(networkType).xAllocationPoolContractAddress;
    const thor = useThor();
    const contract = thor.contracts.load(
        allocationPoolContract,
        XAllocationPool__factory.abi,
    );
    const clauses: ContractClause[] = apps.map((app) =>
        contract.clause.getAppShares(app, roundId),
    );
    return clauses;
};

/**
 *  Returns the query key for the shares of multiple xApps in an allocation round.
 * @param roundId  the roundId the get the shares for
 */
export const getXAppsSharesQueryKey = (roundId?: number | string) =>
    getCallKey({ method: 'getAppShares', keyArgs: [roundId, 'ALL'] });

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
            const clauses = getAppsShareClauses(network.type, apps, roundId);
            const res = await thor.contracts.executeMultipleClausesCall(
                clauses,
            );

            const votes = res.map((r, index) => {
                if (!r) throw new Error(`Clause ${index + 1} reverted`);
                const decoded = r.result.array;

                return {
                    app: apps[index] as string,
                    share: Number(decoded?.[0]) / 100,
                    unallocatedShare: Number(decoded?.[1]) / 100,
                };
            });
            return votes;
        },
        enabled: !!roundId && !!apps.length,
    });
};
