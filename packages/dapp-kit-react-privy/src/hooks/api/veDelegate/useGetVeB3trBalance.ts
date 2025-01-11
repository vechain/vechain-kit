import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IB3TR__factory } from '../../../contracts/typechain-types';

const B3TRInterface = IB3TR__factory.createInterface();

export const getVeB3trBalance = async (
    thor: Connex.Thor,
    address?: string,
): Promise<string> => {
    const functionFragment =
        B3TRInterface.getFunction('balanceOf').format('json');

    const res = await thor
        .account('0x420dFe6B7Bc605Ce61E9839c8c0E745870A6CDE0')
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getVeB3trBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_VE_B3TR_BALANCE',
    address,
];

export const useGetVeB3trBalance = (address?: string) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getVeB3trBalanceQueryKey(address),
        queryFn: async () => getVeB3trBalance(thor, address),
        enabled: !!thor && !!address,
    });
};
