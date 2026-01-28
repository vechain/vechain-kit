import { useQuery } from '@tanstack/react-query';
import { SocialLoginSmartAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useOptionalThor } from '../../api/dappkit/useOptionalThor';
import { useVeChainKitConfig } from '../../../providers/VeChainKitContext';
import { NETWORK_TYPE } from '../../../config/network';
import { getConfig } from '../../../config';
import { ThorClient } from '@vechain/sdk-network';

export const getUpgradeRequired = async (
    thor: ThorClient,
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const res = await thor.contracts
        .load(
            getConfig(networkType).accountFactoryAddress,
            SocialLoginSmartAccountFactory__factory.abi,
        )
        .read.upgradeRequired(
            accountAddress as `0x${string}`,
            ownerAddress as `0x${string}`,
            BigInt(targetVersion),
        );

    if (!res)
        throw new Error(
            `Failed to get upgrade required of contract address ${
                getConfig(networkType).accountFactoryAddress
            }`,
        );

    return res[0] as boolean;
};

export const getUpgradeRequiredQueryKey = (
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
) => [
    'VECHAIN_KIT',
    'SMART_ACCOUNT',
    'FACTORY',
    'UPGRADE_REQUIRED',
    accountAddress,
    ownerAddress,
    targetVersion,
    networkType,
];

/**
 * Check if a smart account needs an upgrade (even if it's not yet deployed)
 * @param accountAddress - The address of the smart account
 * @param ownerAddress - The address of the owner of the smart account
 * @param targetVersion - The version of the smart account to check for
 * @returns True if the smart account needs an upgrade, false otherwise
 */
export const useUpgradeRequired = (
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
) => {
    // Use optional Thor hook that handles missing provider gracefully
    const thor = useOptionalThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getUpgradeRequiredQueryKey(
            accountAddress,
            ownerAddress,
            targetVersion,
            network.type,
        ),
        queryFn: async () =>
            getUpgradeRequired(
                thor!,
                accountAddress,
                ownerAddress,
                targetVersion,
                network.type,
            ),
        enabled: !!thor && !!accountAddress && !!ownerAddress && !!network.type,
    });
};
