import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
// Import from ModalContext to avoid circular dependency with ModalProvider
import { useModal } from './ModalContext';

type FeedbackContextType = {
    showFeedback: (message?: string) => void;
    shouldShowFeedback: boolean;
    message: string | null;
    resetFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(
    undefined,
);

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within FeedbackProvider');
    }
    return context;
};

type Props = {
    children: Readonly<ReactNode>;
    /**
     * Optional callback to reset feedback when modal closes
     * If provided, feedback will be reset when the modal closes
     */
    resetOnModalClose?: boolean;
};

export const FeedbackProvider = ({
    children,
    resetOnModalClose = false,
}: Props) => {
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { isAccountModalOpen } = useModal();

    const showFeedback = useCallback((feedbackMessage?: string) => {
        setMessage(feedbackMessage || null);
        setShouldShowFeedback(true);
    }, []);

    const resetFeedback = useCallback(() => {
        setShouldShowFeedback(false);
        setMessage(null);
    }, []);

    // Reset feedback when modal closes (if enabled)
    useEffect(() => {
        if (resetOnModalClose && !isAccountModalOpen) {
            resetFeedback();
        }
    }, [resetOnModalClose, isAccountModalOpen, resetFeedback]);

    return (
        <FeedbackContext.Provider
            value={{
                showFeedback,
                shouldShowFeedback,
                message,
                resetFeedback,
            }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};
