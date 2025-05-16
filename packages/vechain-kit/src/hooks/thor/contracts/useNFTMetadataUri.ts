import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useThor } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';

export const getNFTMetadataUri = async (
    thor: ThorClient,
    networkType: NETWORK_TYPE,
    tokenID: null | string,
): Promise<string> => {
    if (!tokenID) return Promise.reject(new Error('tokenID not provided'));

    const res = await thor.contracts
        .load(
            getConfig(networkType).galaxyMemberContractAddress,
            GalaxyMember__factory.abi,
        )
        .read.tokenURI(tokenID);

    if (!res)
        return Promise.reject(
            new Error(`Failed to get NFT metadata URI for ${tokenID}`),
        );

    return res[0].toString();
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
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getNFTMetadataUriQueryKey(tokenID),
        queryFn: () =>
            getNFTMetadataUri(
                thor as unknown as ThorClient,
                network.type,
                tokenID,
            ),
        enabled: !!tokenID && !!network.type,
    });
};
