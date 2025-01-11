import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IB3TR__factory } from '../../contracts/typechain-types';

const B3TRInterface = IB3TR__factory.createInterface();

export const getB3trBalance = async (
    thor: Connex.Thor,
    address?: string,
): Promise<string> => {
    const functionFragment =
        B3TRInterface.getFunction('balanceOf').format('json');

    const res = await thor
        .account('0x5ef79995FE8a89e0812330E4378eB2660ceDe699')
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

    return useQuery({
        queryKey: getB3trBalanceQueryKey(address),
        queryFn: async () => getB3trBalance(thor, address),
        enabled: !!thor && !!address,
    });
};
