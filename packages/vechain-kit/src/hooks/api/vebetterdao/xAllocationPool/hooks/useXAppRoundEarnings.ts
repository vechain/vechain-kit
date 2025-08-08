import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationPool__factory } from '@vechain/vechain-contract-types';
import { getOrCreateQueryClient } from '@/providers/EnsureQueryClient';
import {
    getRoundXApps,
    getRoundXAppsQueryKey,
} from '@/hooks/api/vebetterdao/xApps/hooks/useRoundXApps';
import { abi } from 'thor-devkit';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';

const roundEarningsFragment = XAllocationPool__factory.createInterface()
    .getFunction('roundEarnings')
    .format('json');
const roundEarningsAbi = new abi.Function(JSON.parse(roundEarningsFragment));

type UseXAppRoundEarningsQueryResponse = {
    amount: string;
    appId: string;
};

/**
 *  Get the amount of $B3TR an xApp earned from an allocation round
 *
 * @param thor  the connex instance
 * @param roundId  the round id
 * @param xAppId  the xApp id
 * @param networkType  the network type
 * @returns (amount, appId) amount of $B3TR an xApp earned from an allocation round and the xApp id
 */
export const getXAppRoundEarnings = async (
    thor: Connex.Thor,
    roundId: string,
    xAppId: string,
    networkType: NETWORK_TYPE,
): Promise<UseXAppRoundEarningsQueryResponse> => {
    const xAllocationPoolContract =
        getConfig(networkType).xAllocationPoolContractAddress;

    const functionFragment = XAllocationPool__factory.createInterface()
        .getFunction('roundEarnings')
        .format('json');
    const res = await thor
        .account(xAllocationPoolContract)
        .method(JSON.parse(functionFragment))
        .call(roundId, xAppId);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return { amount: formatEther(res.decoded['0']), appId: xAppId };
};

export const getXAppRoundEarningsQueryKey = (
    roundId: string | number,
    xAppId?: string,
) => [
    'VECHAIN_KIT',
    'roundEarnings',
    'roundId',
    Number(roundId),
    'appId',
    ...(xAppId ? [xAppId] : []),
];

/**
 * Get the amount of $B3TR an xApp can claim from an allocation round
 *
 * @param roundId the round id
 * @param xAppId the xApp id
 * @returns amount of $B3TR an xApp can claim from an allocation round
 */
export const useXAppRoundEarnings = (roundId: string, xAppId: string) => {
    const { thor } = useConnex();
    const queryClient = getOrCreateQueryClient();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppRoundEarningsQueryKey(roundId, xAppId),
        queryFn: async () => {
            const data = await queryClient.ensureQueryData({
                queryFn: () => getRoundXApps(thor, network.type, roundId),
                queryKey: getRoundXAppsQueryKey(roundId),
            });

            const isXAppInRound = data.some((app) => app.id === xAppId);

            if (!isXAppInRound) return { amount: '0', xAppId };

            return await getXAppRoundEarnings(
                thor,
                roundId,
                xAppId,
                network.type,
            );
        },
        enabled: !!thor && !!roundId && !!xAppId,
    });
};

/**
 *  Get the amount of $B3TR every xApp earned from an allocation round
 * @param roundId  the round id
 * @param xAppIds  the xApp ids
 * @returns  the amount of $B3TR every xApp earned from an allocation round
 */
export const useMultipleXAppRoundEarnings = (
    roundId: string,
    xAppIds: string[],
) => {
    const { thor } = useConnex();
    const queryClient = getOrCreateQueryClient();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppRoundEarningsQueryKey(roundId, 'ALL'),
        queryFn: async () => {
            const data = await queryClient.ensureQueryData({
                queryFn: () => getRoundXApps(thor, network.type, roundId),
                queryKey: getRoundXAppsQueryKey(roundId),
            });

            const xAllocationPoolContract = getConfig(
                network.type,
            ).xAllocationPoolContractAddress;
            const xAppsInRound = data.filter((app) => xAppIds.includes(app.id));

            const clauses = xAppsInRound.map((app) => ({
                to: xAllocationPoolContract,
                value: 0,
                data: roundEarningsAbi.encode(roundId, app.id),
            }));
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
                const appId = xAppsInRound[index]?.id as string;
                // Update the cache with the new amount
                queryClient.setQueryData(
                    getXAppRoundEarningsQueryKey(roundId, appId),
                    {
                        amount: parsedAmount,
                        appId,
                    },
                );
                return { amount: parsedAmount, appId };
            });

            return decoded;
        },
        enabled: !!thor && !!roundId && !!xAppIds.length,
    });
};
