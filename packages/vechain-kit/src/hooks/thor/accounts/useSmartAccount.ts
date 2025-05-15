import { useQuery } from '@tanstack/react-query';
import { Address } from '@vechain/sdk-core1.2';
import { useGetNodeUrl } from '@/hooks';
import { ThorClient } from '@vechain/sdk-network1.2';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { SimpleAccountFactory__factory } from '@/contracts';

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

    const res = await thor.contracts
        .load(
            getConfig(network).accountFactoryAddress,
            SimpleAccountFactory__factory.abi,
        )
        .read.getAccountAddress([ownerAddress]);

    if (!res) {
        throw new Error(`Failed to get account address of ${ownerAddress}`);
    }

    const accountAddress = Address.of(res[0].toString());
    const accountDetail = await thor.accounts.getAccount(accountAddress);

    if (!accountDetail) {
        throw new Error(`Failed to get account detail of ${accountAddress}`);
    }

    return {
        address: accountAddress.toString(),
        isDeployed: accountDetail.hasCode,
    };
};

export const getSmartAccountQueryKey = (ownerAddress?: string) => {
    return ['VECHAIN_KIT_SMART_ACCOUNT', ownerAddress];
};

export const useSmartAccount = (ownerAddress?: string) => {
    const { network } = useVeChainKitConfig();
    // TODO: migration ask can we use useThor here
    const nodeUrl = useGetNodeUrl();
    const thor = ThorClient.at(nodeUrl);

    return useQuery({
        queryKey: getSmartAccountQueryKey(ownerAddress),
        queryFn: () => getSmartAccount(thor, network.type, ownerAddress),
        enabled: !!ownerAddress && !!network.type && !!thor,
    });
};
