'use client';

import {
    Button,
    Heading,
    HStack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import {
    TransactionModal,
    TransactionToast,
    useBuildTransaction,
    useThor,
    useTransactionModal,
    useTransactionToast,
    useWallet,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';
import { useTranslation } from 'react-i18next';
import { b3trMainnetAddress } from '../../constants';
import { DemoSection } from '../../components/demo/DemoSection';
import { ConnectGate } from '../../components/demo/ConnectGate';
import { TxResultPanel } from '../../components/features/Transactions/TxResultPanel';

const TX_SNIPPET = `import {
    useBuildTransaction,
    useTransactionModal,
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-contract-types';

function SendButton({ to, amount }) {
    const thor = useThor();
    const { sendTransaction, status, txReceipt, error } = useBuildTransaction({
        clauseBuilder: () => [
            {
                ...thor.contracts
                    .load(B3TR_ADDRESS, IB3TR__factory.abi)
                    .clause.transfer(to, amount).clause,
                comment: 'Send B3TR',
            },
        ],
        gasPadding: 0.25,
    });

    const { open } = useTransactionModal();

    return (
        <Button onClick={() => { open(); sendTransaction({}); }}>
            Send
        </Button>
    );
}
`;

function TransactionDemo() {
    const { t } = useTranslation();
    const { account } = useWallet();
    const thor = useThor();

    const {
        sendTransaction,
        status,
        txReceipt,
        isTransactionPending,
        error,
        resetStatus,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];
            return [
                {
                    ...thor.contracts
                        .load(b3trMainnetAddress, IB3TR__factory.abi)
                        .clause.transfer(account.address, BigInt('0')).clause,
                    comment: t(
                        'Dummy transaction: transfer 0 B3TR to your own address.',
                    ),
                },
            ];
        },
        gasPadding: 0.25,
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const handleWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction({});
    }, [sendTransaction, openTransactionToast]);

    const handleWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction({});
    }, [sendTransaction, openTransactionModal]);

    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction({});
    }, [resetStatus, sendTransaction]);

    return (
        <VStack align="stretch" spacing={4}>
            <Text fontSize="sm">
                {t(
                    'Send a 0-value B3TR transfer to your own address. Costs nothing, just exercises the full flow.',
                )}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
                <Button
                    onClick={handleWithToast}
                    isLoading={isTransactionPending}
                >
                    {t('Test with Toast')}
                </Button>
                <Button
                    onClick={handleWithModal}
                    isLoading={isTransactionPending}
                    variant="outline"
                >
                    {t('Test with Modal')}
                </Button>
            </HStack>

            <TxResultPanel
                status={status}
                txReceipt={txReceipt}
                error={error}
                onTryAgain={handleTryAgain}
            />

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                txError={error}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                description={t(
                    'Dummy transaction: transfer 0 B3TR to your own address.',
                )}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                onTryAgain={handleTryAgain}
                txError={error}
                uiConfig={{
                    title: t('Test Transaction'),
                    description: t(
                        'Dummy transaction: transfer 0 B3TR to your own address.',
                    ),
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </VStack>
    );
}

export default function TransactionsPage() {
    const { t } = useTranslation();

    return (
        <VStack align="stretch" spacing={6}>
            <VStack align="stretch" spacing={2}>
                <Heading size="lg">{t('Transactions')}</Heading>
                <Text opacity={0.7}>
                    {t(
                        'Build, send and track transactions with built-in UI (toast or modal) and fee delegation.',
                    )}
                </Text>
            </VStack>

            <ConnectGate feature={t('Transactions')}>
                <DemoSection
                    title={t('Send a test transaction')}
                    description={t(
                        'Two UI modes share the same useBuildTransaction state. Pick whichever fits your design.',
                    )}
                    hooks={[
                        'useBuildTransaction',
                        'useTransactionModal',
                        'useTransactionToast',
                    ]}
                    status="STABLE"
                    code={TX_SNIPPET}
                >
                    <TransactionDemo />
                </DemoSection>
            </ConnectGate>
        </VStack>
    );
}
