/**
 * Checks if a string contains common rejection-related terms
 * @param errorMessage The error message to check
 * @returns boolean indicating if the message contains rejection terms
 */
export const isRejectionError = (errorMessage: string): boolean => {
    if (!errorMessage) return false;
    const rejectionTerms = ['rejected', 'cancelled', 'user denied', 'closed'];
    return rejectionTerms.some((term) =>
        errorMessage.toLowerCase().includes(term.toLowerCase()),
    );
};

/**
 * Generates a simple hash from a string using a 32-bit hash algorithm
 * @param input The string to hash
 * @returns A base-36 string representation of the hash
 */
export const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
};
