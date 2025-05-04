import { ExchangeRates } from '@/hooks/api/wallet/useTokenPrices';

export type SupportedCurrency = 'usd' | 'eur' | 'gbp';

export const convertToSelectedCurrency = (
    amountUsd: number,
    currency: SupportedCurrency,
    exchangeRates: ExchangeRates,
): number => {
    switch (currency) {
        case 'eur':
            return amountUsd / exchangeRates.eurUsdPrice;
        case 'gbp':
            return amountUsd / exchangeRates.gbpUsdPrice;
        default:
            return amountUsd;
    }
};

export const formatCurrencyValue = (
    value: number,
    currency: SupportedCurrency,
    options?: Intl.NumberFormatOptions,
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
    };

    return new Intl.NumberFormat('en-US', defaultOptions).format(value);
};

export const formatCompactCurrency = (
    value: number,
    currency: SupportedCurrency,
): string => {
    return formatCurrencyValue(value, currency, {
        notation: 'compact',
        compactDisplay: 'short',
    });
};
