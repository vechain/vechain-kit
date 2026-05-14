import { useMemo } from 'react';
import { useAppConfig } from '@/providers';
import { useGetTokenUsdPrice } from './useGetTokenUsdPrice';

export type ExchangeRates = {
    eurUsdPrice: number;
    gbpUsdPrice: number;
};

export const useTokenPrices = () => {
    const config = useAppConfig();

    // Fetch base token prices
    const { data: vetUsdPrice, isLoading: vetUsdPriceLoading } =
        useGetTokenUsdPrice('VET');
    const { data: vthoUsdPrice, isLoading: vthoUsdPriceLoading } =
        useGetTokenUsdPrice('VTHO');
    const { data: b3trUsdPrice, isLoading: b3trUsdPriceLoading } =
        useGetTokenUsdPrice('B3TR');
    const { data: eurUsdPrice, isLoading: eurToUsdLoading } =
        useGetTokenUsdPrice('EUR');
    const { data: gbpUsdPrice, isLoading: gbpToUsdLoading } =
        useGetTokenUsdPrice('GBP');

    // Get all prices as a map
    const prices = useMemo(() => {
        const contractAddresses = {
            vet: '0x',
            vtho: config.vthoContractAddress,
            b3tr: config.b3trContractAddress,
            vot3: config.vot3ContractAddress,
            veDelegate: config.veDelegate,
            SASS: config.sassContractAddress,
            vvet: config.vvetContractAddress,
        };

        // Original-cased keys (used by useTokensWithValues against the
        // balances' contract addresses, which are also the raw config values).
        const map: Record<string, number> = {
            [contractAddresses.vet]: vetUsdPrice || 0,
            [contractAddresses.vtho]: vthoUsdPrice || 0,
            [contractAddresses.b3tr]: b3trUsdPrice || 0,
            // VOT3 and veDelegate share the same price feed as B3TR
            [contractAddresses.vot3]: b3trUsdPrice || 0,
            [contractAddresses.veDelegate]: b3trUsdPrice || 0,
            [contractAddresses.SASS]: 0,
        };
        // VVET (wrapped VET) is priced 1:1 with VET
        if (contractAddresses.vvet) {
            map[contractAddresses.vvet] = vetUsdPrice || 0;
        }
        // Mirror with lowercase keys so callers that normalize addresses
        // (e.g. indexer responses) can still resolve a price.
        for (const key of Object.keys(map)) {
            const lower = key.toLowerCase();
            if (lower !== key && map[lower] === undefined) {
                map[lower] = map[key];
            }
        }
        return map;
    }, [
        vetUsdPrice,
        vthoUsdPrice,
        b3trUsdPrice,
        config.vthoContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        config.sassContractAddress,
        config.vvetContractAddress,
    ]);

    const exchangeRates: ExchangeRates = useMemo(
        () => ({
            eurUsdPrice: eurUsdPrice || 1,
            gbpUsdPrice: gbpUsdPrice || 1,
        }),
        [eurUsdPrice, gbpUsdPrice],
    );

    const isLoading =
        vetUsdPriceLoading ||
        vthoUsdPriceLoading ||
        b3trUsdPriceLoading ||
        eurToUsdLoading ||
        gbpToUsdLoading;

    return {
        prices,
        exchangeRates,
        isLoading,
    };
};
