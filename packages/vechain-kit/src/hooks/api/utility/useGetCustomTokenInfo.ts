import { useQuery } from '@tanstack/react-query';
import { ERC20__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { type ThorClient } from '@vechain/sdk-network';
import { useThor } from '@vechain/dapp-kit-react';

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

    // Load the contract using the thor client and the ERC20_ABI
    const contract = thor.contracts.load(tokenAddress, ERC20__factory.abi);

    // Create clauses for all function calls
    const clauses = [
        contract.clause.name(),
        contract.clause.symbol(),
        contract.clause.decimals(),
    ];

    // Execute multiple clauses in a single call
    const infoResponse = await thor.contracts.executeMultipleClausesCall(
        clauses,
    );

    // Extract the results - they're already decoded
    const name = infoResponse[0].result.plain;
    const symbol = infoResponse[1].result.plain;
    const decimals = infoResponse[2].result.plain;

    return {
        name: name as string,
        address: tokenAddress,
        decimals: decimals as string,
        symbol: symbol as string,
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
        queryFn: async () => getTokenInfo(thor, tokenAddress),
        enabled: !!thor && !!network.type && !!tokenAddress,
    });
};
