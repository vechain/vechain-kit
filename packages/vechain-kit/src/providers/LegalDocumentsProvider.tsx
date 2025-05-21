import { LegalDocumentsModal } from '@/components/LegalDocumentsModal';
import { useWallet, useSyncableLocalStorage } from '@/hooks';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';
import {
    EnrichedLegalDocument,
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import { compareAddresses } from '@/utils';
import { VECHAIN_KIT_COOKIES_CONFIG } from '@/utils';
import {
    createDocumentRecords,
    formatDocuments,
    getDocumentsNotAgreed,
    getOptionalDocuments,
    LEGAL_DOCS_LOCAL_STORAGE_KEY,
    LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY,
} from '@/utils/legalDocumentsUtils';
import {
    Analytics,
    setHasTrackingConsent,
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
    hasAgreedToRequiredDocuments: boolean;
    agreements: LegalDocumentAgreement[];
    walletAddress?: string;
    documents: EnrichedLegalDocument[];
    documentsNotAgreed: EnrichedLegalDocument[];
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

    const isAnalyticsAllowed = useMemo(() => {
        //If allowAnalytics is not set, it defaults to false
        return legalDocuments?.allowAnalytics ?? false;
    }, [legalDocuments?.allowAnalytics]);

    const [documents, requiredDocuments] = useMemo(() => {
        // Create document mappings once with consistent naming
        const documentConfigs = [
            {
                items: legalDocuments?.cookiePolicy || [],
                type: LegalDocumentType.COOKIES,
                source: LegalDocumentSource.APPLICATION,
            },
            {
                items: legalDocuments?.privacyPolicy || [],
                type: LegalDocumentType.PRIVACY,
                source: LegalDocumentSource.APPLICATION,
            },
            {
                items: legalDocuments?.termsAndConditions || [],
                type: LegalDocumentType.TERMS,
                source: LegalDocumentSource.APPLICATION,
            },
        ];

        // Flatten all documents with their types and sources
        const allDocs = documentConfigs.flatMap((config) =>
            config.items.map((item) => ({
                ...item,
                documentType: config.type,
                documentSource: config.source,
            })),
        );

        // Add analytics cookie if allowed
        if (isAnalyticsAllowed) {
            allDocs.push({
                ...VECHAIN_KIT_COOKIES_CONFIG,
                documentType: LegalDocumentType.COOKIES,
                documentSource: LegalDocumentSource.VECHAIN_KIT,
            });
        }

        // Format documents with IDs and filter required ones in one pass
        const formattedDocs = formatDocuments(allDocs);
        const required = formattedDocs.filter((doc) => doc.required);

        return [formattedDocs, required];
    }, [legalDocuments, isAnalyticsAllowed]);

    const documentsNotAgreed = useMemo(() => {
        return getDocumentsNotAgreed(account?.address, documents);
    }, [documents, account?.address]);

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
        if (!account?.address || !documentsNotAgreed?.length) return false;

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

    const hasAgreedWithAnalytics = useMemo(() => {
        if (!isAnalyticsAllowed) return false;

        const storedAgreementIds = new Set(
            storedAgreements.map((agreement) => agreement.id),
        );

        return documents.some((doc) => storedAgreementIds.has(doc.id));
    }, [isAnalyticsAllowed, documents, storedAgreements]);

    useEffect(() => {
        setHasTrackingConsent(hasAgreedWithAnalytics);
    }, [hasAgreedWithAnalytics]);

    useEffect(() => {
        if (connection.isConnected && account?.address) {
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
                hasAgreedToRequiredDocuments,
                agreements: storedAgreements,
                walletAddress: account?.address,
                documents,
                documentsNotAgreed,
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
