import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { XAllocationPool__factory } from '@/contracts';
import { getConfig } from '@/config';
import { abi } from 'thor-devkit';
import { getCallKey } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

const allocationPoolInterface = XAllocationPool__factory.createInterface();

const method = 'getAppShares';
const functionFragment = allocationPoolInterface
    .getFunction(method)
    .format('json');
const functionAbi = new abi.Function(JSON.parse(functionFragment));

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
): Connex.VM.Clause[] => {
    const allocationPoolContract =
        getConfig(networkType).xAllocationPoolContractAddress;
    const clauses: Connex.VM.Clause[] = apps.map((app) => ({
        to: allocationPoolContract,
        value: 0,
        data: functionAbi.encode(roundId, app),
    }));
    return clauses;
};

/**
 *  Returns the query key for the shares of multiple xApps in an allocation round.
 * @param roundId  the roundId the get the shares for
 */
export const getXAppsSharesQueryKey = (roundId?: number | string) =>
    getCallKey({ method, keyArgs: [roundId, 'ALL'] });

/**
 * Fetch shares of multiple xApps in an allocation round
 * @param apps  the xApps to get the shares for
 * @param roundId  the round id to get the shares for
 * @returns  the shares (% of allocation pool) for the xApps in the round { allocated: number, unallocated: number }
 *
 */
export const useXAppsShares = (apps: string[], roundId?: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppsSharesQueryKey(roundId),
        queryFn: async () => {
            const clauses = getAppsShareClauses(network.type, apps, roundId);
            const res = await thor.explain(clauses).execute();

            const votes = res.map((r, index) => {
                if (r.reverted)
                    throw new Error(
                        `Clause ${index + 1} reverted with reason ${
                            r.revertReason
                        }`,
                    );
                const decoded = functionAbi.decode(r.data);

                return {
                    app: apps[index] as string,
                    share: Number(decoded[0]) / 100,
                    unallocatedShare: Number(decoded[1]) / 100,
                };
            });
            return votes;
        },
        enabled: !!roundId && !!apps.length,
    });
};
