import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { formatEther } from 'viem';
import { humanNumber } from '@/utils';

const B3TRInterface = IB3TR__factory.createInterface();

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
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    address?: string,
): Promise<TokenBalance> => {
    const functionFragment =
        B3TRInterface.getFunction('balanceOf').format('json');

    const res = await thor
        .account(getConfig(network).b3trContractAddress)
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

export const getB3trBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_B3TR_BALANCE',
    address,
];

export const useGetB3trBalance = (address?: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getB3trBalanceQueryKey(address),
        queryFn: async () => getB3trBalance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
