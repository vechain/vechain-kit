import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
// import { networkConfig } from "@repo/config";
import { IVechainEnergyOracleV1__factory } from '../../../contracts/typechain-types';
import { BigNumber } from 'bignumber.js';
const OracleInterface = IVechainEnergyOracleV1__factory.createInterface();

// Create an enum or object for supported price feed IDs
export const PRICE_FEED_IDS = {
    B3TR: '0x623374722d757364000000000000000000000000000000000000000000000000',
    VET: '0x7665742d75736400000000000000000000000000000000000000000000000000',
    VTHO: '0x7674686f2d757364000000000000000000000000000000000000000000000000',
} as const;

export type SupportedToken = keyof typeof PRICE_FEED_IDS;

// Rename and make the function generic
export const getTokenUsdPrice = async (
    thor: Connex.Thor,
    token: SupportedToken,
): Promise<number> => {
    const functionFragment =
        OracleInterface.getFunction('getLatestValue').format('json');

    const res = await thor
        .account('0x49eC7192BF804Abc289645ca86F1eD01a6C17713')
        .method(JSON.parse(functionFragment))
        .call(PRICE_FEED_IDS[token]);

    if (res.reverted) throw new Error('Reverted');

    return new BigNumber(res.decoded[0]).div(1e12).toNumber() as number;
};

export const getTokenUsdPriceQueryKey = (token: SupportedToken) => [
    `VECHAIN_KIT_${token}_USD_PRICE`,
];

export const useGetTokenUsdPrice = (token: SupportedToken) => {
    const { thor } = useConnex();

    return useQuery({
        queryKey: getTokenUsdPriceQueryKey(token),
        queryFn: async () => getTokenUsdPrice(thor, token),
        enabled: !!thor,
    });
};
