import { Address } from '@vechain/sdk-core';

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
        return (
            Address.of(address1).toString() === Address.of(address2).toString()
        );
    } catch {
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
