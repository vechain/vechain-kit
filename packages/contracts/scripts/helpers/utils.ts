import { address } from "thor-devkit";
import crypto from "crypto";

const PREFIX = "0x";
const PREFIX_REGEX = /^0[xX]/;
const HEX_REGEX = /^(0[xX])?[a-fA-F0-9]+$/;

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
  address2?: string
): boolean => {
  if (!address1 || !address2) return false;

  if (address2 === address1) {
    return true;
  }

  try {
    return normalize(address1) === normalize(address2);
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

export const isValid = (addr: string | undefined | null): boolean => {
  try {
    if (typeof addr !== "string") return false;
    address.toChecksumed(addPrefix(addr));
    return true;
  } catch (e) {
    return false;
  }
};

export const leftPadWithZeros = (str: string, length: number): string => {
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  // Remove '0x' prefix if it exists
  const cleanStr = str.startsWith("0x") ? str.slice(2) : str;
  if (cleanStr.length > length) {
    throw new Error("Input string is longer than the specified length");
  }
  // Pad the string to the specified length
  const paddedStr = cleanStr.padStart(length, "0");
  return `0x${paddedStr}`;
};

/**
 * Returns the provied hex string with the hex prefix removed.
 * If the prefix doesn't exist the hex is returned unmodified
 * @param hex - the input hex string
 * @returns the input hex string with the hex prefix removed
 * @throws an error if the input is not a valid hex string
 */
export const removePrefix = (hex: string): string => {
  validate(hex);
  return hex.replace(PREFIX_REGEX, "");
};

/**
 * Returns the provided hex string with the hex prefix added.
 * If the prefix already exists the string is returned unmodified.
 * If the string contains an UPPER case `X` in the prefix it will be replaced with a lower case `x`
 * @param hex - the input hex string
 * @returns the input hex string with the hex prefix added
 * @throws an error if the input is not a valid hex string
 */
export const addPrefix = (hex: string): string => {
  validate(hex);
  return PREFIX_REGEX.test(hex)
    ? hex.replace(PREFIX_REGEX, PREFIX)
    : `${PREFIX}${hex}`;
};

/**
 * Validate the hex string. Throws an Error if not valid
 * @param hex - the input hex string
 * @throws an error if the input is not a valid hex string
 */
export const validate = (hex: string) => {
  if (!isValidHex(hex)) throw Error("Provided hex value is not valid");
};

/**
 * Check if input string is valid
 * @param hex - the input hex string
 * @returns boolean representing whether the input hex is valid
 */
export const isValidHex = (hex?: string | null): boolean => {
  return !!hex && HEX_REGEX.test(hex);
};

export const isInvalid = (hex?: string | null): boolean => {
  return !isValidHex(hex);
};

export const normalize = (hex: string): string => {
  return addPrefix(hex.toLowerCase().trim());
};

export const compare = (hex1: string, hex2: string): boolean => {
  try {
    return (
      removePrefix(hex1).toLowerCase() === removePrefix(hex2).toLowerCase()
    );
  } catch (e) {
    return false;
  }
};

/**
 * Generate a random hex string of the defined length
 * @param size - the length of the random hex output
 * @returns a random hex string of length `size`
 */
export const generateRandom = (size: number): string => {
  if (size < 1) throw Error("Size must be > 0");
  const randBuffer = crypto.randomBytes(Math.ceil(size / 2));
  if (!randBuffer) throw Error("Failed to generate random hex");
  return `${PREFIX}${randBuffer.toString("hex").substring(0, size)}`;
};
