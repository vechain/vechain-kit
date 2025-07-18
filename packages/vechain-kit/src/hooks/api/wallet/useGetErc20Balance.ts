import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { IERC20__factory } from '@vechain/vechain-contracts';
import { formatEther } from 'ethers';
import { humanNumber } from '@/utils';
import { ThorClient } from '@vechain/sdk-network';

export const getErc20Balance = async (
    thor: ThorClient,
    tokenAddress: string,
    address?: string,
): Promise<{ original: string; scaled: string; formatted: string }> => {
    if (!tokenAddress || !address) {
        throw new Error('Token address and user address are required');
    }

    const res = await thor.contracts
        .load(tokenAddress, IERC20__factory.abi)
        .read.balanceOf(address);

    if (!res) throw new Error(`Failed to get balance of ${tokenAddress}`);

    const original = res[0].toString();
    const scaled = formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        original,
        scaled,
        formatted,
    };
};

export const getErc20BalanceQueryKey = (
    tokenAddress: string,
    address?: string,
) => ['VECHAIN_KIT', 'BALANCE', 'ERC20', tokenAddress, address];

export const useGetErc20Balance = (tokenAddress: string, address?: string) => {
    const thor = useThor();

    return useQuery({
        queryKey: getErc20BalanceQueryKey(tokenAddress, address),
        queryFn: async () => getErc20Balance(thor, tokenAddress, address),
        enabled: !!thor && !!address && !!tokenAddress,
    });
};
