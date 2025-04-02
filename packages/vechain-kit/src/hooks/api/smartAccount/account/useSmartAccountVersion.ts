import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export const getVersion = async (
    thor: ThorClient,
    contractAddress?: string,
): Promise<number> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const res = await thor.contracts
        .load(contractAddress, SimpleAccountFactory__factory.abi)
        .read.version();

    if (!res) throw new Error('Reverted');

    return parseInt(res[0].toString());
};

export const getVersionQueryKey = (contractAddress?: string) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'VERSION',
    contractAddress,
];

/**
 * Get the version of the smart account
 * @returns The version of the smart account
 */
export const useSmartAccountVersion = (contractAddress?: string) => {
    const thor = useThor();

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress),
        queryFn: async () => getVersion(thor, contractAddress),
        enabled: !!thor && contractAddress !== '',
    });
};
