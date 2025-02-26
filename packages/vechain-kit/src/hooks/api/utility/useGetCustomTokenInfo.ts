import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { ERC20__factory } from '../../../contracts/typechain-types';
import { useVeChainKitConfig } from '@/providers';
import { abi } from 'thor-devkit';

const ERC20Interface = ERC20__factory.createInterface();

export type CustomTokenInfo = {
    name: string;
    address: string;
    decimals: string;
    symbol: string;
};

export const getTokenInfo = async (
    thor: Connex.Thor,
    tokenAddress: string,
): Promise<CustomTokenInfo> => {
    if (!tokenAddress) throw new Error('Token address is required');

    // Define the function fragments for name, symbol, decimals
    const nameFragment = ERC20Interface.getFunction('name').format('json');
    const symbolFragment = ERC20Interface.getFunction('symbol').format('json');
    const decimalsFragment =
        ERC20Interface.getFunction('decimals').format('json');

    // Get the ABI for the function fragments
    const nameAbi = new abi.Function(JSON.parse(nameFragment));
    const symbolAbi = new abi.Function(JSON.parse(symbolFragment));
    const decimalsAbi = new abi.Function(JSON.parse(decimalsFragment));

    const abis = [nameAbi, symbolAbi, decimalsAbi];
    // Create clauses for all function calls
    const clauses = abis.map((funcAbi) => ({
        to: tokenAddress,
        value: 0,
        data: funcAbi.encode(),
    }));

    const infoResponse = await thor.explain(clauses).execute();

    // Decode responses using the correct ABI
    const [name, symbol, decimals] = infoResponse.map((res, index) => {
        const functionAbi = abis[index];
        return functionAbi.decode(res.data)[0];
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
    const { thor } = useConnex();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getCustomTokenInfo(tokenAddress),
        queryFn: async () => getTokenInfo(thor, tokenAddress),
        enabled: !!thor && !!network.type && !!tokenAddress,
    });
};
