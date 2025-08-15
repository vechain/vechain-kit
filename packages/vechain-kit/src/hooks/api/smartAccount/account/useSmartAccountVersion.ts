import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getVersion = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    contractAddress?: string,
    ownerAddress?: string,
): Promise<number> => {

    if (!contractAddress) throw new Error('Contract address is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('getAccountVersion').format('json');

    const res = await thor
        .account(getConfig(network).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(contractAddress, ownerAddress);

    if (res.reverted) throw new Error('Reverted');

    return parseInt(res.decoded["accountVersion"]);
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress, ownerAddress),
        queryFn: async () => getVersion(thor, network.type, contractAddress, ownerAddress),
        enabled: !!thor && contractAddress !== '' && ownerAddress !== '',
    });
};
