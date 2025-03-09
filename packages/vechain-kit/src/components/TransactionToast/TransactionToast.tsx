import { Box } from '@chakra-ui/react';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import { TransactionToastContent } from './TransactionToastContent';

export type TransactionToastProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransactionStatus;
    txReceipt?: Connex.Thor.Transaction.Receipt | null;
    onTryAgain?: () => void;
    txError?: Error | TransactionStatusErrorType;
    description?: string;
};

export const TransactionToast = ({
    isOpen,
    onClose,
    status,
    txReceipt,
    txError,
    onTryAgain,
    description,
}: TransactionToastProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    if (!isOpen) return null;

    return (
        <VechainKitThemeProvider darkMode={isDark}>
            <Box
                position="fixed"
                bottom="5"
                left="5"
                zIndex="11111"
                bg={isDark ? '#1f1f1e' : 'white'}
                borderRadius={'md'}
                p={5}
                boxShadow="lg"
                maxW="sm"
            >
                <TransactionToastContent
                    status={status}
                    txReceipt={txReceipt}
                    txError={txError}
                    onTryAgain={onTryAgain}
                    description={description}
                    onClose={onClose}
                />
            </Box>
        </VechainKitThemeProvider>
    );
};
