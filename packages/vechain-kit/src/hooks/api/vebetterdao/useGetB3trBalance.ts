import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IB3TR__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';

const B3TRInterface = IB3TR__factory.createInterface();

export const getB3trBalance = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    address?: string,
): Promise<string> => {
    const functionFragment =
        B3TRInterface.getFunction('balanceOf').format('json');

    const res = await thor
        .account(getConfig(network).b3trContractAddress)
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
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
