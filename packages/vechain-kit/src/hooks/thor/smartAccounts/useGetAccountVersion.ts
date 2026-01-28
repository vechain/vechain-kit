import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '../../../providers/VeChainKitProvider';
import { NETWORK_TYPE } from '../../../config/network';
import { getConfig } from '../../../config';
import { getCallClauseQueryKeyWithArgs, useCallClause } from '../../';

const abi = SocialLoginSmartAccountFactory__factory.abi;

export const getAccountVersionQueryKey = (
    accountAddress: string,
    ownerAddress: string,
    networkType: NETWORK_TYPE,
) =>
    getCallClauseQueryKeyWithArgs({
        abi,
        address: getConfig(networkType).accountFactoryAddress,
        method: 'getAccountVersion',
        args: [accountAddress as `0x${string}`, ownerAddress as `0x${string}`],
    });

/**
 * Check if a smart account has a v1 smart account
 * @param accountAddress - The address of the smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @returns The version of the smart account
 */
export const useGetAccountVersion = (
    accountAddress: string,
    ownerAddress: string,
) => {
    const { network } = useVeChainKitConfig();

    return useCallClause({
        address: getConfig(network.type).accountFactoryAddress,
        abi,
        method: 'getAccountVersion',
        args: [accountAddress as `0x${string}`, ownerAddress as `0x${string}`],
        queryOptions: {
            select: (data) => {
                return {
                    version: parseInt(data[0].toString()),
                    isDeployed: data[1],
                };
            },
        },
    });
};
