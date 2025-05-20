import { EnrichedLegalDocument, LegalDocumentAgreement } from '@/types';
import { compareAddresses } from '@/utils';

export const LEGAL_DOCS_LOCAL_STORAGE_KEY = 'vechain-kit-legal-documents';
export const LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY =
    'vechain-kit-legal-documents-optional-reject';
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
    return formatDocuments(customDocuments);
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
 * Get only optional documents
 */
export const getOptionalDocuments = (
    documents: EnrichedLegalDocument[],
): EnrichedLegalDocument[] => {
    return documents.filter((document) => !document.required);
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
 * Get rejected optional documents from localStorage
 */
export const getStoredRejectedDocuments = (): LegalDocumentAgreement[] => {
    try {
        const storedData = localStorage.getItem(
            LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY,
        );
        if (storedData) {
            return JSON.parse(storedData);
        }

        return [];
    } catch (e) {
        console.warn(
            'Error reading rejected legal document agreements from localStorage',
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
    const rejections = getStoredRejectedDocuments();

    return documents.filter((document) => {
        // Filter out documents that have been agreed to
        const isAgreed = agreements.some(
            (agreement) =>
                compareAddresses(agreement.walletAddress, walletAddress) &&
                agreement.id === document.id,
        );

        if (isAgreed) return false;

        // Filter out optional documents that have been explicitly rejected
        const isRejected = rejections.some(
            (rejection) =>
                compareAddresses(rejection.walletAddress, walletAddress) &&
                rejection.id === document.id,
        );

        if (isRejected) return false;

        // Keep the document if it's neither agreed nor rejected
        return true;
    });
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
 * Create document records for a user
 */
export const createDocumentRecords = (
    docs: EnrichedLegalDocument[],
    walletAddress: string,
) => {
    const timestamp = Date.now();
    return docs.map((doc) => ({
        ...doc,
        walletAddress,
        timestamp,
    }));
};
