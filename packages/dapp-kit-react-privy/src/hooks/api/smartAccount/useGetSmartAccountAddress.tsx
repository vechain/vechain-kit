import { useQuery } from '@tanstack/react-query';
import { ABIContract } from '@vechain/sdk-core';
import { THOR_CLIENT } from '../../../utils';
import { SimpleAccountFactoryABI } from '../../../assets';

interface SmartAccountAddressResult {
    address: string | undefined;
}

export const getSmartAccountAddress = async (
    ownerAddress?: string,
): Promise<SmartAccountAddressResult> => {
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

    return {
        address: String(account.result.array?.[0]),
    };
};

export const getSmartAccountAddressQueryKey = (ownerAddress?: string) => [
    'VECHAIN_KIT_SMART_ACCOUNT_ADDRESS',
    ownerAddress,
];

/**
 * Hook to get the smart account address for a given owner address
 * @param ownerAddress The address of the smart account owner
 * @returns The smart account address and loading/error states
 */
export const useGetSmartAccountAddress = (ownerAddress?: string) => {
    return useQuery({
        queryKey: getSmartAccountAddressQueryKey(ownerAddress),
        queryFn: () => getSmartAccountAddress(ownerAddress),
        enabled: !!ownerAddress,
    });
};
