import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';
import { useWallet } from '@/hooks';
import { useSyncableLocalStorage } from '@/hooks/cache';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { TermsAndConditions, TermsAndConditionsAgreement } from '@/types';
import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';
import { Analytics } from '@/utils/mixpanelClientInstance';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useModal } from './ModalProvider';

type Props = {
    children: Readonly<ReactNode>;
};

type LegalDocumentsContextType = {
    termsAndConditions: {
        hasAgreedToRequiredTerms: boolean;
        agreements: TermsAndConditionsAgreement[];
        walletAddress?: string;
        getTermId: (term: Omit<TermsAndConditions, 'id'>) => string;
        terms: TermsAndConditions[];
        termsNotAgreed: TermsAndConditions[];
    };
};

const LegalDocumentsContext = createContext<
    LegalDocumentsContextType | undefined
>(undefined);

export const useLegalDocuments = () => {
    const context = useContext(LegalDocumentsContext);
    if (!context) {
        throw new Error(
            'useLegalDocuments must be used within LegalDocumentsProvider',
        );
    }
    return context;
};

export const LegalDocumentsProvider = ({ children }: Props) => {
    const { connection, account, disconnect } = useWallet();
    const { legalDocuments } = useVeChainKitConfig();
    const { closeAccountModal, openAccountModal } = useModal();

    const [storedAgreements, setStoredAgreements] = useSyncableLocalStorage<
        TermsAndConditionsAgreement[]
    >('vechain-kit-terms-and-conditions', []);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const getTermId = (term: Omit<TermsAndConditions, 'id'>) =>
        `term-${term.url.replace(/[^\w-]+/g, '-')}-v${term.version}`;

    const formatTerms = useCallback(
        (terms: Omit<TermsAndConditions, 'id'>[]) =>
            terms.map((term) => ({
                ...term,
                id: getTermId(term),
            })),
        [],
    );

    const terms = useMemo(() => {
        return formatTerms([
            VECHAIN_KIT_TERMS_CONFIG,
            ...(legalDocuments?.termsAndConditions ?? []),
        ]);
    }, [legalDocuments, formatTerms]);

    const requiredTerms = useMemo(
        () => terms.filter((term) => term.required),
        [terms],
    );

    const termsNotAgreed = useMemo(() => {
        if (!account?.address) return [];

        return terms.filter(
            (term) =>
                !storedAgreements.some(
                    (saved) =>
                        compareAddresses(
                            saved.walletAddress,
                            account.address,
                        ) && saved.id === term.id,
                ),
        );
    }, [terms, storedAgreements, account?.address]);

    const hasAgreedToRequiredTerms = useMemo(() => {
        if (!requiredTerms.length || !account?.address) return true;

        return requiredTerms.every((term) =>
            storedAgreements.some(
                (saved) =>
                    compareAddresses(saved.walletAddress, account.address) &&
                    saved.id === term.id,
            ),
        );
    }, [requiredTerms, storedAgreements, account?.address]);

    const agreeToTerms = (terms: TermsAndConditions | TermsAndConditions[]) => {
        if (!account?.address) return;
        const termsArray = Array.isArray(terms) ? terms : [terms];
        if (!termsArray.length) return;

        const timestamp = Date.now();
        const newAgreements = termsArray.map((term) => ({
            ...term,
            walletAddress: account.address!,
            timestamp,
        }));

        const filteredAgreements = storedAgreements.filter(
            (saved) =>
                !compareAddresses(saved.walletAddress, account.address) ||
                !termsArray.some((term) => term.id === saved.id),
        );

        const updated = [...filteredAgreements, ...newAgreements];
        setStoredAgreements(updated);
    };

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            setShowTermsModal(!hasAgreedToRequiredTerms);
        } else {
            setShowTermsModal(false);
        }
    }, [connection.isConnected, account?.address, hasAgreedToRequiredTerms]);

    const onBackConfirmLogout = () => {
        closeAccountModal();
        setShowTermsModal(true);
    };

    const handleAgree = (terms: TermsAndConditions | TermsAndConditions[]) => {
        agreeToTerms(terms);
        setShowTermsModal(false);
    };

    const handleLogout = () => {
        disconnect();
        setShowTermsModal(false);
        closeAccountModal();
        Analytics.auth.logoutCompleted();
    };

    const handleCancel = () => {
        Analytics.auth.trackAuth('disconnect_initiated');
        setShowTermsModal(false);
        openAccountModal({
            type: 'disconnect-confirm',
            props: {
                onDisconnect: handleLogout,
                onBack: onBackConfirmLogout,
                //To avoid closing the modal when the user clicks on the close button
                //And enforce the user to agree to the terms or logout
                onClose: onBackConfirmLogout,
            },
        });
    };

    return (
        <LegalDocumentsContext.Provider
            value={{
                termsAndConditions: {
                    hasAgreedToRequiredTerms,
                    agreements: storedAgreements,
                    walletAddress: account?.address,
                    getTermId,
                    terms,
                    termsNotAgreed,
                },
            }}
        >
            {children}
            <TermsAndConditionsModal
                isOpen={showTermsModal}
                onCancel={handleCancel}
                onAgree={handleAgree}
            />
        </LegalDocumentsContext.Provider>
    );
};
