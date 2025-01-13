import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IERC20__factory } from '../../../contracts/typechain-types';

const ERC20Interface = IERC20__factory.createInterface();

export const getVeDelegateBalance = async (
    thor: Connex.Thor,
    address?: string,
): Promise<string> => {
    const functionFragment =
        ERC20Interface.getFunction('balanceOf').format('json');

    const res = await thor
        .account('0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950')
        .method(JSON.parse(functionFragment))
        .call(address);

    if (res.reverted) throw new Error('Reverted');

    return res.decoded[0];
};

export const getVeDelegateBalanceQueryKey = (address?: string) => [
    'VECHAIN_KIT_VE_DELEGATE_BALANCE',
    address,
];

export const useGetVeDelegateBalance = (address?: string) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getVeDelegateBalanceQueryKey(address),
        queryFn: async () => getVeDelegateBalance(thor, address),
        enabled: !!thor && !!address,
    });
};
