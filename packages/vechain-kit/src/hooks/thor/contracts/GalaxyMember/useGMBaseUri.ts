import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { useCallClause, getCallClauseQueryKey } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';

const contractAbi = GalaxyMember__factory.abi;
const method = 'baseURI';

/**
 * Query key for the `baseURI` method on the Galaxy Member contract.
 */
export const getGMBaseUriQueryKey = (networkType: NETWORK_TYPE) => {
    const contractAddress = getConfig(networkType).galaxyMemberContractAddress;
    return getCallClauseQueryKey({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
    });
};

/**
 * Custom hook that retrieves the base URI for the Galaxy Member NFT.
 *
 * @param customEnabled - Determines whether the hook is enabled or not. Default is true.
 * @returns The base URI for the Galaxy Member NFT.
 */
export const useGMBaseUri = (customEnabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    // Galaxy Member GM base URI result:
    //  [ 'ipfs://bafybeidq2wrzarkqzi7sgmecbsl6fhcnthcvks2xgial3ucqw2zxxvwpty/metadata/' ]
    return useCallClause({
        address: contractAddress,
        abi: contractAbi,
        method,
        args: [],
        queryOptions: {
            enabled: customEnabled && !!network.type && !!contractAddress,
        },
    });
};
