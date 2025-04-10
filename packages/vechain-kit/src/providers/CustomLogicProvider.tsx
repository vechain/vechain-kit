import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useTermsAndConditions, useWallet } from '@/hooks';
import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';
import { useDisclosure } from '@chakra-ui/react';

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connection, account } = useWallet();
    const { hasAgreedToTerms } = useTermsAndConditions();
    const [hasShownModal, setHasShownModal] = useState(false);

    useEffect(() => {
        if (!connection.isConnected && isOpen) {
            onClose();
            return;
        }
        if (
            connection.isConnected &&
            !!account?.address &&
            !hasAgreedToTerms &&
            !isOpen &&
            !hasShownModal
        ) {
            onOpen();
            setHasShownModal(true);
        }

        if (hasAgreedToTerms) {
            setHasShownModal(false);
        }
    }, [
        connection.isConnected,
        account?.address,
        hasAgreedToTerms,
        isOpen,
        onOpen,
        onClose,
    ]);

    return (
        <CustomLogicContext.Provider value={null}>
            {children}
            <TermsAndConditionsModal isOpen={isOpen} onClose={onClose} />
        </CustomLogicContext.Provider>
    );
};
