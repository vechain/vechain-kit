import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
} from 'react';
import { useTermsAndConditions, useWallet } from '@/hooks';
import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';

const CustomLogicContext = createContext<null>(null);

export const useCustomLogic = () => {
    const context = useContext(CustomLogicContext);
    if (!context) {
        throw new Error(
            'useCustomLogic must be used within CustomLogicProvider',
        );
    }
    return context;
};

export const CustomLogicProvider = ({ children }: { children: ReactNode }) => {
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
        <CustomLogicContext.Provider value={null}>
            {children}
            <TermsAndConditionsModal
                isOpen={showTermsModal}
                onClose={handleCloseOrDisagree}
                onAgree={handleAgree}
            />
        </CustomLogicContext.Provider>
    );
};
