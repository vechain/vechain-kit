import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';
import { useMemo, useState, useEffect } from 'react';
import { useWallet } from '../api/wallet';
import {
    LegalDocument,
    useVeChainKitConfig,
} from '@/providers/VeChainKitProvider';

export type TermsAndConditionsAgreement = LegalDocument & {
    walletAddress: string;
    timestamp: number;
};

const STORAGE_KEY = 'vechain-kit-terms-and-conditions';

// Helper to safely get agreements from localStorage
const getAgreementsFromStorage = (): TermsAndConditionsAgreement[] => {
    if (typeof window === 'undefined') return [];

    try {
        const storedData = window.localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Error reading terms from localStorage:', error);
        return [];
    }
};

// Helper to safely save agreements to localStorage
const saveAgreementsToStorage = (
    agreements: TermsAndConditionsAgreement[],
): void => {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
    } catch (error) {
        console.error('Error saving terms to localStorage:', error);
    }
};

export const useTermsAndConditions = () => {
    const { account } = useWallet();
    const { legalDocuments } = useVeChainKitConfig();

    // Local state to track agreements
    const [termsAndConditions, setTermsAndConditionsState] = useState<
        TermsAndConditionsAgreement[]
    >([]);

    // Load agreements from localStorage on initial mount and when account changes
    useEffect(() => {
        const storedAgreements = getAgreementsFromStorage();
        setTermsAndConditionsState(storedAgreements);
    }, [account?.address]);

    // Helper to update both state and localStorage
    const setTermsAndConditions = (
        newAgreements: TermsAndConditionsAgreement[],
    ) => {
        setTermsAndConditionsState(newAgreements);
        saveAgreementsToStorage(newAgreements);
    };

    // Force sync with localStorage
    const syncWithStorage = () => {
        const agreements = getAgreementsFromStorage();
        setTermsAndConditionsState(agreements);
    };

    const allTerms = useMemo(() => {
        return [
            VECHAIN_KIT_TERMS_CONFIG,
            ...(legalDocuments?.termsOfService ?? []),
        ];
    }, [legalDocuments]);

    const requiredTerms = useMemo(() => {
        return allTerms?.filter((term) => term.required);
    }, [allTerms]);

    const allTermsNotAccepted = useMemo(() => {
        return allTerms?.filter(
            (term) =>
                !termsAndConditions.some(
                    (saved) =>
                        compareAddresses(
                            saved.walletAddress,
                            account?.address,
                        ) &&
                        saved.url === term.url &&
                        saved.version === term.version,
                ),
        );
    }, [allTerms, termsAndConditions, account?.address]);

    const hasAcceptedAllRequiredTerms = useMemo(() => {
        if (!requiredTerms?.length || !account?.address) return true;

        return requiredTerms.every((required) =>
            termsAndConditions.some(
                (saved) =>
                    compareAddresses(saved.walletAddress, account?.address) &&
                    saved.url === required.url &&
                    saved.version === required.version,
            ),
        );
    }, [requiredTerms, termsAndConditions, account?.address]);

    const agreeToTerms = (terms: LegalDocument | LegalDocument[]) => {
        if (!account?.address) return;

        const termsArray = Array.isArray(terms) ? terms : [terms];
        if (termsArray.length === 0) return;

        const timestamp = new Date().getTime();
        const newAgreements = termsArray.map((term) => ({
            walletAddress: account.address as string,
            url: term.url,
            version: term.version,
            required: term.required,
            timestamp,
        }));

        const currentAgreements = getAgreementsFromStorage();

        const filteredAgreements = currentAgreements.filter(
            (saved) =>
                !compareAddresses(saved.walletAddress, account.address) ||
                !termsArray.some(
                    (term) =>
                        term.url === saved.url &&
                        term.version === saved.version,
                ),
        );

        const updatedAgreements = [...filteredAgreements, ...newAgreements];
        setTermsAndConditions(updatedAgreements);
    };

    const getTermId = (term: LegalDocument) => {
        return `term-${term.url.replace(/[^\w-]+/g, '-')}-v${term.version}`;
    };

    return {
        termsAndConditions,
        agreeToTerms,
        hasAgreedToTerms: hasAcceptedAllRequiredTerms,
        allTerms,
        allTermsNotAccepted,
        getTermId,
        syncAgreements: syncWithStorage,
    };
};
