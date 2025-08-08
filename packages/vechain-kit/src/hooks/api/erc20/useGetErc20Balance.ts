import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import { formatEther } from 'ethers';
import { humanNumber } from '@/utils';

export const getErc20Balance = async (
    thor: Connex.Thor,
    tokenAddress: string,
    address?: string,
): Promise<{ original: string; scaled: string; formatted: string }> => {
    if (!tokenAddress || !address) {
        throw new Error('Token address and user address are required');
    }

    const functionFragment = IERC20__factory.createInterface()
        .getFunction('balanceOf')
        .format('json');

    const res = await thor
        .account(tokenAddress)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    const original = res.decoded[0];
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
) => ['VECHAIN_KIT_ERC20_BALANCE', tokenAddress, address];

export const useGetErc20Balance = (tokenAddress: string, address?: string) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getErc20BalanceQueryKey(tokenAddress, address),
        queryFn: async () => getErc20Balance(thor, tokenAddress, address),
        enabled: !!thor && !!address && !!tokenAddress,
    });
};
