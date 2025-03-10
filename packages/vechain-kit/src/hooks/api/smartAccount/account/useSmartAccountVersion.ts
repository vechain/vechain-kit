import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getVersion = async (
    thor: Connex.Thor,
    contractAddress?: string,
): Promise<number> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('version').format('json');

    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.reverted) throw new Error('Reverted');

    return parseInt(res.decoded[0]);
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
    const { thor } = useConnex();

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress),
        queryFn: async () => getVersion(thor, contractAddress),
        enabled: !!thor && contractAddress !== '',
    });
};
