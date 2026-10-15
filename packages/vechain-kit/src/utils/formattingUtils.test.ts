import { describe, expect, it } from 'vitest';
import {
    formatTokenBalance,
    humanAddress,
    humanDomain,
    humanNumber,
    isZero,
} from './formattingUtils';

const ADDRESS = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

describe('humanAddress / humanDomain', () => {
    it('keeps the leading and trailing characters', () => {
        expect(humanAddress(ADDRESS)).toBe('0xf077•••77fa');
        expect(humanAddress(ADDRESS, 4, 6)).toBe('0xf0•••eA77fa');
    });

    it('only truncates domains longer than the budget', () => {
        expect(humanDomain('short.vet')).toBe('short.vet');
        expect(humanDomain('averyveryverylongname.vet')).toBe(
            'averyver•••me.vet',
        );
    });
});

describe('humanNumber', () => {
    it('rounds down to two decimals with thousands separators', () => {
        expect(humanNumber(1234567.899)).toBe('1,234,567.89');
        expect(humanNumber('42')).toBe('42');
        expect(humanNumber(0.5, undefined, 'VET')).toBe('0.50 VET');
    });

    it('shows < 0.01 when a non-zero amount rounds to zero', () => {
        expect(humanNumber(0.0001)).toBe('< 0.01');
        expect(humanNumber(0)).toBe('0');
    });

    it('isZero handles strings, numbers and empty input', () => {
        expect(isZero('0')).toBe(true);
        expect(isZero(0)).toBe(true);
        expect(isZero('0.000001')).toBe(false);
        expect(isZero(undefined)).toBe(false);
    });
});

describe('formatTokenBalance', () => {
    it('scales by the token decimals', () => {
        expect(formatTokenBalance(1_500_000n, 6)).toEqual({
            original: '1500000',
            scaled: '1.5',
            formatted: '1.50',
        });
        expect(formatTokenBalance(10n ** 18n)).toEqual({
            original: '1000000000000000000',
            scaled: '1.0',
            formatted: '1',
        });
    });

    it('falls back to 18 decimals when decimals are not a non-negative integer', () => {
        const expected = formatTokenBalance(10n ** 18n, 18);
        expect(formatTokenBalance(10n ** 18n, -1)).toEqual(expected);
        expect(formatTokenBalance(10n ** 18n, 1.5)).toEqual(expected);
        expect(formatTokenBalance(10n ** 18n, Number.NaN)).toEqual(expected);
    });

    it('reports zero and dust balances', () => {
        expect(formatTokenBalance(0n, 6).formatted).toBe('0');
        expect(formatTokenBalance(1n, 18).formatted).toBe('< 0.01');
    });
});
