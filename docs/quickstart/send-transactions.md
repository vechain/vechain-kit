# Send Transactions

{% hint style="info" %}
The useSendTransaction hook is mandatory if you use social login in your app, since it handles the social login transactions (that needs to be prepared and broadcasted differently from normal transactions). If you are not interested in social login features then you can avoid using useSendTransaction and useSignMessage and use the `signer` exported by the kit following the SDK guides for creating transactions or signing messages.
{% endhint %}

This hook will take care of checking your connection type and handle the transaction submission between privy, cross-app and wallet connections.

When implementing VeChain Kit it is mandatory to use this hook to send transaction.

Use our pre built `TransactionModal` or `TransactionToast` components to show your users the progress and outcome of the transaction, or build your own UX and UI.

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

You can build clauses with some of our available build functions, with our [SDK](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk) or  with [connex](https://docs.vechain.org/developer-resources/sdks-and-providers/connex).

If you want to interact directly with the user's smart account read the [Smart Accounts](../social-login/smart-accounts.md#multiclause-transactions) section.

{% hint style="warning" %}
**Important**

Ensuring data is pre-fetched before initiating a transaction is crucial to avoid browser pop-up blocking for users using social login, which can adversely affect user experience.

```javascript
// ✅ Good: Pre-fetch data
const { data } = useQuery(['someData'], fetchSomeData);
const sendTx = () => sendTransaction(data);

// ⛔ Bad: Fetching data during the transaction
const sendTx = async () => {
  const data = await fetchSomeData();
  return sendTransaction(data);
};
```
{% endhint %}

***

### 🔧 Custom Gas Configuration (optional)

When sending transactions using VechainKit, you can fine-tune the gas settings by using two optional fields: `suggestedMaxGas` and `gasPadding`. These options give you greater control over the gas behavior of your transaction.

#### `suggestedMaxGas`

The `suggestedMaxGas` parameter allows you to explicitly define the maximum amount of gas to be used for the transaction. When this field is set, it will **override the internal gas estimation** logic and also **ignore any `gasPadding` value**.

* Expected format: an integer representing gas units (e.g., `40000000` for 40 million gas).
* Use this option when you want full control and know in advance the maximum gas your transaction should consume.

> Example:

```ts
useSendTransaction({
  ..., //other config
  suggestedMaxGas: 40000000, // Sets the gas limit directly
});
```

#### `gasPadding`

The `gasPadding` option allows you to add a safety buffer **on top of the estimated gas**. This can be useful to prevent underestimations for complex transactions.

* Expected format: a number between `0` and `1`, representing a percentage increase (e.g., `0.1` adds 10%).
* Only applied **if `suggestedMaxGas` is not set**.

> Example:

```ts
useSendTransaction({
  ..., //other config
  gasPadding: 0.1, // Adds 10% buffer to estimated gas
});
```

#### Summary

<table data-full-width="true"><thead><tr><th>Option</th><th>Type</th><th width="198.84375">Applies Gas Estimation</th><th width="153.10546875">Applies Padding</th><th width="201.01171875">Overwrites Estimation</th></tr></thead><tbody><tr><td><code>suggestedMaxGas</code></td><td>Integer</td><td>❌</td><td>❌</td><td>✅</td></tr><tr><td><code>gasPadding</code></td><td>Float (0–1)</td><td>✅</td><td>✅</td><td>❌</td></tr></tbody></table>

Use `suggestedMaxGas` when you want to define the gas cap directly, and `gasPadding` when you prefer to work with auto-estimation but want a bit of headroom.
