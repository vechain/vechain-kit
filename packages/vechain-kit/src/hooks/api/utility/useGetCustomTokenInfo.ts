import { useQuery } from '@tanstack/react-query';
import { ERC20__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { useThor } from '@vechain/dapp-kit-react';
import { ThorClient } from '@/types';

export type CustomTokenInfo = {
    name: string;
    address: string;
    decimals: string;
    symbol: string;
};

export const getTokenInfo = async (thor: ThorClient, tokenAddress: string) => {
    if (!tokenAddress) throw new Error('Token address is required');

    const contract = thor.contracts.load(tokenAddress, ERC20__factory.abi);
    const clauses = [
        contract.clause.name(),
        contract.clause.symbol(),
        contract.clause.decimals(),
    ];

    const multipleClausesResponse =
        await thor.contracts.executeMultipleClausesCall(clauses);

    const isSuccess = multipleClausesResponse.every((res) => res.success);
    if (!isSuccess) throw new Error('Failed to get token info');

    const [name, symbol, decimals] = multipleClausesResponse.map(
        (res) => res.result.plain,
    );

    return {
        name,
        address: tokenAddress,
        decimals,
        symbol,
    } as CustomTokenInfo;
};

export const getCustomTokenInfo = (tokenAddress: string) => [
    'VECHAIN_KIT_CUSTOM_TOKEN_BALANCE',
    tokenAddress,
];

export const useGetCustomTokenInfo = (tokenAddress: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCustomTokenInfo(tokenAddress),
        queryFn: async () => getTokenInfo(thor, tokenAddress),
        enabled: !!thor && !!network.type && !!tokenAddress,
    });
};
