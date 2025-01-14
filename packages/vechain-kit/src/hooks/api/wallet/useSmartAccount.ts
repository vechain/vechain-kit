import { SimpleAccountFactoryABI } from '@/assets';
import { THOR_CLIENT } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { ABIContract, Address } from '@vechain/sdk-core';

export interface SmartAccountReturnType {
    address: string | undefined;
    isDeployed: boolean;
}
export const getSmartAccount = async (ownerAddress?: string) => {
    if (!ownerAddress) {
        return { address: undefined };
    }

    const account = await THOR_CLIENT.contracts.executeCall(
        '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
        ABIContract.ofAbi(SimpleAccountFactoryABI).getFunction(
            'getAccountAddress',
        ),
        [ownerAddress],
    );

    const isDeployed = (
        await THOR_CLIENT.accounts.getAccount(
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
    return useQuery({
        queryKey: getSmartAccountQueryKey(ownerAddress),
        queryFn: () => getSmartAccount(ownerAddress),
        enabled: !!ownerAddress,
    });
};
