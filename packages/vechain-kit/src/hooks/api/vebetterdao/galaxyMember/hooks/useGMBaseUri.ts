import { getConfig } from '@/config';
import { GalaxyMember__factory } from '@vechain/vechain-contract-types';
import { getCallKey, useCall } from '@/hooks';
import { UseQueryResult } from '@tanstack/react-query';
import { useVeChainKitConfig } from '@/providers';
const contractInterface = GalaxyMember__factory.createInterface();
const method = 'baseURI';

/**
 * Query key for the `baseURI` method on the Galaxy Member contract.
 * Using a different name to avoid conflicts with the `baseURI` property on ERC721 contracts.
 */
export const getGMBaseUriQueryKey = () =>
    getCallKey({ method: 'getGMBaseUri', keyArgs: [] });

/**
 * Custom hook that retrieves the base URI for the Galaxy Member NFT.
 *
 * @returns The base URI for the Galaxy Member NFT.
 */
export const useGMBaseUri = (): UseQueryResult<string, Error> => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).galaxyMemberContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [],
        enabled: !!network.type,
    });
};
