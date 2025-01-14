import { SimpleAccountFactoryABI } from '@/assets';
import { useQuery } from '@tanstack/react-query';
import { ABIContract, Address } from '@vechain/sdk-core';
import { useGetNodeUrl } from '../useGetNodeUrl';
import { ThorClient } from '@vechain/sdk-network';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
export interface SmartAccountReturnType {
    address: string | undefined;
    isDeployed: boolean;
}
export const getSmartAccount = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    ownerAddress?: string,
) => {
    if (!ownerAddress) {
        return { address: undefined };
    }

    const account = await thor.contracts.executeCall(
        getConfig(network).accountFactoryAddress,
        ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
            'getAccountAddress',
        ),
        [ownerAddress],
    );

    const isDeployed = (
        await thor.accounts.getAccount(
            Address.of(String(account.result.array?.[0])),
        )
    ).hasCode;

    return {
        address: String(account.result.array?.[0]),
        isDeployed,
    };
};

export const getSmartAccountQueryKey = (ownerAddress?: string) => {
    return ['VECHAIN_KIT_SMART_ACCOUNT', ownerAddress];
};

export const useSmartAccount = (ownerAddress?: string) => {
    const { network } = useVeChainKitConfig();
    const nodeUrl = useGetNodeUrl();
    const thor = ThorClient.at(nodeUrl);

    return useQuery({
        queryKey: getSmartAccountQueryKey(ownerAddress),
        queryFn: () => getSmartAccount(thor, network.type, ownerAddress),
        enabled: !!ownerAddress && !!network.type && !!thor,
    });
};
