# Transaction Modal

Use our pre built `TransactionModal` or `TransactionToast` components to show your users the progress and outcome of the transaction, or build your own UX and UI.



<div align="center"><figure><img src="../.gitbook/assets/image (1) (2) (1).png" alt="" width="375"><figcaption></figcaption></figure></div>

### Usage example

```typescript
'use client';

import {
    useWallet,
    useSendTransaction,
    useTransactionModal,
    TransactionModal,
    getConfig
} from '@vechain/vechain-kit';
import { IB3TR__factory } from '@vechain/vechain-kit/contracts';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { useMemo, useCallback } from 'react';

export function TransactionExamples() {
    const { account } = useWallet();
    const b3trMainnetAddress = getConfig("main").b3trContractAddress;
    
    const clauses = useMemo(() => {
        const B3TRInterface = IB3TR__factory.createInterface();

        const clausesArray: any[] = [];
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: B3TRInterface.encodeFunctionData('transfer', [
                "0x0, // receiver address
                '0', // 0 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress("Ox0")}`,
            abi: B3TRInterface.getFunction('transfer'),
        });

        return clausesArray;
    }, [connectedWallet?.address]);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    // This is the function triggering the transaction and opening the modal
    const handleTransaction = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionModal]);
    
    const handleTryAgain = useCallback(async () => {
        resetStatus();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, resetStatus]);

    return (
        <>
            <button
                onClick={handleTransactionWithModal}
                isLoading={isTransactionPending}
                isDisabled={isTransactionPending}
            >
                Send B3TR
            </button>

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                txReceipt={txReceipt}
                txError={error}
                onTryAgain={handleTryAgain}
                uiConfig={{
                    title: 'Test Transaction',
                    description: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${
                        account?.address
                    }`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </>
    );
}

```
