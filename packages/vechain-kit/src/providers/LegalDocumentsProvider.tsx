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
    createDocumentRecords,
    getAllDocuments,
    getDocumentId,
    getDocumentsNotAgreed,
    getOptionalDocuments,
    getRequiredDocuments,
    LEGAL_DOCS_LOCAL_STORAGE_KEY,
    LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY,
} from '@/utils/legalDocumentsUtils';
import {
    Analytics,
    // setHasTrackingConsent,
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
    >(LEGAL_DOCS_LOCAL_STORAGE_KEY, []);

    const [optionalRejected, setOptionalRejected] = useSyncableLocalStorage<
        LegalDocumentAgreement[]
    >(LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY, []);

    const [showTermsModal, setShowTermsModal] = useState(false);

    const isDocumentRejectedByUser = useCallback(
        (doc: EnrichedLegalDocument, walletAddress: string) => {
            return optionalRejected.some(
                (rejected) =>
                    compareAddresses(rejected.walletAddress, walletAddress) &&
                    rejected.id === doc.id,
            );
        },
        [optionalRejected],
    );

    //All documents with types and sources
    const legalDocumentsArray = useMemo(() => {
        const cookiePolicies = legalDocuments?.cookiePolicy || [];
        const privacyPolicies = legalDocuments?.privacyPolicy || [];
        const termsPolicies = legalDocuments?.termsAndConditions || [];

        const cookiePolicy = cookiePolicies.map((cookiePolicy) => ({
            ...cookiePolicy,
            documentType: LegalDocumentType.COOKIES,
            documentSource: LegalDocumentSource.APPLICATION,
        }));

        const privacyPolicy = privacyPolicies.map((privacyPolicy) => ({
            ...privacyPolicy,
            documentType: LegalDocumentType.PRIVACY,
            documentSource: LegalDocumentSource.APPLICATION,
        }));

        const termsAndConditions = termsPolicies.map((termsAndConditions) => ({
            ...termsAndConditions,
            documentType: LegalDocumentType.TERMS,
            documentSource: LegalDocumentSource.APPLICATION,
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

    const isAnalyticsAllowed = useMemo(() => {
        //If allowAnalytics is not set, it defaults to false
        return legalDocuments?.allowAnalytics ?? false;
    }, [legalDocuments?.allowAnalytics]);

    const hasAgreedToRequiredDocuments = useMemo(() => {
        //This is using the local storage hook instead of utils , since it needs a dependency hook
        //Otherwise it will not re-render when the user disconnects and connects again
        //Which will not notify external usages of this hook
        if (!requiredDocuments.length || !account?.address) return true;

        return requiredDocuments.every((document) =>
            storedAgreements.some(
                (saved) =>
                    compareAddresses(saved.walletAddress, account.address) &&
                    saved.id === document.id,
            ),
        );
    }, [requiredDocuments, storedAgreements, account?.address]);

    const hasOptionalDocumentsToShow = useMemo(() => {
        if (!account?.address || documentsNotAgreed.length === 0) return false;

        // Get optional documents that haven't been agreed to
        const optionalDocsNotAgreed = getOptionalDocuments(documentsNotAgreed);

        if (optionalDocsNotAgreed.length === 0) return false;

        // Check if any of these haven't been rejected yet
        return optionalDocsNotAgreed.some(
            (doc) => !isDocumentRejectedByUser(doc, account.address),
        );
    }, [
        documentsNotAgreed,
        account?.address,
        getOptionalDocuments,
        isDocumentRejectedByUser,
    ]);

    const onlyOptionalDocuments = useMemo(() => {
        return hasAgreedToRequiredDocuments && hasOptionalDocumentsToShow;
    }, [hasAgreedToRequiredDocuments, hasOptionalDocumentsToShow]);

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            // setHasTrackingConsent(isAnalyticsAllowed);
            setShowTermsModal(
                !hasAgreedToRequiredDocuments || hasOptionalDocumentsToShow,
            );
        } else {
            setShowTermsModal(false);
        }
    }, [
        connection.isConnected,
        account?.address,
        hasAgreedToRequiredDocuments,
        hasOptionalDocumentsToShow,
        isAnalyticsAllowed,
    ]);

    const agreeToDocs = useCallback(
        (
            documents: EnrichedLegalDocument | EnrichedLegalDocument[],
            walletAddress: string,
        ) => {
            const documentsArray = Array.isArray(documents)
                ? documents
                : [documents];
            if (!documentsArray.length) return;

            const newAgreements = createDocumentRecords(
                documentsArray,
                walletAddress,
            );

            const filteredAgreements = storedAgreements.filter(
                (saved) =>
                    !compareAddresses(saved.walletAddress, walletAddress) ||
                    !documentsArray.some((term) => term.id === saved.id),
            );

            const updated = [...filteredAgreements, ...newAgreements];
            setStoredAgreements(updated);
        },
        [storedAgreements, createDocumentRecords],
    );

    const handleOptionalRejection = useCallback(
        (acceptedDocs: EnrichedLegalDocument[]) => {
            if (!account?.address) return;

            // Find optional documents that were not accepted
            const optionalDocuments = getOptionalDocuments(documentsNotAgreed);
            if (optionalDocuments.length === 0) return;

            const acceptedDocIds = acceptedDocs.map((doc) => doc.id);
            const rejectedOptionals = optionalDocuments.filter(
                (doc) => !acceptedDocIds.includes(doc.id),
            );

            // If no optional documents were rejected, return
            if (!rejectedOptionals?.length) {
                return;
            }

            const newRejections = createDocumentRecords(
                rejectedOptionals,
                account.address,
            );
            setOptionalRejected((prev) => [...prev, ...newRejections]);
        },
        [
            account?.address,
            documentsNotAgreed,
            getOptionalDocuments,
            createDocumentRecords,
        ],
    );

    const handleAgree = useCallback(
        (documents: EnrichedLegalDocument | EnrichedLegalDocument[]) => {
            if (!account?.address) return;

            const docsArray = Array.isArray(documents)
                ? documents
                : [documents];

            // Store accepted documents
            if (docsArray.length > 0) {
                agreeToDocs(docsArray, account.address);
            }

            // Handle optional rejection
            handleOptionalRejection(docsArray);

            // Close the modal
            setShowTermsModal(false);
        },
        [account?.address, agreeToDocs, handleOptionalRejection],
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
                handleLogout={onlyOptionalDocuments ? () => {} : handleLogout}
                onlyOptionalDocuments={onlyOptionalDocuments}
            />
        </LegalDocumentsContext.Provider>
    );
};
