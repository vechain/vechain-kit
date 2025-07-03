import * as HexUtils from './hexUtils';
import { Address, type Address as AddressType } from '@vechain/sdk-core';

/**
 * Error thrown when SDK modules are not available
 */
export class SDKNotAvailableError extends Error {
    constructor(moduleName: string) {
        super(
            `@vechain/sdk-${moduleName} is not properly loaded. ` +
                `Please ensure all dependencies are installed and bundled correctly.`,
        );
        this.name = 'SDKNotAvailableError';
    }
}

/**
 * Ensures the Address module is available and returns it
 * @throws {SDKNotAvailableError} if Address module is not available
 */
export function ensureAddress(): typeof Address {
    if (!Address || typeof Address.of !== 'function') {
        throw new SDKNotAvailableError('core (Address)');
    }

    return Address;
}

/**
 * Creates an Address instance from a string with proper error handling
 * @param address - The address string to convert
 * @returns Address instance
 * @throws {SDKNotAvailableError} if Address module is not available
 */
export function createAddress(address: string): AddressType {
    const Address = ensureAddress();
    return Address.of(address);
}

/**
 * Checks if two addresses are equal. Returns true if both values are strings AND:
 *  - The two values are equal OR
 *  - The checksumed addresses are equal
 *
 * @param address1
 * @param address2
 */
export const compareAddresses = (
    address1?: string,
    address2?: string,
): boolean => {
    if (!address1 || !address2) return false;

    if (address2 === address1) {
        return true;
    }

    try {
        return HexUtils.normalize(address1) === HexUtils.normalize(address2);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
};

export const compareListOfAddresses = (add1: string[], add2: string[]) => {
    if (add1.length !== add2.length) return false;
    const sortedAdd1 = [...add1]
        .map((e) => e.toLowerCase())
        .sort((a, b) => a.localeCompare(b));
    const sortedAdd2 = [...add2]
        .map((e) => e.toLowerCase())
        .sort((a, b) => a.localeCompare(b));

    for (let i = 0; i < sortedAdd1.length; i++) {
        if (!compareAddresses(sortedAdd1[i], sortedAdd2[i])) return false;
    }

    return true;
};

export const regexPattern = () => {
    return /^0x[a-fA-F0-9]{40}$/;
};

export const isValidAddress = Address.isValid;

export const leftPadWithZeros = (str: string, length: number): string => {
    // Remove '0x' prefix if it exists
    const cleanStr = str.startsWith('0x') ? str.slice(2) : str;
    if (cleanStr.length > length) {
        throw new Error('Input string is longer than the specified length');
    }
    // Pad the string to the specified length
    const paddedStr = cleanStr.padStart(length, '0');
    return `0x${paddedStr}`;
};
