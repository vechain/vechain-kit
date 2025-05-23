import { ReactNode } from 'react';
import { BaseModal } from '../common/BaseModal';
import { TransactionModalContent } from './TransactionModalContent';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { TransactionReceipt } from '@vechain/sdk-network';
export type TransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onTryAgain: () => void;
    status: TransactionStatus;
    txReceipt: TransactionReceipt | null;
    txError?: Error | TransactionStatusErrorType;
    uiConfig?: {
        isClosable?: boolean;
        showShareOnSocials?: boolean;
        showExplorerButton?: boolean;
        loadingIcon?: ReactNode;
        successIcon?: ReactNode;
        errorIcon?: ReactNode;
        title?: ReactNode;
        description?: string;
        showSocialButtons?: boolean;
    };
};

export const TransactionModal = ({
    isOpen,
    onClose,
    status,
    uiConfig,
    txReceipt,
    txError,
    onTryAgain,
}: TransactionModalProps) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            closeOnOverlayClick={status !== 'pending' && uiConfig?.isClosable}
        >
            <TransactionModalContent
                status={status}
                onTryAgain={onTryAgain}
                uiConfig={uiConfig}
                txReceipt={txReceipt}
                onClose={onClose}
                txError={txError}
            />
        </BaseModal>
    );
};
