import type { ReactNode } from 'react';
import type { TransactionStatus, TransactionStatusErrorType } from '../../types';
import type { TransactionReceipt } from '@vechain/sdk-network';

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
