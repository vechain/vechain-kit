import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { getConfig } from '@/config';
import { X2EarnRewardsPool__factory } from '@/contracts';
import { humanNumber } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { TokenBalance } from '../../useGetB3trBalance';
import { formatEther } from 'ethers';
import { type ThorClient } from '@vechain/sdk-network';
/**
 * Get the available balance in the x2Earn rewards pool contract for a specific xApp
 *
 * @param thor  the connex instance
 * @param xAppId  the xApp id
 * @param x2EarnRewardsPoolContract  the x2Earn rewards pool contract address
 * @returns the available balance in the x2Earn rewards pool contract for a specific xApp
 */
export const getAppBalance = async (
    thor: ThorClient,
    xAppId: string,
    x2EarnRewardsPoolContract: string,
): Promise<TokenBalance> => {
    const res = await thor.contracts
        .load(x2EarnRewardsPoolContract, X2EarnRewardsPool__factory.abi)
        .read.availableFunds(xAppId);

    if (!res) throw new Error('Reverted');

    const original = res[0].toString();
    const scaled = formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        original,
        scaled,
        formatted,
    };
};

export const getAppBalanceQueryKey = (xAppId: string) => [
    'VECHAIN_KIT',
    'X2EarnRewardsPool',
    'APP_BALANCE',
    xAppId,
];

/**
 * Get the balance available in the x2Earn rewards pool contract
 *
 * @param thor  the connex instance
 * @param xAppId  the xApp id
 * @returns the balance available in the x2Earn rewards pool contract
 */
export const useAppBalance = (xAppId: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const x2EarnRewardsPoolContract = getConfig(
        network.type,
    ).x2EarnRewardsPoolContractAddress;

    return useQuery({
        queryKey: getAppBalanceQueryKey(xAppId),
        queryFn: async () =>
            await getAppBalance(thor, xAppId, x2EarnRewardsPoolContract),
        enabled: !!thor && !!xAppId,
    });
};
