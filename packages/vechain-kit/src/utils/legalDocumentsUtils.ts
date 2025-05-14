import { TermsAndConditions, TermsAndConditionsAgreement } from '@/types';
import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';

const LOCAL_STORAGE_KEY = 'vechain-kit-terms-and-conditions';

/**
 * Generate a unique ID for a term based on its URL and version
 */
export const getTermId = (term: Omit<TermsAndConditions, 'id'>): string => {
    return `term-${term.url.replace(/[^\w-]+/g, '-')}-v${term.version}`;
};

/**
 * Format terms by adding IDs
 */
export const formatTerms = (
    terms: Omit<TermsAndConditions, 'id'>[],
): TermsAndConditions[] => {
    return terms.map((term) => ({
        ...term,
        id: getTermId(term),
    }));
};

/**
 * Get all terms including VeChain Kit terms and custom terms
 */
export const getAllTerms = (
    customTerms: Omit<TermsAndConditions, 'id'>[] = [],
): TermsAndConditions[] => {
    return formatTerms([VECHAIN_KIT_TERMS_CONFIG, ...customTerms]);
};

/**
 * Get only required terms
 */
export const getRequiredTerms = (
    terms: TermsAndConditions[],
): TermsAndConditions[] => {
    return terms.filter((term) => term.required);
};

/**
 * Get agreements from localStorage
 */
export const getStoredAgreements = (): TermsAndConditionsAgreement[] => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
        console.warn('Error reading terms agreements from localStorage', e);
        return [];
    }
};

/**
 * Check if a user has agreed to a specific term
 */
export const hasAgreedToTerm = (
    walletAddress: string | undefined,
    termId: string,
): boolean => {
    if (!walletAddress) return false;

    const agreements = getStoredAgreements();
    return agreements.some(
        (agreement) =>
            compareAddresses(agreement.walletAddress, walletAddress) &&
            agreement.id === termId,
    );
};

/**
 * Get terms that a user has not agreed to
 */
export const getTermsNotAgreed = (
    walletAddress: string | undefined,
    terms: TermsAndConditions[],
): TermsAndConditions[] => {
    if (!walletAddress) return [];

    const agreements = getStoredAgreements();
    return terms.filter(
        (term) =>
            !agreements.some(
                (agreement) =>
                    compareAddresses(agreement.walletAddress, walletAddress) &&
                    agreement.id === term.id,
            ),
    );
};

/**
 * Check if a user has agreed to all required terms
 */
export const hasAgreedToRequiredTerms = (
    walletAddress: string | undefined,
    requiredTerms: TermsAndConditions[] = [],
): boolean => {
    if (!requiredTerms.length || !walletAddress) return true;

    const agreements = getStoredAgreements();
    return requiredTerms.every((term) =>
        agreements.some(
            (agreement) =>
                compareAddresses(agreement.walletAddress, walletAddress) &&
                agreement.id === term.id,
        ),
    );
};

/**
 * Check if a user has agreed to the VeChain Kit terms specifically
 * This function is simplified for direct usage in mixpanel
 */
export const hasAgreedToVeChainKitTerms = (walletAddress?: string): boolean => {
    if (!walletAddress) return false;

    const vkTermId = getTermId(VECHAIN_KIT_TERMS_CONFIG);
    return hasAgreedToTerm(walletAddress, vkTermId);
};
