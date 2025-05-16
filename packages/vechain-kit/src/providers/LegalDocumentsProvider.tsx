import { LegalDocumentsModal } from '@/components/LegalDocumentsModal';
import { useWallet } from '@/hooks';
import { useSyncableLocalStorage } from '@/hooks/cache';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import {
    EnrichedLegalDocument,
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import { compareAddresses } from '@/utils/AddressUtils';
import {
    hasAgreedToRequiredDocuments as checkHasAgreedToRequiredDocuments,
    getAllDocuments,
    getRequiredDocuments,
    getDocumentId,
    getDocumentsNotAgreed,
} from '@/utils/legalDocumentsUtils';
import {
    Analytics,
    setConnectedWalletAddress,
} from '@/utils/mixpanelClientInstance';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

type Props = {
    children: Readonly<ReactNode>;
};

type LegalDocumentsContextType = {
    legalDocuments: {
        hasAgreedToRequiredDocuments: boolean;
        agreements: LegalDocumentAgreement[];
        walletAddress?: string;
        getDocumentId: (document: Omit<EnrichedLegalDocument, 'id'>) => string;
        documents: EnrichedLegalDocument[];
        documentsNotAgreed: EnrichedLegalDocument[];
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

    const [storedAgreements, setStoredAgreements] = useSyncableLocalStorage<
        LegalDocumentAgreement[]
    >('vechain-kit-legal-documents', []);
    const [showTermsModal, setShowTermsModal] = useState(false);

    //All documents with types
    const legalDocumentsArray = useMemo(() => {
        const cookiePolicies = legalDocuments?.cookiePolicy || [];
        const privacyPolicies = legalDocuments?.privacyPolicy || [];
        const termsPolicies = legalDocuments?.termsAndConditions || [];

        const cookiePolicy = cookiePolicies.map((cookiePolicy) => ({
            ...cookiePolicy,
            documentType: LegalDocumentType.COOKIES,
            documentSource: LegalDocumentSource.OTHER,
        }));

        const privacyPolicy = privacyPolicies.map((privacyPolicy) => ({
            ...privacyPolicy,
            documentType: LegalDocumentType.PRIVACY,
            documentSource: LegalDocumentSource.OTHER,
        }));

        const termsAndConditions = termsPolicies.map((termsAndConditions) => ({
            ...termsAndConditions,
            documentType: LegalDocumentType.TERMS,
            documentSource: LegalDocumentSource.OTHER,
        }));

        return [...cookiePolicy, ...privacyPolicy, ...termsAndConditions];
    }, [legalDocuments]);

    const documents = useMemo(() => {
        return getAllDocuments(
            legalDocumentsArray as unknown as EnrichedLegalDocument[],
        );
    }, [legalDocumentsArray]);

    const requiredDocuments = useMemo(() => {
        return getRequiredDocuments(documents);
    }, [documents]);

    const documentsNotAgreed = useMemo(() => {
        return getDocumentsNotAgreed(account?.address, documents);
    }, [documents, account?.address]);

    const hasAgreedToRequiredDocuments = useMemo(() => {
        return checkHasAgreedToRequiredDocuments(
            account?.address,
            requiredDocuments,
        );
    }, [requiredDocuments, account?.address]);

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            // Set the connected wallet address to the mixpanel
            // This is used to prevent tracking events
            // if the connected user has not agreed to the terms
            setConnectedWalletAddress(account.address);
            setShowTermsModal(!hasAgreedToRequiredDocuments);
        } else {
            setShowTermsModal(false);
        }
    }, [
        connection.isConnected,
        account?.address,
        hasAgreedToRequiredDocuments,
    ]);

    const agreeToDocs = (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
        walletAddress: string,
    ) => {
        const documentsArray = Array.isArray(documents)
            ? documents
            : [documents];
        if (!documentsArray.length) return;

        const timestamp = Date.now();
        const newAgreements = documentsArray.map((term) => ({
            ...term,
            walletAddress,
            timestamp,
        }));

        const filteredAgreements = storedAgreements.filter(
            (saved) =>
                !compareAddresses(saved.walletAddress, walletAddress) ||
                !documentsArray.some((term) => term.id === saved.id),
        );

        const updated = [...filteredAgreements, ...newAgreements];
        setStoredAgreements(updated);

        setConnectedWalletAddress(walletAddress);
    };

    const handleAgree = useCallback(
        (documents: EnrichedLegalDocument | EnrichedLegalDocument[]) => {
            if (!account?.address) return;
            agreeToDocs(documents, account.address);
            setShowTermsModal(false);
        },
        [agreeToDocs, account?.address],
    );

    const handleLogout = () => {
        Analytics.auth.trackAuth('disconnect_initiated');
        disconnect();
        setShowTermsModal(false);
    };

    return (
        <LegalDocumentsContext.Provider
            value={{
                legalDocuments: {
                    hasAgreedToRequiredDocuments,
                    agreements: storedAgreements,
                    walletAddress: account?.address,
                    getDocumentId,
                    documents,
                    documentsNotAgreed,
                },
            }}
        >
            {children}
            <LegalDocumentsModal
                isOpen={showTermsModal}
                onAgree={handleAgree}
                handleLogout={handleLogout}
            />
        </LegalDocumentsContext.Provider>
    );
};
