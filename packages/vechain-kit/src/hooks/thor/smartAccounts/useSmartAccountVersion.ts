import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@vechain/vechain-contract-types';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { ThorClient } from '@vechain/sdk-network';
import { useThor } from '@/hooks';
import { ABIContract } from '@vechain/sdk-core';

const SimpleAccountFactoryABI = SimpleAccountFactory__factory.abi;
const method = 'getAccountVersion' as const;

export const getVersion = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    contractAddress?: string,
    ownerAddress?: string,
): Promise<number> => {

    if (!contractAddress) throw new Error('Contract address is required');

    const res = await thor.contracts.executeCall(
        getConfig(network).accountFactoryAddress, 
        ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(method), 
        [contractAddress, ownerAddress]
    );

    if (!res.success) throw new Error('Reverted');

    return parseInt(res.result.array?.[0] as string);
};

export const getVersionQueryKey = (contractAddress?: string, ownerAddress?: string) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'VERSION',
    contractAddress,
    ownerAddress,
];

/**
 * Get the version of the smart account
 * @returns The version of the smart account
 */
export const useSmartAccountVersion = (contractAddress?: string, ownerAddress?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress, ownerAddress),
        queryFn: async () => getVersion(thor, network.type, contractAddress, ownerAddress),
        enabled: !!thor && contractAddress !== '' && ownerAddress !== '',
    });
};
