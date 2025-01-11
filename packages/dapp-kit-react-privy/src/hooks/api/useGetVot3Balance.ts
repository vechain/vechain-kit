import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { IVOT3__factory } from '../../contracts/typechain-types';

const VOT3Interface = IVOT3__factory.createInterface();

export const getVot3Balance = async (
    thor: Connex.Thor,
    address?: string,
): Promise<string> => {
    const functionFragment =
        VOT3Interface.getFunction('balanceOf').format('json');

    const res = await thor
        .account('0x5ef79995FE8a89e0812330E4378eB2660ceDe699')
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getVot3BalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_VOT3_BALANCE',
    address,
];

export const useGetVot3Balance = (address?: string) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getVot3BalanceQueryKey(address),
        queryFn: async () => getVot3Balance(thor, address),
        enabled: !!thor && !!address,
    });
};
