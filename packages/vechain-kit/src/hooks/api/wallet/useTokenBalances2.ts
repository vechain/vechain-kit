import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { CustomTokenInfo, useCustomTokens } from '@/hooks';
import { NETWORK_TYPE } from '@/config/network';
import { ThorClient } from '@vechain/sdk-network1.2';
import { IB3TR__factory, IERC20__factory, IVOT3__factory } from '@/contracts';
import { getAccountBalance } from '@/hooks';
import { useQueries } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';
import { formatEther } from 'ethers';

const getCustomTokenBalances = async (
    thor: ThorClient,
    address: string,
    customTokens: CustomTokenInfo[],
) => {
    const clauses = customTokens.map((token) => {
        const erc20Contract = thor.contracts.load(
            token.address,
            IERC20__factory.abi,
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

    const b3trContract = thor.contracts.load(
        config.b3trContractAddress,
        IB3TR__factory.abi,
    );
    const vot3Contract = thor.contracts.load(
        config.vot3ContractAddress,
        IVOT3__factory.abi,
    );
    const veDelegateContract = thor.contracts.load(
        config.veDelegate,
        IERC20__factory.abi,
    );
    const gloDollarContract = thor.contracts.load(
        config.gloDollarContractAddress,
        IERC20__factory.abi,
    );

    const { balance: vetBalance, energy: vthoBalance } =
        await getAccountBalance(thor, address);

    const response = await thor.contracts.executeMultipleClausesCall([
        b3trContract.clause.balanceOf(address),
        vot3Contract.clause.balanceOf(address),
        veDelegateContract.clause.balanceOf(address),
        gloDollarContract.clause.balanceOf(address),
    ]);

    if (!response.every((r) => r.success))
        throw new Error('Failed to get token balances');

    const [b3trBalance, vot3Balance, veDelegateBalance, gloDollarBalance] =
        response.map((r) => r.result.plain as string);

    return [
        {
            address: '0x',
            symbol: 'VET',
            balance: vetBalance,
        },
        {
            address: config.vthoContractAddress,
            symbol: 'VTHO',
            balance: vthoBalance,
        },
        {
            address: config.b3trContractAddress,
            symbol: 'B3TR',
            balance: b3trBalance,
        },
        {
            address: config.vot3ContractAddress,
            symbol: 'VOT3',
            balance: vot3Balance,
        },
        {
            address: config.veDelegate,
            symbol: 'veDelegate',
            balance: veDelegateBalance,
        },
        {
            address: config.gloDollarContractAddress,
            symbol: 'USDGLO',
            balance: gloDollarBalance,
        },
    ];
};

export const useTokenBalances2 = ({ address }: { address: string }) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const { customTokens } = useCustomTokens();

    return useQueries({
        queries: [
            {
                queryKey: ['base-token-balances', address],
                queryFn: () =>
                    getTokenBalances(
                        thor as unknown as ThorClient,
                        address,
                        network.type,
                    ),
            },
            {
                queryKey: ['custom-token-balances', address],
                queryFn: () =>
                    getCustomTokenBalances(
                        thor as unknown as ThorClient,
                        address,
                        customTokens,
                    ),
            },
        ],
        combine: (data) => {
            return {
                data: data.flat(),
                loading: data[0].isLoading || data[1].isLoading,
                error: data[0].error || data[1].error,
            };
        },
    });
};
