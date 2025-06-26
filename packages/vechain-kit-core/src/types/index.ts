export * from './types';
export * from './ensTextRecords';

export enum LegalDocumentType {
    TERMS = 'terms',
    PRIVACY = 'privacy',
    COOKIES = 'cookies',
}

export enum LegalDocumentSource {
    VECHAIN_KIT = 'vechain-kit',
    APPLICATION = 'application',
}

export interface LegalDocument {
    url: string;
    title: string;
    version: string;
}

// Base type for all legal documents (terms, privacy policy, cookies)
export type EnrichedLegalDocument = LegalDocument & {
    id: string;
    documentType: LegalDocumentType;
    documentSource: LegalDocumentSource;
};

// Agreement record stored in localStorage
export type LegalDocumentAgreement = EnrichedLegalDocument & {
    walletAddress: string;
    timestamp: number;
};
