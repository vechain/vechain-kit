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
