/**
 * Validate IPFS URI strings. An example of a valid IPFS URI is:
 * - ipfs://QmfSTia1TJUiKQ2fyW9NTPzEKNdjMGzbUgrC3QPSTpkum6/406.json
 * - ipfs://QmVPqKfwRXjg5Fqwy6RNRbKR2ZP4pKKVLvmfjmhQfdM3MH/4
 * - ipfs://QmVPqKfwRXjg5Fqwy6RNRbKR2ZP4pKKVLvmfjmhQfdM3MH
 * @param uri
 * @returns
 */
export const validateIpfsUri = (uri: string): boolean => {
    const trimmedUri = uri.trim();
    return /^ipfs:\/\/[a-zA-Z0-9]+(\/[^/]+)*\/?$/.test(trimmedUri);
};

/**
 * Converts a CID to an IPFS native URL.
 *
 * @param cid - The CID to convert.
 * @param fileName - The name of the file to append to the URL.
 *
 * @returns The IPFS URL in the format `ipfs://${cid}/${fileName}`.
 */
export function toIPFSURL(cid: string, fileName?: string): string {
    return `ipfs://${cid}/${fileName ?? ''}`;
}
