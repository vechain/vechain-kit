import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnRewardsPool__factory } from '@/contracts';
import { humanNumber } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { TokenBalance } from '@/types';
import { formatEther } from 'viem';
import { ThorClient } from '@vechain/sdk-network';

/**
 * Get the available funds in the x2Earn rewards pool contract for a specific xApp
 *
 * @param thor  the thor instance
 * @param xAppId  the xApp id
 * @param x2EarnRewardsPoolContract  the x2Earn rewards pool contract address
 * @returns the available funds in the x2Earn rewards pool contract for a specific xApp
 */
export const getX2EarnAppAvailableFunds = async (
    thor: ThorClient,
    xAppId: string,
    x2EarnRewardsPoolContractAddress: string,
): Promise<TokenBalance> => {
    const res = await thor.contracts
        .load(x2EarnRewardsPoolContractAddress, X2EarnRewardsPool__factory.abi)
        .read.availableFunds(xAppId);

    if (!res)
        throw new Error(`Failed to get available funds for xApp ${xAppId}`);

    const original = res[0].toString();
    const scaled = formatEther(BigInt(original));
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        original,
        scaled,
        formatted,
    };
};

export const getX2EarnAppAvailableFundsQueryKey = (xAppId: string) => [
    'VECHAIN_KIT',
    'X2EarnRewardsPool',
    xAppId,
    'AVAILABLE_FUNDS',
];

/**
 * Get the available funds in the x2Earn rewards pool contract
 *
 * @param thor  the thor instance
 * @param xAppId  the xApp id
 * @returns the available funds in the x2Earn rewards pool contract
 */
export const useX2EarnAppAvailableFunds = (xAppId: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getX2EarnAppAvailableFundsQueryKey(xAppId),
        queryFn: async () =>
            await getX2EarnAppAvailableFunds(
                thor,
                xAppId,
                getConfig(network.type).x2EarnRewardsPoolContractAddress,
            ),
        enabled: !!thor && !!xAppId,
    });
};
