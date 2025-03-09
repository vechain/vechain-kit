import { ReactNode } from 'react';
import { BaseModal } from '../common/BaseModal';
import { TransactionModalContent } from './TransactionModalContent';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';

export type TransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransactionStatus;
    title?: ReactNode;
    description?: string;
    showSocialButtons?: boolean;
    socialDescriptionEncoded?: string;
    onTryAgain?: () => void;
    showExplorerButton?: boolean;
    txReceipt?: Connex.Thor.Transaction.Receipt | null;
    txError?: Error | TransactionStatusErrorType;
    isClosable?: boolean;
};

export const TransactionModal = ({
    isOpen,
    onClose,
    status,
    title,
    description,
    showSocialButtons = false,
    socialDescriptionEncoded,
    onTryAgain,
    showExplorerButton = false,
    txReceipt,
    txError,
    isClosable = true,
}: TransactionModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            closeOnOverlayClick={status !== 'pending' && isClosable}
        >
            <TransactionModalContent
                status={status}
                title={title}
                description={description}
                showSocialButtons={showSocialButtons}
                socialDescriptionEncoded={socialDescriptionEncoded}
                onTryAgain={onTryAgain}
                showExplorerButton={showExplorerButton}
                txReceipt={txReceipt}
                onClose={onClose}
                txError={txError}
            />
        </BaseModal>
    );
};
