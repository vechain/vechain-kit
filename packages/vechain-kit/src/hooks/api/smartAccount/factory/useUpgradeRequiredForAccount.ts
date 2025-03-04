import { useQuery } from '@tanstack/react-query';
import { SimpleAccountFactory__factory } from '@/contracts';
import { useConnex } from '@vechain/dapp-kit-react';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const SimpleAccountFactoryInterface =
    SimpleAccountFactory__factory.createInterface();

export const getUpgradeRequiredForAccount = async (
    thor: Connex.Thor,
    contractAddress: string,
    targetVersion: number,
    networkType: NETWORK_TYPE,
): Promise<boolean> => {
    const functionFragment = SimpleAccountFactoryInterface.getFunction(
        'upgradeRequiredForAccount',
    ).format('json');

    const res = await thor
        .account(getConfig(networkType).accountFactoryAddress)
        .method(JSON.parse(functionFragment))
        .call(contractAddress, targetVersion);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
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
    const { thor } = useConnex();
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
