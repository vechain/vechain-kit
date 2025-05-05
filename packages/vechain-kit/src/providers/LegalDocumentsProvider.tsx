import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
} from 'react';
import { useTermsAndConditions, useWallet } from '@/hooks';
import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';

type Props = {
    children: Readonly<ReactNode>;
};

const LegalDocumentsContext = createContext<null>(null);

export const useLegalDocumentsContext = () => {
    const context = useContext(LegalDocumentsContext);
    if (!context) {
        throw new Error(
            'useLegalDocumentsContext must be used within LegalDocumentsProvider',
        );
    }
    return context;
};

export const LegalDocumentsProvider = ({ children }: Props) => {
    const { connection, account, disconnect } = useWallet();
    const { hasAgreedToTerms } = useTermsAndConditions();
    const [showTermsModal, setShowTermsModal] = useState(false);

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            setShowTermsModal(!hasAgreedToTerms);
        } else {
            setShowTermsModal(false);
        }
    }, [connection.isConnected, account?.address, hasAgreedToTerms]);

    const handleAgree = () => {
        setShowTermsModal(false);
    };

    const handleCloseOrDisagree = () => {
        disconnect();
        setShowTermsModal(false);
    };

    return (
        <LegalDocumentsContext.Provider value={null}>
            {children}
            <TermsAndConditionsModal
                isOpen={showTermsModal}
                onClose={handleCloseOrDisagree}
                onAgree={handleAgree}
            />
        </LegalDocumentsContext.Provider>
    );
};
