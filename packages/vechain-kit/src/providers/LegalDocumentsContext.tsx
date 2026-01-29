/**
 * Legal Documents Context
 *
 * This file contains the context and hook for legal documents.
 * Extracted from LegalDocumentsProvider to avoid circular dependencies
 * when components import useLegalDocuments.
 */

import { createContext, useContext } from 'react';
import type { EnrichedLegalDocument, LegalDocumentAgreement } from '../types';

export type LegalDocumentsContextType = {
    hasAgreedToRequiredDocuments: boolean;
    agreements: LegalDocumentAgreement[];
    walletAddress?: string;
    documents: EnrichedLegalDocument[];
    documentsNotAgreed: EnrichedLegalDocument[];
};

export const LegalDocumentsContext = createContext<
    LegalDocumentsContextType | undefined
>(undefined);

export const useLegalDocuments = () => {
    const context = useContext(LegalDocumentsContext);
    if (!context) {
        // This fallback is used to avoid errors when the context is not available
        return {
            hasAgreedToRequiredDocuments: true,
            agreements: [],
            walletAddress: undefined,
            documents: [],
            documentsNotAgreed: [],
        };
    }
    return context;
};
