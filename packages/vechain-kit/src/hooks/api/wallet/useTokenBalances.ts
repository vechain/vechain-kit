import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useCustomTokens } from '@/hooks';
import { executeMultipleClausesCall } from '@/utils';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network';
import { B3TR__factory, ERC20__factory, VOT3__factory } from '@/contracts';
import { getAccountBalance } from '@/hooks';
import { useQueries } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { formatEther } from 'ethers';

type CustomTokenInfo = {
    name: string;
    address: string;
    decimals: string;
    symbol: string;
};

const getCustomTokenBalances = async (
    thor: ThorClient,
    address: string,
    customTokens: CustomTokenInfo[],
) => {
    const clauses = customTokens.map((token) => {
        const erc20Contract = thor.contracts.load(
            token.address,
            ERC20__factory.abi,
        );
        return erc20Contract.clause.balanceOf([address]);
    });

    const response = await thor.contracts.executeMultipleClausesCall(clauses);

    if (!response.every((r) => r.success && !!r.result.plain)) {
        throw new Error('Failed to get custom token balances');
    }

    return response.map((r, index) => {
        const token = customTokens[index];
        const original = r.result.plain as string;
        const scaled = formatEther(BigInt(original)) || '0';

        return {
            address: token.address,
            symbol: token.symbol,
            balance: scaled,
        };
    });
};

const getTokenBalances = async (
    thor: ThorClient,
    address: string,
    network: NETWORK_TYPE,
) => {
    const config = getConfig(network);

    const [
        b3trBalance = { balance: 0n },
        vot3Balance = { balance: 0n },
        // veDelegateBalance = { balance: 0n },
        // gloDollarBalance = { balance: 0n },
    ] = await executeMultipleClausesCall({
        thor,
        calls: [
            {
                abi: B3TR__factory.abi,
                address: config.b3trContractAddress as `0x${string}`,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            },
            {
                abi: VOT3__factory.abi,
                address: config.vot3ContractAddress as `0x${string}`,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            },
            // {
            //     abi: IERC20__factory.abi,
            //     address: config.veDelegateTokenContractAddress as `0x${string}`,
            //     functionName: 'balanceOf',
            //     args: [address as `0x${string}`],
            // },
            // {
            //     abi: IERC20__factory.abi,
            //     address: config.gloDollarContractAddress as `0x${string}`,
            //     functionName: 'balanceOf',
            //     args: [address as `0x${string}`],
            // },
        ],
    });

    const { balance: vetBalance, energy: vthoBalance } =
        await getAccountBalance(thor, address);

    return [
        {
            address: '0x',
            symbol: 'VET',
            balance: vetBalance.toString(),
        },
        {
            address: config.vthoContractAddress,
            symbol: 'VTHO',
            balance: vthoBalance.toString(),
        },
        {
            address: config.b3trContractAddress,
            symbol: 'B3TR',
            balance: b3trBalance.toString(),
        },
        {
            address: config.vot3ContractAddress,
            symbol: 'VOT3',
            balance: vot3Balance.toString(),
        },
        // {
        //     address: config.veDelegate,
        //     symbol: 'veDelegate',
        //     balance: veDelegateBalance.toString(),
        // },
        // {
        //     address: config.gloDollarContractAddress,
        //     symbol: 'USDGLO',
        //     balance: gloDollarBalance.toString(),
        // },
    ];
};

export const useTokenBalances = (address: string) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();

    const [baseTokenBalancesQuery, customTokenBalancesQuery] = useQueries({
        queries: [
            {
                queryKey: ['base-token-balances', address],
                queryFn: () => getTokenBalances(thor, address, network.type),
            },
            {
                queryKey: ['custom-token-balances', address],
                queryFn: () =>
                    getCustomTokenBalances(thor, address, customTokens),
            },
        ],
    });

    const data = [
        ...(baseTokenBalancesQuery.data ?? []),
        ...(customTokenBalancesQuery.data ?? []),
    ];

    return {
        data,
        loading:
            baseTokenBalancesQuery.isLoading ||
            customTokenBalancesQuery.isLoading,
        error: baseTokenBalancesQuery.error || customTokenBalancesQuery.error,
    };
};
