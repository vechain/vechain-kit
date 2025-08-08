import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useConnex } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

export const getNFTMetadataUri = async (
    networkType: NETWORK_TYPE,
    thor: Connex.Thor,
    tokenID: null | string,
): Promise<string> => {
    if (!tokenID) return Promise.reject(new Error('tokenID not provided'));

    const galaxyMemberContract =
        getConfig(networkType).galaxyMemberContractAddress;
    const functionFragment = GalaxyMember__factory.createInterface()
        .getFunction('tokenURI')
        .format('json');
    const res = await thor
        .account(galaxyMemberContract)
        .method(JSON.parse(functionFragment))
        .call(tokenID);

    if (res.vmError) return Promise.reject(new Error(res.vmError));
    return res.decoded[0];
};

export const getNFTMetadataUriQueryKey = (tokenID: null | string) => [
    'VECHAIN_KIT',
    'tokenURI',
    'galaxyMember',
    tokenID,
];

/**
 * Get the metadata URI for an NFT
 *
 * @param tokenID the token ID to get the metadata URI for
 * @returns the metadata URI for the token
 */
export const useNFTMetadataUri = (tokenID: null | string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getNFTMetadataUriQueryKey(tokenID),
        queryFn: () => getNFTMetadataUri(network.type, thor, tokenID),
        enabled: !!tokenID && !!network.type,
    });
};
