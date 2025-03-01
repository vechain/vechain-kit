import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from 'react';
import {
    AccountModal,
    AccountModalContentTypes,
    ConnectModal,
} from '../components';
import { useDAppKitWallet } from '@/hooks';

type ModalContextType = {
    // Connect Modal
    openConnectModal: () => void;
    closeConnectModal: () => void;
    isConnectModalOpen: boolean;
    // Account Modal
    openAccountModal: () => void;
    closeAccountModal: () => void;
    isAccountModalOpen: boolean;
    setAccountModalContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    // Transaction Modal
    openTransactionModal: () => void;
    closeTransactionModal: () => void;
    isTransactionModalOpen: boolean;
    // Transaction Toast
    openTransactionToast: () => void;
    closeTransactionToast: () => void;
    isTransactionToastOpen: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const { setSource, connect } = useDAppKitWallet();
    const openConnectModal = useCallback(() => {
        // If the user is in the veworld app, connect to the wallet
        if (window.vechain && window.vechain.isInAppBrowser) {
            setSource('veworld');
            connect();
        } else {
            setIsConnectModalOpen(true);
        }
    }, []);
    const closeConnectModal = useCallback(
        () => setIsConnectModalOpen(false),
        [],
    );

    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const openAccountModal = useCallback(() => setIsAccountModalOpen(true), []);
    const closeAccountModal = useCallback(
        () => setIsAccountModalOpen(false),
        [],
    );

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const openTransactionModal = useCallback(
        () => setIsTransactionModalOpen(true),
        [],
    );
    const closeTransactionModal = useCallback(
        () => setIsTransactionModalOpen(false),
        [],
    );

    const [isTransactionToastOpen, setIsTransactionToastOpen] = useState(false);
    const openTransactionToast = useCallback(
        () => setIsTransactionToastOpen(true),
        [],
    );
    const closeTransactionToast = useCallback(
        () => setIsTransactionToastOpen(false),
        [],
    );

    const [accountModalContent, setAccountModalContent] =
        useState<AccountModalContentTypes>('main');

    return (
        <ModalContext.Provider
            value={{
                openConnectModal,
                closeConnectModal,
                isConnectModalOpen,
                openAccountModal,
                closeAccountModal,
                isAccountModalOpen,
                setAccountModalContent,
                openTransactionModal,
                closeTransactionModal,
                isTransactionModalOpen,
                openTransactionToast,
                closeTransactionToast,
                isTransactionToastOpen,
            }}
        >
            {children}
            <ConnectModal
                isOpen={isConnectModalOpen}
                onClose={closeConnectModal}
            />
            <AccountModal
                isOpen={isAccountModalOpen}
                onClose={closeAccountModal}
                initialContent={accountModalContent}
            />
        </ModalContext.Provider>
    );
};
