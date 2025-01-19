import { useQueries } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import {
    getXAppRoundEarnings,
    getXAppRoundEarningsQueryKey,
} from './useXAppRoundEarnings';
import { useVeChainKitConfig } from '@/providers';

/**
 * Fetch the how much  multiple xApps earned in an allocation round
 * @param appIds  the xApps to get the votes for
 * @param roundId  the round id to get the votes for
 * @returns the earned amount of the xApps in the round and the xApp id
 */
export const useRoundEarnings = (roundId: string, appIds: string[]) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();
    return useQueries({
        queries: appIds.map((id) => ({
            queryKey: getXAppRoundEarningsQueryKey(roundId, id),
            queryFn: async () => {
                return getXAppRoundEarnings(thor, roundId, id, network.type);
            },
        })),
    });
};
