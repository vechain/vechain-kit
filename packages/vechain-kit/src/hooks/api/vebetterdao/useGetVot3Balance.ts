import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { IVOT3__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';
import { ethers } from 'ethers';
import { humanNumber } from '@/utils';
import { TokenBalance } from './useGetB3trBalance';

const VOT3Interface = IVOT3__factory.createInterface();

export const getVot3Balance = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    address?: string,
): Promise<TokenBalance> => {
    const functionFragment =
        VOT3Interface.getFunction('balanceOf').format('json');

    const res = await thor
        .account(getConfig(network).vot3ContractAddress)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    const original = res.decoded[0];
    const scaled = ethers.formatEther(original);
    const formatted = scaled === '0' ? '0' : humanNumber(scaled);

    return {
        original,
        scaled,
        formatted,
    };
};

export const getVot3BalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_VOT3_BALANCE',
    address,
];

export const useGetVot3Balance = (address?: string) => {
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => getVot3Balance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
