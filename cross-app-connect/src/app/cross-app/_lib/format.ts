/**
 * Shared display helpers for addresses and amounts. Centralised so the
 * IdentityRow, AddressTag, transact inspect panel, and any future surface
 * format the same way -- no mixed-case `0x2e25…2D1B` etc.
 */

/**
 * Truncate an address to `0xabcdef…1234`. Forces lowercase to avoid the
 * checksum-casing mismatch you get from naïve `slice` (the first 6 and last
 * 4 chars come from different checksum-cased regions of the same address).
 *
 * If you ever want full EIP-55 display, replace this with a checksum
 * formatter (e.g. viem's `getAddress`) -- but keep both halves consistent.
 */
export function truncateAddress(addr?: string | null): string {
    if (!addr) return '';
    const lower = addr.toLowerCase();
    if (lower.length < 12) return lower;
    return `${lower.slice(0, 6)}…${lower.slice(-4)}`;
}
