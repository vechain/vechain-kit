import { ReactNode, useMemo } from 'react';
import {
    ConfirmationModalContent,
    ErrorModalContent,
    LoadingModalContent,
    SuccessModalContent,
} from './Contents';
import { BaseModal } from '@common';
import { TransactionProgress } from '@/types';

export type TransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: string;
    pendingTitle?: ReactNode;
    confirmationTitle?: ReactNode;
    errorTitle?: ReactNode;
    errorDescription?: string;
    successTitle?: ReactNode;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    showTryAgainButton?: boolean;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txId?: string;
    progress?: TransactionProgress;
};

export const TransactionModal = ({
    isOpen,
    onClose,
    status,
    pendingTitle,
    confirmationTitle,
    errorTitle,
    errorDescription,
    successTitle,
    showSocialButtons = false,
    socialDescriptionEncoded,
    showTryAgainButton,
    onTryAgain,
    showExplorerButton,
    txId,
    progress,
}: TransactionModalProps) => {
    const modalContent = useMemo(() => {
        if (status === 'pending')
            return (
                <ConfirmationModalContent
                    title={confirmationTitle}
                    progress={progress}
                    onTryAgain={onTryAgain}
                />
            );
        if (status === 'waitingConfirmation')
            return (
                <LoadingModalContent
                    title={pendingTitle}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                    onTryAgain={onTryAgain}
                />
            );
        if (status === 'error')
            return (
                <ErrorModalContent
                    title={errorTitle}
                    description={errorDescription}
                    showTryAgainButton={showTryAgainButton}
                    onTryAgain={onTryAgain}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                    onClose={onClose}
                />
            );
        if (status === 'success')
            return (
                <SuccessModalContent
                    title={successTitle}
                    showSocialButtons={showSocialButtons}
                    socialDescriptionEncoded={socialDescriptionEncoded}
                    showExplorerButton={showExplorerButton}
                    txId={txId}
                    onClose={onClose}
                />
            );
        return null;
    }, [
        status,
        confirmationTitle,
        pendingTitle,
        showExplorerButton,
        txId,
        errorTitle,
        errorDescription,
        showTryAgainButton,
        onTryAgain,
        successTitle,
        showSocialButtons,
        socialDescriptionEncoded,
        progress,
    ]);

    if (!modalContent) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            closeOnOverlayClick={status !== 'pending'}
        >
            {modalContent}
        </BaseModal>
    );
};
