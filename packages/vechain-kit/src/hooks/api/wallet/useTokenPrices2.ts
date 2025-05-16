import { PRICE_FEED_IDS, SupportedToken } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { ThorClient } from '@vechain/sdk-network1.2';
import { NETWORK_TYPE } from '@/config/network';
import { IVechainEnergyOracleV1__factory } from '@/contracts';
import { useThor } from '@vechain/dapp-kit-react2';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

const getTokenPrices = async (
    thor: ThorClient,
    tokens: SupportedToken[],
    network: NETWORK_TYPE,
) => {
    const config = getConfig(network);

    const clauses = tokens.map((token) => {
        const oracleContract = thor.contracts.load(
            config.oracleContractAddress,
            IVechainEnergyOracleV1__factory.abi,
        );
        return oracleContract.clause.getLatestValue(PRICE_FEED_IDS[token]);
    });

    const response = await thor.contracts.executeMultipleClausesCall(clauses);

    if (!response.every((r) => r.success && !!r.result.array)) {
        throw new Error('Failed to get token prices');
    }

    return response.map(
        (r) =>
            new BigNumber((r.result.array?.[0] ?? 0).toString())
                .div(1e12)
                .toNumber() as number,
    );
};

const tokens = ['VET', 'VTHO', 'B3TR', 'EUR', 'GBP'] as SupportedToken[];

// TODO: migration check if we can remove hooks inside and bundle this into one query using thor.transactions.executeMultipleClausesCall
export const useTokenPrices2 = () => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();
    const config = getConfig(network.type);

    return useQuery({
        queryKey: ['token-prices', network.type],
        queryFn: () =>
            getTokenPrices(thor as unknown as ThorClient, tokens, network.type),
        select: (data) => {
            const [
                vetUsdPrice,
                vthoUsdPrice,
                b3trUsdPrice,
                eurUsdPrice,
                gbpUsdPrice,
            ] = data;

            const prices = {
                '0x': vetUsdPrice || 0,
                [config.vthoContractAddress]: vthoUsdPrice || 0,
                [config.b3trContractAddress]: b3trUsdPrice || 0,
                [config.vot3ContractAddress]: b3trUsdPrice || 0,
                [config.veDelegate]: b3trUsdPrice || 0,
                [config.gloDollarContractAddress]: 1, // GloDollar is pegged to USD
            };

            const exchangeRates = {
                eurUsdPrice: eurUsdPrice || 1,
                gbpUsdPrice: gbpUsdPrice || 1,
            };

            return {
                prices,
                exchangeRates,
            };
        },
    });
};
