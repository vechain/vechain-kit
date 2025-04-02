import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

type GetAccountVersionReturnValue = {
    version: number;
    isDeployed: boolean;
};

export const getAccountVersion = async (
    thor: ThorClient,
    accountAddress: string,
    ownerAddress: string,
    networkType: NETWORK_TYPE,
): Promise<GetAccountVersionReturnValue> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SimpleAccountFactory__factory.abi,
        )
        .read.getAccountVersion(accountAddress, ownerAddress);

    if (!res) throw new Error('Reverted');

    return {
        version: parseInt(res[0].toString()),
        isDeployed: res[1] === true,
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
    const thor = useThor();
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
