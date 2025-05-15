import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';
import { ERC20__factory } from '@/contracts';
import { useVeChainKitConfig } from '@/providers';
import { ThorClient } from '@vechain/sdk-network1.2';

export type CustomTokenInfo = {
    name: string;
    address: string;
    decimals: string;
    symbol: string;
};

export const getTokenInfo = async (
    thor: ThorClient,
    tokenAddress: string,
): Promise<CustomTokenInfo> => {
    if (!tokenAddress) throw new Error('Token address is required');

    const contract = thor.contracts.load(tokenAddress, ERC20__factory.abi);
    const response = await thor.contracts.executeMultipleClausesCall([
        contract.clause.name(),
        contract.clause.symbol(),
        contract.clause.decimals(),
    ]);

    if (response.every((r) => r.success) === false) {
        throw new Error(`Failed to get token info of ${tokenAddress}`);
    }

    const [name, symbol, decimals] = response.map((res) => {
        return res.result.array?.[0] as string;
    });

    return {
        name,
        address: tokenAddress,
        decimals,
        symbol,
    };
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
        queryFn: async () =>
            getTokenInfo(thor as unknown as ThorClient, tokenAddress),
        enabled: !!thor && !!network.type && !!tokenAddress,
    });
};
