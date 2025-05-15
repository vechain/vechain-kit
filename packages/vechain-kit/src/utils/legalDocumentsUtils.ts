import {
    EnrichedLegalDocument,
    LegalDocumentAgreement,
    LegalDocumentType,
} from '@/types';
import {
    compareAddresses,
    VECHAIN_KIT_COOKIE_CONFIG,
    VECHAIN_KIT_PRIVACY_CONFIG,
    VECHAIN_KIT_TERMS_CONFIG,
} from '@/utils';

const LOCAL_STORAGE_KEY = 'vechain-kit-legal-documents';

/**
 * Generate a unique ID for a document based on its type, URL and version
 */
export const getDocumentId = (
    document: Omit<EnrichedLegalDocument, 'id'>,
): string => {
    return `${document.documentType}-${document.url.replace(
        /[^\w-]+/g,
        '-',
    )}-v${document.version}`;
};

/**
 * Format documents by adding IDs
 */
export const formatDocuments = (
    documents: Omit<EnrichedLegalDocument, 'id'>[],
): EnrichedLegalDocument[] => {
    return documents.map((document) => ({
        ...document,
        id: getDocumentId(document),
    }));
};

/**
 * Get all documents including VeChain Kit documents and custom documents
 */
export const getAllDocuments = (
    customDocuments: Omit<EnrichedLegalDocument, 'id'>[] | undefined = [],
): EnrichedLegalDocument[] => {
    const vechainKitCookiePolicy = {
        ...VECHAIN_KIT_COOKIE_CONFIG,
        documentType: LegalDocumentType.COOKIES,
    };

    const vechainKitPrivacyPolicy = {
        ...VECHAIN_KIT_PRIVACY_CONFIG,
        documentType: LegalDocumentType.PRIVACY,
    };

    const vechainKitTermsAndConditions = {
        ...VECHAIN_KIT_TERMS_CONFIG,
        documentType: LegalDocumentType.TERMS,
    };
    const vechainKitDocuments = [
        vechainKitCookiePolicy,
        vechainKitPrivacyPolicy,
        vechainKitTermsAndConditions,
    ];

    return formatDocuments([...vechainKitDocuments, ...customDocuments]);
};

/**
 * Get only required documents
 */
export const getRequiredDocuments = (
    documents: EnrichedLegalDocument[],
): EnrichedLegalDocument[] => {
    return documents.filter((document) => document.required);
};

/**
 * Legacy function for backward compatibility
 */
export const getRequiredTerms = (
    terms: EnrichedLegalDocument[],
): EnrichedLegalDocument[] => {
    return getRequiredDocuments(terms);
};

/**
 * Get agreements from localStorage (with fallback to legacy storage)
 */
export const getStoredAgreements = (): LegalDocumentAgreement[] => {
    try {
        // Try new storage format first
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }

        return [];
    } catch (e) {
        console.warn(
            'Error reading legal document agreements from localStorage',
            e,
        );
        return [];
    }
};

/**
 * Check if a user has agreed to a specific document
 */
export const hasAgreedToDocument = (
    walletAddress: string | undefined,
    documentId: string,
): boolean => {
    if (!walletAddress) return false;

    const agreements = getStoredAgreements();
    return agreements.some(
        (agreement) =>
            compareAddresses(agreement.walletAddress, walletAddress) &&
            agreement.id === documentId,
    );
};

/**
 * Legacy function for backward compatibility
 */
export const hasAgreedToTerm = (
    walletAddress: string | undefined,
    termId: string,
): boolean => {
    return hasAgreedToDocument(walletAddress, termId);
};

/**
 * Get documents that a user has not agreed to
 */
export const getDocumentsNotAgreed = (
    walletAddress: string | undefined,
    documents: EnrichedLegalDocument[],
): EnrichedLegalDocument[] => {
    if (!walletAddress) return [];

    const agreements = getStoredAgreements();
    return documents.filter(
        (document) =>
            !agreements.some(
                (agreement) =>
                    compareAddresses(agreement.walletAddress, walletAddress) &&
                    agreement.id === document.id,
            ),
    );
};

/**
 * Check if a user has agreed to all required documents
 */
export const hasAgreedToRequiredDocuments = (
    walletAddress: string | undefined,
    requiredDocuments: EnrichedLegalDocument[] = [],
): boolean => {
    if (!requiredDocuments.length || !walletAddress) return true;

    const agreements = getStoredAgreements();
    return requiredDocuments.every((document) =>
        agreements.some(
            (agreement) =>
                compareAddresses(agreement.walletAddress, walletAddress) &&
                agreement.id === document.id,
        ),
    );
};

/**
 * Check if a user has agreed to the VeChain Kit terms specifically
 * This function is simplified for direct usage in mixpanel
 */
export const hasAgreedToVeChainKitTerms = (walletAddress?: string): boolean => {
    if (!walletAddress) return false;

    const vkTermId = getDocumentId({
        ...VECHAIN_KIT_TERMS_CONFIG,
        documentType: LegalDocumentType.TERMS,
    });
    return hasAgreedToDocument(walletAddress, vkTermId);
};
