import { useVeChainKitConfig } from '@/providers';
import { getCallClauseQueryKey, useCallClause } from '@/hooks';
import { X2EarnApps__factory as X2EarnApps } from '@/contracts';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const abi = X2EarnApps.abi;
const method = 'baseURI' as const;

export const getXAppsMetadataBaseUriQueryKey = (network: NETWORK_TYPE) =>
    getCallClauseQueryKey<typeof abi>({
        method,
        address: getConfig(network).x2EarnAppsContractAddress,
        args: [],
    });

/**
 *  Hook to get the baseUri of the xApps metadata
 * @returns the baseUri of the xApps metadata
 */
export const useXAppsMetadataBaseUri = () => {
    const { network } = useVeChainKitConfig();

    // X2Earn Apps metadata base URI result: [ 'ipfs://' ]
    return useCallClause({
        abi,
        address: getConfig(network.type).x2EarnAppsContractAddress,
        method,
        args: [],
        queryOptions: {
            enabled: !!network.type,
            staleTime: 1000 * 60 * 60, // 1 hour,
        },
    });
};
