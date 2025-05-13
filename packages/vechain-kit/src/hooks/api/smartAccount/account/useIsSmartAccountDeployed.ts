import { useQuery } from '@tanstack/react-query';
import { useGetNodeUrl } from '@/hooks';
import { ThorClient } from '@vechain/sdk-network';
import { Address } from '@vechain/sdk-core';

export const getIsDeployed = async (
    thor: ThorClient,
    accountAddress?: string,
): Promise<boolean> => {
    if (!accountAddress) throw new Error('Account address is required');

    const res = await thor.accounts.getAccount(
        Address.of(String(accountAddress)),
    );

    return res.hasCode;
};

export const getIsDeployedQueryKey = (contractAddress?: string) => [
    'VECHAIN_KIT_SMART_ACCOUNT',
    contractAddress,
    'IS_DEPLOYED',
];

/**
 * Check if a smart account is deployed
 * @returns True if the smart account is deployed, false otherwise
 */
export const useIsSmartAccountDeployed = (accountAddress?: string) => {
    const nodeUrl = useGetNodeUrl();
    const thor = ThorClient.at(nodeUrl);

    return useQuery({
        queryKey: getIsDeployedQueryKey(accountAddress),
        queryFn: async () => getIsDeployed(thor, accountAddress),
        enabled: !!thor && !!accountAddress,
    });
};
