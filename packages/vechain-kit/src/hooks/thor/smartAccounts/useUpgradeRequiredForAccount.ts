import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useThor } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '../../../providers';
import { NETWORK_TYPE } from '../../../config/network';
import { getConfig } from '../../../config';
import { ThorClient } from '@vechain/sdk-network';

export const getUpgradeRequiredForAccount = async (
    thor: ThorClient,
    contractAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.upgradeRequiredForAccount(contractAddress, BigInt(targetVersion));

    if (!res)
        throw new Error(
            `Failed to get upgrade required for contract address ${contractAddress}`,
        );

    return res[0] as boolean;
};

export const getUpgradeRequiredForAccountQueryKey = (
    contractAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'NEEDS_UPGRADE_FOR_ACCOUNT',
    contractAddress,
    targetVersion,
    networkType,
];

/**
 * Check if a smart account needs an upgrade
 * @param contractAddress - The address of the smart account
 * @param targetVersion - The target version of the smart account
 * @returns True if the smart account needs an upgrade, false otherwise
 */
export const useUpgradeRequiredForAccount = (
    contractAddress: string,
    targetVersion: number,
) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUpgradeRequiredForAccountQueryKey(
            contractAddress,
            targetVersion,
            network.type,
        ),
        queryFn: async () =>
            getUpgradeRequiredForAccount(
                thor,
                contractAddress,
                targetVersion,
                network.type,
            ),
        enabled:
            !!thor &&
            !!network &&
            !!contractAddress &&
            !!targetVersion &&
            contractAddress !== '',
    });
};
