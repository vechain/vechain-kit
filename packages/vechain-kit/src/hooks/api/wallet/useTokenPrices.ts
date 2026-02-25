import { useMemo } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useGetTokenUsdPrice } from './useGetTokenUsdPrice';

export type ExchangeRates = {
    eurUsdPrice: number;
    gbpUsdPrice: number;
};

export const useTokenPrices = () => {
    const { network } = useVeChainKitConfig();
    const config = getConfig(network.type);

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
            USDGLO: config.gloDollarContractAddress,
            SASS: config.sassContractAddress,
        };

        return {
            [contractAddresses.vet]: vetUsdPrice || 0,
            [contractAddresses.vtho]: vthoUsdPrice || 0,
            [contractAddresses.b3tr]: b3trUsdPrice || 0,
            // VOT3 and veDelegate share the same price feed as B3TR
            [contractAddresses.vot3]: b3trUsdPrice || 0,
            [contractAddresses.veDelegate]: b3trUsdPrice || 0,
            [contractAddresses.USDGLO]: 1, // GloDollar is pegged to USD
            [contractAddresses.SASS]: 0, // No price feed available
        };
    }, [
        vetUsdPrice,
        vthoUsdPrice,
        b3trUsdPrice,
        config.vthoContractAddress,
        config.b3trContractAddress,
        config.vot3ContractAddress,
        config.veDelegate,
        config.gloDollarContractAddress,
        config.sassContractAddress,
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
