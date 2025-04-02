import { useQuery } from '@tanstack/react-query';
import { B3TR__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'ethers';
import { humanNumber } from '@/utils';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

export type TokenBalance = {
    original: string;
    scaled: string;
    formatted: string;
};

/**
 *  Get the b3tr balance of an address from the contract
 * @param thor  The thor instance
 * @param network  The network type
 * @param address  The address to get the balance of. If not provided, will return an error (for better react-query DX)
 * @returns Balance of the token in the form of {@link TokenBalance} (original, scaled down and formatted)
 */
export const getB3trBalance = async (
    thor: ThorClient,
    network: NETWORK_TYPE,
    address?: string,
): Promise<TokenBalance> => {
    const res = await thor.contracts
        .load(getConfig(network).b3trContractAddress, B3TR__factory.abi)
        .read.balanceOf(address);

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

export const getB3trBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_B3TR_BALANCE',
    address,
];

export const useGetB3trBalance = (address?: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getB3trBalanceQueryKey(address),
        queryFn: async () => getB3trBalance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
