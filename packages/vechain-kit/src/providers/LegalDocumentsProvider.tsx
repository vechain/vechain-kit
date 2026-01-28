// Import directly from specific hook files to avoid circular dependency with hooks/index.ts
import { useWallet } from '../hooks/api/wallet/useWallet';
import { useSyncableLocalStorage } from '../hooks/cache/useSyncableLocalStorage';
// Import from VeChainKitContext to avoid circular dependency with VeChainKitProvider
import { useVeChainKitConfig } from './VeChainKitContext';
import type {
    EnrichedLegalDocument,
    LegalDocumentAgreement,
} from '../types';
import {
    LegalDocumentSource,
    LegalDocumentType,
} from '../types';
import { compareAddresses } from '../utils';
import {
    createDocumentRecords,
    formatDocuments,
    getOptionalDocuments,
    LEGAL_DOCS_LOCAL_STORAGE_KEY,
    LEGAL_DOCS_OPTIONAL_REJECT_LOCAL_STORAGE_KEY,
} from '../utils/legalDocumentsUtils';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    lazy,
    Suspense,
} from 'react';
import { VechainKitThemeProvider } from './VechainKitThemeProvider';

// Lazy load LegalDocumentsModal to reduce initial bundle size
const LazyLegalDocumentsModal = lazy(() =>
    import('../components/LegalDocumentsModal').then((mod) => ({
        default: mod.LegalDocumentsModal,
    })),
);

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
        // This fallback is used to avoid errors when the context is not available
        return {
            hasAgreedToRequiredDocuments: true,
            agreements: [],
            walletAddress: undefined,
            documents: [],
            documentsNotAgreed: [],
        };
    }
    return context;
};

export const LegalDocumentsProvider = ({ children }: Props) => {
    const { connection, account, disconnect } = useWallet();
    const { darkMode, legalDocuments, theme, headless } = useVeChainKitConfig();

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

        // Format documents with IDs and filter required ones in one pass
        const formattedDocs = formatDocuments(allDocs);
        const required = formattedDocs.filter((doc) => doc.required);

        return [formattedDocs, required];
    }, [legalDocuments]);

    const documentsNotAgreed = useMemo(() => {
        if (!account?.address) return [];

        return documents.filter((document) => {
            // Use in-memory storedAgreements instead of reading from localStorage
            const isAgreed = storedAgreements.some(
                (agreement) =>
                    compareAddresses(
                        agreement.walletAddress,
                        account.address,
                    ) && agreement.id === document.id,
            );

            if (isAgreed) return false;

            const isRejected = optionalRejected.some(
                (rejection) =>
                    compareAddresses(
                        rejection.walletAddress,
                        account.address,
                    ) && rejection.id === document.id,
            );

            return !isRejected;
        });
    }, [documents, account?.address, storedAgreements, optionalRejected]);

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

    useMemo(() => {
        const storedAgreementIds = new Set(
            storedAgreements.map((agreement) => agreement.id),
        );

        return documents.some((doc) => storedAgreementIds.has(doc.id));
    }, [documents, storedAgreements]);

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
            {/* Lazy-load modal only when it needs to be shown */}
            {/* In headless mode, skip the modal entirely - no UI components are rendered */}
            {!headless && showTermsModal && (
                <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
                    <Suspense fallback={null}>
                        <LazyLegalDocumentsModal
                            isOpen={showTermsModal}
                            onAgree={handleAgree}
                            handleLogout={
                                onlyOptionalDocuments ? () => {} : handleLogout
                            }
                            onlyOptionalDocuments={onlyOptionalDocuments}
                        />
                    </Suspense>
                </VechainKitThemeProvider>
            )}
        </LegalDocumentsContext.Provider>
    );
};
