import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';
import { useWallet } from '@/hooks';
import { useSyncableLocalStorage } from '@/hooks/cache';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import { TermsAndConditions, TermsAndConditionsAgreement } from '@/types';
import { compareAddresses } from '@/utils';
import {
    hasAgreedToRequiredTerms as checkHasAgreedToRequiredTerms,
    getAllTerms,
    getRequiredTerms,
    getTermId,
    getTermsNotAgreed,
} from '@/utils/legalDocumentsUtils';
import {
    Analytics,
    setConnectedWalletAddress,
} from '@/utils/mixpanelClientInstance';
import {
    createContext,
    ReactNode,
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

    const terms = useMemo(() => {
        return getAllTerms(legalDocuments?.termsAndConditions ?? []);
    }, [legalDocuments]);

    const requiredTerms = useMemo(() => {
        return getRequiredTerms(terms);
    }, [terms]);

    const termsNotAgreed = useMemo(() => {
        return getTermsNotAgreed(account?.address, terms);
    }, [terms, account?.address]);

    const hasAgreedToRequiredTerms = useMemo(() => {
        return checkHasAgreedToRequiredTerms(account?.address, requiredTerms);
    }, [requiredTerms, account?.address]);

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

        setConnectedWalletAddress(account.address);
    };

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            // Set the connected wallet address to the mixpanel
            // This is used to prevent tracking events
            // if the connected user has not agreed to the terms
            setConnectedWalletAddress(account.address);
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
        setConnectedWalletAddress(null);
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
