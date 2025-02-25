import { useQueries } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { ERC20__factory } from '../../../contracts/typechain-types';
import { formatEther } from 'viem';
import { humanNumber } from '@/utils';
import { useCustomTokens } from '../wallet/useCustomTokens';
import { CustomTokenInfo } from './useGetCustomTokenInfo';
import { TokenBalance } from '../vebetterdao';

const ERC20Interface = ERC20__factory.createInterface();

export type TokenWithBalance = CustomTokenInfo & TokenBalance;

/**
 *  Get the b3tr balance of an address from the contract
 * @param thor  The thor instance
 * @param network  The network type
 * @param address  The address to get the balance of. If not provided, will return an error (for better react-query DX)
 * @returns Balance of the token in the form of {@link TokenBalance} (original, scaled down and formatted)
 */
export const getCustomTokenBalance = async (
    thor: Connex.Thor,
    token: CustomTokenInfo,
    address?: string,
): Promise<TokenWithBalance> => {
    const functionFragment =
        ERC20Interface.getFunction('balanceOf').format('json');

    const res = await thor
        .account(token.address)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    const original = res.decoded[0];
    const scaled = formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        ...token,
        original,
        scaled,
        formatted,
    };
};

export const getCustomTokenBalanceQueryKey = (
    tokenAddress: string,
    address?: string,
) => ['VECHAIN_KIT_CUSTOM_TOKEN_BALANCE', address, tokenAddress];

export const useGetCustomTokenBalances = (address?: string) => {
    const { thor } = useConnex();
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
