export * from './types';
export * from './ensTextRecords';
export * from './gasToken';
export * from './gasEstimation';

import { LegalDocument } from '@/providers';

export enum LegalDocumentType {
    TERMS = 'terms',
    PRIVACY = 'privacy',
    COOKIES = 'cookies',
}

export enum LegalDocumentSource {
    VECHAIN_KIT = 'vechain-kit',
    APPLICATION = 'application',
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
