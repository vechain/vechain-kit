export * from './providers';
export * from './types';
export * from './config';
export * from './hooks';
export * from './components';

/**
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 * By default, BigInt values cannot be serialized to JSON and will throw an error:
 * "TypeError: Do not know how to serialize a BigInt"
 *
 * This adds a toJSON method to BigInt prototype to allow serialization while preserving
 * the original BigInt type for contract call arguments. This enables proper type checking
 * of contract calls while still allowing BigInt values to be safely serialized.
 */
declare global {
    interface BigInt {
        toJSON(): { $bigint: string };
    }
}

BigInt.prototype.toJSON = function () {
    return { $bigint: this.toString() };
};
