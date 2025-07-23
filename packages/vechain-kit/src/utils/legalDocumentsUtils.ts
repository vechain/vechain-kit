import { EnrichedLegalDocument, LegalDocumentAgreement } from '@/types';
import { getLocalStorageItem, isBrowser } from './ssrUtils';

export const LEGAL_DOCS_LOCAL_STORAGE_KEY = 'vechain-kit-legal-documents';
export const LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY =
    'vechain-kit-legal-documents-optional-reject';
/**
 * Generate a unique ID for a document based on its type, URL and version
 */
const getDocumentId = (document: Omit<EnrichedLegalDocument, 'id'>): string => {
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
        // Return empty array during SSR
        if (!isBrowser()) {
            return [];
        }

        // Try new storage format first
        const storedData = getLocalStorageItem(LEGAL_DOCS_LOCAL_STORAGE_KEY);
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
        // Return empty array during SSR
        if (!isBrowser()) {
            return [];
        }

        const storedData = getLocalStorageItem(
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
