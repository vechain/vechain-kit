import { useQueries } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';
import { ERC20__factory } from '@/contracts';
import { formatEther } from 'viem';
import { humanNumber } from '@/utils';
import {
    useCustomTokens,
    type CustomTokenInfo,
    type TokenBalance,
} from '@/hooks';
import { ThorClient } from '@vechain/sdk-network1.2';

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
        .read.balanceOf([address]);

    if (!res) throw new Error(`Failed to get balance of ${token.address}`);

    const original = res[0];
    const scaled = formatEther(BigInt(original));
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        ...token,
        original: original.toString(),
        scaled,
        formatted,
    };
};

export const getCustomTokenBalanceQueryKey = (
    tokenAddress?: string,
    address?: string,
) => ['VECHAIN_KIT_BALANCE', address, 'CUSTOM_TOKEN', tokenAddress];

export const useGetCustomTokenBalances = (address?: string) => {
    const thor = useThor();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: customTokens.map((token) => ({
            queryKey: getCustomTokenBalanceQueryKey(token.address, address),
            queryFn: async () => {
                return await getCustomTokenBalance(
                    thor as unknown as ThorClient,
                    token,
                    address,
                );
            },
        })),
    });
};
