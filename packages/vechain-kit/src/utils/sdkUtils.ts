/**
 * SDK utilities for handling VeChain SDK module availability
 * Provides centralized error handling for cases where SDK modules might not be loaded
 */

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
 * Validates an address string with proper error handling
 * @param address - The address string to validate
 * @returns boolean indicating if the address is valid
 * @throws {SDKNotAvailableError} if Address module is not available
 */
export function isValidAddress(address: string): boolean {
    const Address = ensureAddress();
    return Address.isValid(address);
}

/**
 * Safe version of Address.isValid that returns false if SDK is not available
 * Useful for conditional checks where throwing is not desired
 * @param address - The address string to validate
 * @returns boolean indicating if the address is valid, false if SDK not available
 */
export function isValidAddressSafe(address: string): boolean {
    try {
        return isValidAddress(address);
    } catch {
        return false;
    }
}
