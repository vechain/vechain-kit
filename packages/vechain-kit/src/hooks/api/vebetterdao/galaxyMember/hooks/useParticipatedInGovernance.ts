import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useConnex } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';

export const getParticipatedInGovernance = async (
    networkType: NETWORK_TYPE,
    thor: Connex.Thor,
    address: null | string,
): Promise<boolean> => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const galaxyMemberContract =
        getConfig(networkType).galaxyMemberContractAddress;

    const functionFragment = GalaxyMember__factory.createInterface()
        .getFunction('participatedInGovernance')
        .format('json');
    const res = await thor
        .account(galaxyMemberContract)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.vmError) return Promise.reject(new Error(res.vmError));

    return res.decoded[0] as boolean;
};

export const getParticipatedInGovernanceQueryKey = (address: null | string) => [
    'VECHAIN_KIT',
    'participatedInGovernance',
    'galaxyMember',
    address,
];

/**
 * Get whether an address has participated in governance
 *
 * @param address the address to know if they have participated in governance
 * @returns whether the address has participated in governance
 */
export const useParticipatedInGovernance = (address: null | string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getParticipatedInGovernanceQueryKey(address),
        queryFn: () => getParticipatedInGovernance(network.type, thor, address),
        enabled: !!address && !!network.type,
    });
};
