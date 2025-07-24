import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@vechain/vechain-contract-types';
import { ThorClient } from '@vechain/sdk-network';
import { executeCallClause, useThor } from '@/hooks';

const abi = SimpleAccountFactory__factory.abi;
const method = 'version' as const;

export const getVersion = async (
    thor: ThorClient,
    contractAddress?: string,
): Promise<number> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const [version] = await executeCallClause({
        thor,
        contractAddress,
        abi,
        method,
        args: [],
    });

    return Number(version);
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
