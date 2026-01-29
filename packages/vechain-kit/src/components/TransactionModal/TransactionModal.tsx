import { BaseModal } from '../common/BaseModal';
import { TransactionModalContent } from './TransactionModalContent';
// Direct imports to avoid circular dependency through barrel exports
import { useVeChainKitConfig } from '../../providers/VeChainKitContext';
import { VechainKitThemeProvider } from '../../providers/VechainKitThemeProvider';
// Import from types.ts to avoid circular dependency with TransactionModalContent
import type { TransactionModalProps } from './types';

// Re-export for backward compatibility
export type { TransactionModalProps } from './types';

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
