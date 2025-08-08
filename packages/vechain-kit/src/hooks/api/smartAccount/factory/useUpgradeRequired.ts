import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@vechain/vechain-contract-types';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getUpgradeRequired = async (
    thor: Connex.Thor,
    accountAddress: string,
    ownerAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const functionFragment =
        SimpleAccountFactoryInterface.getFunction('upgradeRequired').format(
            'json',
        );

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(accountAddress, ownerAddress, targetVersion);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
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
    const { thor } = useConnex();
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
                thor,
                accountAddress,
                ownerAddress,
                targetVersion,
                network.type,
            ),
        enabled: !!thor && !!accountAddress && !!ownerAddress && !!network.type,
    });
};
