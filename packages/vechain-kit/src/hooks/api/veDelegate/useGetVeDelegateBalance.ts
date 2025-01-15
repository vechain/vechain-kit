import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from '@repo/config';
import { IERC20__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { NETWORK_TYPE } from '@/config/network';
import { getConfig } from '@/config';

const ERC20Interface = IERC20__factory.createInterface();

export const getVeDelegateBalance = async (
    thor: Connex.Thor,
    network: NETWORK_TYPE,
    address?: string,
): Promise<string> => {
    const functionFragment =
        ERC20Interface.getFunction('balanceOf').format('json');

    const res = await thor
        .account(getConfig(network).veDelegateTokenContractAddress)
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
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getVeDelegateBalanceQueryKey(address),
        queryFn: async () => getVeDelegateBalance(thor, network.type, address),
        enabled: !!thor && !!address && !!network.type,
    });
};
