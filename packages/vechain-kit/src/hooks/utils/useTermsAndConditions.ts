import {
    LegalDocument,
    useVeChainKitConfig,
} from '@/providers/VeChainKitProvider';
import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';
import { useCallback, useMemo } from 'react';

import { useWallet } from '../api/wallet';
import { useSyncableLocalStorage } from '../cache';

export type TermsAndConditions = LegalDocument & {
    id: string;
};

export type TermsAndConditionsAgreement = TermsAndConditions & {
    walletAddress: string;
    timestamp: number;
};

export const useTermsAndConditions = () => {
    const { account } = useWallet();
    const { legalDocuments } = useVeChainKitConfig();

    const [
        termsAndConditions,
        setTermsAndConditions,
        syncAgreements,
        getAgreementsFromStorage,
    ] = useSyncableLocalStorage<TermsAndConditionsAgreement[]>(
        'vechain-kit-terms-and-conditions',
        [],
    );

    const getTermId = (term: LegalDocument) => {
        return `term-${term.url.replace(/[^\w-]+/g, '-')}-v${term.version}`;
    };

    const formatTerms = useCallback(
        (terms: LegalDocument[]) => {
            return terms.map((term) => ({ ...term, id: getTermId(term) }));
        },
        [getTermId],
    );

    const allTerms = useMemo(() => {
        return formatTerms([
            VECHAIN_KIT_TERMS_CONFIG,
            ...(legalDocuments?.termsAndConditions ?? []),
        ]);
    }, [legalDocuments, formatTerms]);

    const requiredTerms = useMemo(() => {
        return allTerms?.filter((term) => term.required);
    }, [allTerms]);

    const allTermsNotAccepted = useMemo(() => {
        return allTerms?.filter(
            (term) =>
                !getAgreementsFromStorage().some(
                    (saved) =>
                        compareAddresses(
                            saved.walletAddress,
                            account?.address,
                        ) && saved.id === term.id,
                ),
        );
    }, [allTerms, account?.address]);

    const hasAcceptedAllRequiredTerms = useMemo(() => {
        if (!requiredTerms?.length || !account?.address) return true;

        return requiredTerms.every((required) =>
            getAgreementsFromStorage().some(
                (saved) =>
                    compareAddresses(saved.walletAddress, account?.address) &&
                    saved.id === required.id,
            ),
        );
    }, [requiredTerms, account?.address]);

    const agreeToTerms = (terms: TermsAndConditions | TermsAndConditions[]) => {
        if (!account?.address) return;

        const termsArray = Array.isArray(terms) ? terms : [terms];
        if (termsArray.length === 0) return;

        const timestamp = new Date().getTime();
        const newAgreements = termsArray.map((term) => ({
            id: term.id,
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
                !termsArray.some((term) => term.id === saved.id),
        );

        const updatedAgreements = [...filteredAgreements, ...newAgreements];
        setTermsAndConditions(updatedAgreements);
    };

    return {
        termsAndConditions,
        agreeToTerms,
        hasAgreedToTerms: hasAcceptedAllRequiredTerms,
        allTerms,
        allTermsNotAccepted,
        getTermId,
        syncAgreements,
    };
};
