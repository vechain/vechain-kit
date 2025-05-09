export type TermsAndConditions = {
    url: string;
    version: number;
    required: boolean;
    displayName?: string;
    id: string;
};

export type TermsAndConditionsAgreement = TermsAndConditions & {
    walletAddress: string;
    timestamp: number;
};
