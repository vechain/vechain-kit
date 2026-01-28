import { useQuery } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import { OracleVechainEnergy__factory } from '@vechain/vechain-contract-types';
import { BigNumber } from 'bignumber.js';
import { getConfig } from '../../../config';
import { useVeChainKitConfig } from '../../../providers';
import { NETWORK_TYPE } from '../../../config/network';
import { ThorClient } from '@vechain/sdk-network';

// Create an enum or object for supported price feed IDs
export const PRICE_FEED_IDS = {
    B3TR: '0x623374722d757364000000000000000000000000000000000000000000000000',
    VET: '0x7665742d75736400000000000000000000000000000000000000000000000000',
    VTHO: '0x7674686f2d757364000000000000000000000000000000000000000000000000',
    GBP: '0x6762702d75736400000000000000000000000000000000000000000000000000',
    EUR: '0x657572742d757364000000000000000000000000000000000000000000000000',
} as const;

export type SupportedToken = keyof typeof PRICE_FEED_IDS;

// Rename and make the function generic
export const getTokenUsdPrice = async (
    thor: ThorClient,
    token: SupportedToken,
    network: NETWORK_TYPE,
): Promise<number> => {
    const res = await thor.contracts
        .load(
            getConfig(network).oracleContractAddress,
            OracleVechainEnergy__factory.abi,
        )
        .read.getLatestValue(PRICE_FEED_IDS[token]);

    if (!res) throw new Error(`Failed to get price of ${token}`);

    return new BigNumber(res[0].toString()).div(1e12).toNumber() as number;
};

export const getTokenUsdPriceQueryKey = (token: SupportedToken) => [
    'VECHAIN_KIT_PRICE',
    token,
];

export const useGetTokenUsdPrice = (token: SupportedToken) => {
    const thor = useThor();
    const { network } = useVeChainKitConfig();

    return useQuery({
        queryKey: getTokenUsdPriceQueryKey(token),
        queryFn: async () => getTokenUsdPrice(thor, token, network.type),
        enabled: !!thor && !!network.type,
        retry: (failureCount, error) => {
            // Don't retry on cancellation errors
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
                    return false;
                }
            }
            // Retry network errors up to 2 times
            return failureCount < 2;
        },
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 60, // 1 minute
    });
};
