import { useQueries } from '@tanstack/react-query';
import { ERC20__factory } from '../../../contracts/typechain-types';
import { formatEther } from 'ethers';
import { humanNumber } from '@/utils';
import { useCustomTokens } from '../wallet/useCustomTokens';
import { CustomTokenInfo } from './useGetCustomTokenInfo';
import { TokenBalance } from '../vebetterdao';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export type TokenWithBalance = CustomTokenInfo & TokenBalance;

/**
 *  Get the b3tr balance of an address from the contract
 * @param thor  The thor instance
 * @param network  The network type
 * @param address  The address to get the balance of. If not provided, will return an error (for better react-query DX)
 * @returns Balance of the token in the form of {@link TokenBalance} (original, scaled down and formatted)
 */
export const getCustomTokenBalance = async (
    thor: ThorClient,
    token: CustomTokenInfo,
    address?: string,
): Promise<TokenWithBalance> => {
    const res = await thor.contracts
        .load(token.address, ERC20__factory.abi)
        .read.balanceOf(address);

    if (!res) throw new Error('Reverted');

    const original = res[0];
    const scaled = formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        ...token,
        original: original.toString(),
        scaled,
        formatted,
    };
};

export const getCustomTokenBalanceQueryKey = (
    tokenAddress: string,
    address?: string,
) => ['VECHAIN_KIT_CUSTOM_TOKEN_BALANCE', address, tokenAddress];

export const useGetCustomTokenBalances = (address?: string) => {
    const thor = useThor();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: customTokens.map((token) => ({
            queryKey: getCustomTokenBalanceQueryKey(token.address, address),
            queryFn: async () => {
                return await getCustomTokenBalance(thor, token, address);
            },
        })),
    });
};
