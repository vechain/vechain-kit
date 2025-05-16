import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { XAllocationPool__factory } from '@/contracts';
import { getOrCreateQueryClient } from '@/providers/EnsureQueryClient';
import {
    getRoundXApps,
    getRoundXAppsQueryKey,
} from '@/hooks/api/vebetterdao/xApps/hooks/useRoundXApps';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';
import { ThorClient } from '@vechain/sdk-network';

type UseXAppRoundEarningsQueryResponse = {
    amount: string;
    appId: string;
};

/**
 *  Get the amount of $B3TR an xApp earned from an allocation round
 *
 * @param thor  the thor instance
 * @param roundId  the round id
 * @param xAppId  the xApp id
 * @param networkType  the network type
 * @returns (amount, appId) amount of $B3TR an xApp earned from an allocation round and the xApp id
 */
export const getXAppRoundEarnings = async (
    thor: ThorClient,
    roundId: string,
    xAppId: string,
    networkType: NETWORK_TYPE,
): Promise<UseXAppRoundEarningsQueryResponse> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).xAllocationPoolContractAddress,
            XAllocationPool__factory.abi,
        )
        .read.roundEarnings(roundId, xAppId);

    if (!res)
        throw new Error(
            `Failed to fetch xApp round earnings for ${xAppId} in round ${roundId}`,
        );

    return { amount: formatEther(BigInt(res[0])), appId: xAppId };
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
    const thor = useThor();
    const queryClient = getOrCreateQueryClient();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppRoundEarningsQueryKey(roundId, xAppId),
        queryFn: async () => {
            const data = await queryClient.ensureQueryData({
                queryFn: () =>
                    getRoundXApps(
                        thor as unknown as ThorClient,
                        network.type,
                        roundId,
                    ),
                queryKey: getRoundXAppsQueryKey(roundId),
            });

            const isXAppInRound = data.some((app) => app.id === xAppId);

            if (!isXAppInRound) return { amount: '0', xAppId };

            return await getXAppRoundEarnings(
                thor as unknown as ThorClient,
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
    const thor = useThor();
    const queryClient = getOrCreateQueryClient();

    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getXAppRoundEarningsQueryKey(roundId, 'ALL'),
        queryFn: async () => {
            const data = await queryClient.ensureQueryData({
                queryFn: () =>
                    getRoundXApps(
                        thor as unknown as ThorClient,
                        network.type,
                        roundId,
                    ),
                queryKey: getRoundXAppsQueryKey(roundId),
            });

            const xAllocationPoolContract = getConfig(
                network.type,
            ).xAllocationPoolContractAddress;
            const xAppsInRound = data.filter((app) => xAppIds.includes(app.id));

            const contract = thor.contracts.load(
                xAllocationPoolContract,
                XAllocationPool__factory.abi,
            );
            const clauses = xAppsInRound.map((app) =>
                contract.clause.roundEarnings(roundId, app.id),
            );

            const res = await thor.transactions.executeMultipleClausesCall(
                clauses,
            );

            if (!res.every((r) => r.success))
                throw new Error('Failed to fetch xApp round earnings');

            const decoded = res.map((earnings, index) => {
                const parsedAmount = formatEther(
                    earnings.result.plain as bigint,
                );
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
