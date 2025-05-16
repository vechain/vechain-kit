import {
    EnrichedLegalDocument,
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import {
    compareAddresses,
    VECHAIN_KIT_COOKIE_CONFIG,
    VECHAIN_KIT_PRIVACY_CONFIG,
    VECHAIN_KIT_TERMS_CONFIG,
} from '@/utils';

export const LEGAL_DOCS_LOCAL_STORAGE_KEY = 'vechain-kit-legal-documents';

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
        documentSource: LegalDocumentSource.VECHAIN_KIT,
    };

    const vechainKitPrivacyPolicy = {
        ...VECHAIN_KIT_PRIVACY_CONFIG,
        documentType: LegalDocumentType.PRIVACY,
        documentSource: LegalDocumentSource.VECHAIN_KIT,
    };

    const vechainKitTermsAndConditions = {
        ...VECHAIN_KIT_TERMS_CONFIG,
        documentType: LegalDocumentType.TERMS,
        documentSource: LegalDocumentSource.VECHAIN_KIT,
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
 * Get agreements from localStorage
 */
export const getStoredAgreements = (): LegalDocumentAgreement[] => {
    try {
        // Try new storage format first
        const storedData = localStorage.getItem(LEGAL_DOCS_LOCAL_STORAGE_KEY);
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
 * Check if a user has agreed to the VeChain Kit cookie policy specifically
 * This function is simplified for direct usage in mixpanel
 */
export const hasAgreedToVeChainKitCookiePolicy = (
    walletAddress?: string,
): boolean => {
    if (!walletAddress) return false;

    const vkTermId = getDocumentId({
        ...VECHAIN_KIT_COOKIE_CONFIG,
        documentType: LegalDocumentType.COOKIES,
        documentSource: LegalDocumentSource.VECHAIN_KIT,
    });
    return hasAgreedToDocument(walletAddress, vkTermId);
};
