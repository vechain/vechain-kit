import { useQuery } from '@tanstack/react-query';
import { getConfig } from '@/config';
import { useThor } from '@vechain/dapp-kit-react';
import { GalaxyMember__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { type ThorClient } from '@vechain/sdk-network';

export const getParticipatedInGovernance = async (
    networkType: NETWORK_TYPE,
    thor: ThorClient,
    address: null | string,
): Promise<boolean> => {
    if (!address) return Promise.reject(new Error('Address not provided'));

    const galaxyMemberContract =
        getConfig(networkType).galaxyMemberContractAddress;

    const res = await thor.contracts
        .load(galaxyMemberContract, GalaxyMember__factory.abi)
        .read.participatedInGovernance(address);

    if (!res) throw new Error('Reverted');

    return res[0] as boolean;
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
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getParticipatedInGovernanceQueryKey(address),
        queryFn: () => getParticipatedInGovernance(network.type, thor, address),
        enabled: !!address && !!network.type,
    });
};
