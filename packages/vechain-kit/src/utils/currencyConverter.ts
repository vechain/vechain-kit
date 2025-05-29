import { ExchangeRates } from '@/hooks/api/wallet/useTokenPrices';
import i18n, { bcp47LanguageCodes } from '@i18n';

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
    lng = 'en',
    options?: Intl.NumberFormatOptions,
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currency: options?.currency ?? 'usd',
        ...options,
    };

    return new Intl.NumberFormat(bcp47LanguageCodes[lng], defaultOptions).format(value);
};

export const formatCompactCurrency = (
    value: number,
    options?: Intl.NumberFormatOptions,
): string => {
    return formatCurrencyValue(
        value,
        i18n.resolvedLanguage,
        {
            notation: 'compact',
            compactDisplay: 'short',
            currency: options?.currency ?? 'usd',
            ...options,
        },
    );
};