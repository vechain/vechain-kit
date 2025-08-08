import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

type GetAccountVersionReturnValue = {
    version: number;
    isDeployed: boolean;
};

export const getAccountVersion = async (
    thor: Connex.Thor,
    accountAddress: string,
    ownerAddress: string,
    networkType: NETWORK_TYPE,
): Promise<GetAccountVersionReturnValue> => {
    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('getAccountVersion').format(
            'json',
        );

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(accountAddress, ownerAddress);

    if (res.reverted) throw new Error('Reverted');

    return {
        version: res.decoded[0],
        isDeployed: res.decoded[1],
    };
};

export const getAccountVersionQueryKey = (
    accountAddress: string,
    ownerAddress: string,
    networkType: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'VERSION',
    accountAddress,
    ownerAddress,
    networkType,
];

/**
 * Check if a smart account has a v1 smart account
 * @param accountAddress - The address of the smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The version of the smart account
 */
export const useGetAccountVersion = (
    accountAddress: string,
    ownerAddress: string,
) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getAccountVersionQueryKey(
            accountAddress,
            ownerAddress,
            network.type,
        ),
        queryFn: async () =>
            getAccountVersion(thor, accountAddress, ownerAddress, network.type),
        enabled: !!thor && accountAddress !== '' && ownerAddress !== '',
    });
};
