import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { useIsSmartAccountDeployed } from './useIsSmartAccountDeployed';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getVersion = async (
    thor: Connex.Thor,
    contractAddress?: string,
    isDeployed?: boolean,
): Promise<number> => {
    if (!contractAddress) throw new Error('Contract address is required');

    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('version').format('json');

    const res = await thor
        .account(contractAddress)
        .method(JSON.parse(functionFragment))
        .call();

    if (res.reverted) {
        if (isDeployed) {
            // v1 of the smart account did not had a version function
            return 1;
        } else {
            throw new Error('Reverted');
        }
    }

    return parseInt(res.decoded[0]);
};

export const getVersionQueryKey = (
    contractAddress?: string,
    isDeployed?: boolean,
) => ['VECHAIN_KIT', 'SMART_ACCOUNT', 'VERSION', contractAddress, isDeployed];

/**
 * Get the version of the smart account
 * @returns The version of the smart account
 */
export const useSmartAccountVersion = (contractAddress?: string) => {
    const { thor } = useConnex();
    const { data: isDeployed } = useIsSmartAccountDeployed(contractAddress);

    return useQuery({
        queryKey: getVersionQueryKey(contractAddress, isDeployed),
        queryFn: async () => getVersion(thor, contractAddress, isDeployed),
        enabled: !!thor && !!contractAddress && !!isDeployed,
    });
};
