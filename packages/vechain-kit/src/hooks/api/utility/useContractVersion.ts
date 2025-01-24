import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getVersion = async (
    thor: Connex.Thor,
    contractAddress?: string,
): Promise<string> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('version').format('json');

    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getVersionQueryKey = (contractAddress?: string) => [
    'CONTRACT_VERSION',
    contractAddress,
];

/**
 * Get the version of the contract
 * @returns The version of the contract
 */
export const useContractVersion = (contractAddress?: string) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress),
        queryFn: async () => getVersion(thor, contractAddress),
        enabled: !!thor && !!contractAddress,
    });
};
