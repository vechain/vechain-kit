import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@/types';

export const getVersion = async (
    thor: ThorClient,
    contractAddress?: string,
): Promise<number> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const res = await thor.contracts
        .load(contractAddress, SimpleAccountFactory__factory.abi)
        .read.version();

    if (!res) throw new Error('Failed to get smart account version');

    return Number(res[0]);
};

export const getVersionQueryKey = (contractAddress?: string) => [
    'VECHAIN_KIT_SMART_ACCOUNT',
    contractAddress,
    'VERSION',
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
