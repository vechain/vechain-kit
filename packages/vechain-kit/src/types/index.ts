import { LegalDocument } from '@/providers';

export * from './Types';
export * from './ensTextRecords';

export enum LegalDocumentType {
    TERMS = 'terms',
    PRIVACY = 'privacy',
    COOKIES = 'cookies',
}

// Base type for all legal documents (terms, privacy policy, cookies)
export type EnrichedLegalDocument = LegalDocument & {
    id: string;
    documentType: LegalDocumentType;
};

// Agreement record stored in localStorage
export type LegalDocumentAgreement = EnrichedLegalDocument & {
    walletAddress: string;
    timestamp: number;
};
