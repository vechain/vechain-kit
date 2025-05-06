import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';
import { useTermsAndConditions, useWallet } from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useModal } from './ModalProvider';

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
    const { closeAccountModal, openAccountModal } = useModal();

    useEffect(() => {
        if (connection.isConnected && account?.address) {
            setShowTermsModal(!hasAgreedToTerms);
        } else {
            setShowTermsModal(false);
        }
    }, [connection.isConnected, account?.address, hasAgreedToTerms]);

    const onBackConfirmLogout = () => {
        closeAccountModal();
        setShowTermsModal(true);
    };

    const handleAgree = () => {
        setShowTermsModal(false);
    };
    const handleLogout = () => {
        disconnect();
        setShowTermsModal(false);
        closeAccountModal();
        Analytics.auth.logoutCompleted(); //TODO: Should we track even if the user didn't agree to the terms?
    };

    const handleCancel = () => {
        Analytics.auth.trackAuth('disconnect_initiated'); //TODO: Should we track even if the user didn't agree to the terms?
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
        <LegalDocumentsContext.Provider value={null}>
            {children}
            <TermsAndConditionsModal
                isOpen={showTermsModal}
                onCancel={handleCancel}
                onAgree={handleAgree}
            />
        </LegalDocumentsContext.Provider>
    );
};
