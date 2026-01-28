import { ReactNode } from 'react';
import { BaseModal } from '../common/BaseModal';
import { TransactionModalContent } from './TransactionModalContent';
import type { TransactionStatus, TransactionStatusErrorType } from '../../types';
import { TransactionReceipt } from '@vechain/sdk-network';
// Direct imports to avoid circular dependency through barrel exports
import { useVeChainKitConfig } from '../../providers/VeChainKitContext';
import { VechainKitThemeProvider } from '../../providers/VechainKitThemeProvider';
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
    const { darkMode, theme } = useVeChainKitConfig();

    // avoid deep nesting and unnecessary rendering
    if (!isOpen) return null;

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                allowExternalFocus={true}
                blockScrollOnMount={true}
                closeOnOverlayClick={
                    status !== 'pending' && uiConfig?.isClosable
                }
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
        </VechainKitThemeProvider>
    );
};
