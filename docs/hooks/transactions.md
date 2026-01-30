# Transactions

## Transaction Hooks

The hooks provide tools for handling transactions on VeChain:

### Core Transaction Hooks

* `useSendTransaction`: Core hook for sending any transaction, supporting both Privy and VeChain wallets
* `useTransferERC20`: Hook for sending ERC20 token transfers
* `useTransferVET`: Hook for sending native VET token transfers

### Types

```typescript
// Transaction Types
type TransactionStatus = 'ready' | 'pending' | 'waitingConfirmation' | 'success' | 'error';

type TransactionStatusErrorType = {
    type: 'UserRejectedError' | 'RevertReasonError';
    reason: string;
};

type EnhancedClause = {
    to: string;
    value?: string;
    data?: string;
    comment?: string;
    abi?: any;
};

interface TransactionHookReturnValue {
    sendTransaction: (clauses?: TransactionClause[]) => Promise<void>;
    isTransactionPending: boolean;
    isWaitingForWalletConfirmation: boolean;
    txReceipt: TransactionReceipt | null;
    status: TransactionStatus;
    resetStatus: () => void;
    error?: TransactionStatusErrorType;
}

interface TransferVETParams {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface TransferERC20Params {
    fromAddress: string;
    receiverAddress: string;
    amount: string;
    tokenAddress: string;
    tokenName: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface SendTransactionParams {
    signerAccountAddress: string;
    clauses: EnhancedClause[];
    onTxConfirmed?: () => void;
    onTxFailedOrCancelled?: () => void;
}
```

### Usage example

```typescript
// Example usage of Transaction hooks
import { 
    useSendTransaction,
    useTransferERC20,
    useTransferVET 
} from '@vechain/vechain-kit';

const ExampleComponent = () => {
    // Example of sending VET
    const { 
        sendTransaction: sendVET,
        isTransactionPending: isVETPending,
        status: vetStatus,
        error: vetError 
    } = useTransferVET({
        fromAddress: "0x...",
        receiverAddress: "0x...",
        amount: "1.5",
        onSuccess: () => console.log("VET transfer successful"),
        onError: () => console.log("VET transfer failed")
    });

    // Example of sending ERC20 tokens
    const {
        sendTransaction: sendToken,
        isTransactionPending: isTokenPending,
        status: tokenStatus,
        error: tokenError
    } = useTransferERC20({
        fromAddress: "0x...",
        receiverAddress: "0x...",
        amount: "100",
        tokenAddress: "0x...",
        tokenName: "TOKEN",
        onSuccess: () => console.log("Token transfer successful"),
        onError: () => console.log("Token transfer failed")
    });

    // Example of custom transaction
    const {
        sendTransaction: sendCustomTx,
        isTransactionPending: isCustomPending,
        status: customStatus,
        error: customError
    } = useSendTransaction({
        signerAccountAddress: "0x...",
        clauses: [
            {
                to: "0x...",
                value: "0x0",
                data: "0x...",
                comment: "Custom transaction"
            }
        ],
        onTxConfirmed: () => console.log("Custom transaction successful"),
        onTxFailedOrCancelled: () => console.log("Custom transaction failed")
    });

    const handleVETTransfer = async () => {
        try {
            await sendVET();
        } catch (error) {
            console.error("VET transfer error:", error);
        }
    };

    const handleTokenTransfer = async () => {
        try {
            await sendToken();
        } catch (error) {
            console.error("Token transfer error:", error);
        }
    };

    const handleCustomTransaction = async () => {
        try {
            await sendCustomTx();
        } catch (error) {
            console.error("Custom transaction error:", error);
        }
    };

    return (
        <div>
            <button 
                onClick={handleVETTransfer} 
                disabled={isVETPending}
            >
                Send VET
            </button>
            <button 
                onClick={handleTokenTransfer} 
                disabled={isTokenPending}
            >
                Send Tokens
            </button>
            <button 
                onClick={handleCustomTransaction} 
                disabled={isCustomPending}
            >
                Send Custom Transaction
            </button>

            {/* Status displays */}
            {vetStatus === 'pending' && <div>VET Transfer Pending...</div>}
            {tokenStatus === 'pending' && <div>Token Transfer Pending...</div>}
            {customStatus === 'pending' && <div>Custom Transaction Pending...</div>}

            {/* Error displays */}
            {vetError && <div>VET Error: {vetError.reason}</div>}
            {tokenError && <div>Token Error: {tokenError.reason}</div>}
            {customError && <div>Custom Error: {customError.reason}</div>}
        </div>
    );
};

export default ExampleComponent;

/*
Note: These hooks require:
- Valid thor connection
- Network configuration
- Valid wallet connection
- For ERC20 transfers: valid token contract address
- All amounts should be in their base units (e.g., wei for VET)
*/
```
