import { describe, expect, it } from 'vitest';
import {
    compareAddresses,
    compareListOfAddresses,
    isValidAddress,
    leftPadWithZeros,
} from './addressUtils';
import {
    addPrefix,
    compare,
    isValid,
    normalize,
    removePrefix,
} from './hexUtils';

const A = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
const B = '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68';

describe('compareAddresses', () => {
    it('is case-insensitive and prefix-tolerant', () => {
        expect(compareAddresses(A, A.toLowerCase())).toBe(true);
        expect(compareAddresses(A, A.toUpperCase().replace('0X', '0x'))).toBe(
            true,
        );
        expect(compareAddresses(A, A.slice(2))).toBe(true);
    });

    it('rejects different, missing or malformed input', () => {
        expect(compareAddresses(A, B)).toBe(false);
        expect(compareAddresses(undefined, A)).toBe(false);
        expect(compareAddresses(A, 'not-hex')).toBe(false);
    });

    it('compares lists irrespective of order and case', () => {
        expect(compareListOfAddresses([A, B], [B.toLowerCase(), A])).toBe(true);
        expect(compareListOfAddresses([A], [A, B])).toBe(false);
        expect(compareListOfAddresses([A, A], [A, B])).toBe(false);
    });
});

describe('isValidAddress / leftPadWithZeros', () => {
    it('validates 20-byte hex addresses', () => {
        expect(isValidAddress(A)).toBe(true);
        expect(isValidAddress(A.slice(0, -1))).toBe(false);
        expect(isValidAddress('')).toBe(false);
    });

    it('pads to a fixed width and refuses longer input', () => {
        expect(leftPadWithZeros('0xabc', 8)).toBe('0x00000abc');
        expect(leftPadWithZeros('abc', 3)).toBe('0xabc');
        expect(() => leftPadWithZeros('0xabcd', 3)).toThrow();
    });
});

describe('hexUtils', () => {
    it('adds, removes and normalizes the 0x prefix', () => {
        expect(addPrefix('ab')).toBe('0xab');
        expect(addPrefix('0Xab')).toBe('0xab');
        expect(removePrefix('0xab')).toBe('ab');
        expect(normalize(' 0XAB ')).toBe('0xab');
        expect(() => addPrefix('zz')).toThrow(
            'Provided hex value is not valid',
        );
    });

    it('validates and compares hex strings', () => {
        expect(isValid('0x')).toBe(false);
        expect(isValid('0xAbC')).toBe(true);
        expect(isValid(null)).toBe(false);
        expect(compare('0xAB', 'ab')).toBe(true);
        expect(compare('0xAB', 'zz')).toBe(false);
    });
});
