<div align="center">
    <h1><code>vechain-kit</code></h1>
    <p>
        <strong>An all-in-one library for building VeChain applications</strong>
    </p>
    <img src="https://i.ibb.co/k539SN7/kit-banner.png" alt="VeChain Kit Banner">
</div>

# Features

-   🔌 **Wallet Connection**: VeWorld, Sync2, WalletConnect, VeChain Embedded Wallet, Social Login (Privy)
-   🪝 **React Hooks**: Read and write to the VeChainThor blockchain
-   🧩 **Components**: Pre-built components for wallet operations
-   🌍 **Multilanguage**: Built-in i18n support
-   💰 **Token Operations**: Send tokens, check balances, handle VET domains, and more

> **Note**: Currently supports React and Next.js only

📚 For detailed documentation, visit our [VeChain Kit Docs](https://vechain-foundation-san-marino.gitbook.io/vechain-kit)

Try out the [demo app](https://sample-vechain-app-demo.vechain.org/) to see how it works.

Also check out the [sample app](https://github.com/vechain/vechain-kit/tree/main/examples/next-template) to see how to integrate the library with Next.js.

# Installation

```bash
yarn add @tanstack/react-query@"^5.64.2" @chakra-ui/react@"^2.8.2" @vechain/dapp-kit-react@"1.4.1" @vechain/vechain-kit
```

# Quick Start

## Basic Setup

Import the `VechainKitProvider` provider and wrap your app in it.

```typescript
import { VechainKitProvider } from '@vechain/vechain-kit';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <VechainKitProvider
            // Mandatory
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                // If you want to use WalletConnect
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'Your App',
                        description: 'Your app description',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? `${window.location.origin}/images/logo/my-dapp.png`
                                : '',
                        ],
                    },
                },
            }}
            darkMode={true}
            language="en"
            network={{
                type: 'main',
            }}
        >
            {children}
        </VechainKitProvider>
    );
}
```

This will allow you to connect to wallets (VeWorld, Sync2, WalletConnect) and to use Social Login trhough VeChain.

If you want to have your own Privy app, for enchanced user experience, you can use the `privy` prop.

```typescript
import { VechainKitProvider } from '@vechain/vechain-kit';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <VechainKitProvider
            privy={{
                appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                clientId: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!,
                loginMethods: ['google', 'twitter', 'sms', 'email'],
                appearance: {
                    walletList: ['metamask', 'rainbow'],
                    accentColor: '#696FFD',
                    loginMessage: 'Select a social media profile',
                    logo: 'https://i.ibb.co/ZHGmq3y/image-21.png',
                },
                embeddedWallets: {
                    createOnLogin: 'all-users',
                },
                allowPasskeyLinking: true,
            }}
            ...
        >
            {children}
        </VechainKitProvider>
    );
}
```

## Next.js Integration

To use the library with Next.js, you will need to dynamically import the `VeChainKit` provider in your `_app.tsx` file.

```typescript
import dynamic from 'next/dynamic';

// Dynamic import is used here for several reasons:
// 1. The VechainKit component uses browser-specific APIs that aren't available during server-side rendering
// 2. Code splitting - this component will only be loaded when needed, reducing initial bundle size
// 3. The 'ssr: false' option ensures this component is only rendered on the client side
const VechainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VechainKitProvider,
    {
        ssr: false,
    },
);

export default function App({ Component, pageProps }: AppProps) {
    return (
        <VechainKitProvider>
            <Component {...pageProps} />
        </VechainKitProvider>
    );
}
```

# Usage Guide

## Wallet Connection

### Using the WalletButton Component

```typescript
import { WalletButton } from '@vechain/vechain-kit';

<WalletButton />;
```

### Custom Connection Button

```typescript
import { useConnectModal } from '@vechain/vechain-kit';

const { open } = useConnectModal();

<Button onClick={open}>Connect Wallet</Button>;
```

## Wallet Information

```typescript
import { useWallet } from '@vechain/vechain-kit';

const { account, connection } = useWallet();
```

## Transaction Management

You can use the `useSendTransaction` hook to send transactions to the blockchain, all you will need is to build the clause and pass it to the hook.

```typescript
import { useSendTransaction } from '@vechain/vechain-kit';

const { sendTransaction } = useSendTransaction();
```

And you can mix it with the provided components to create a seamless experience for your users.

```typescript
import {
    TransactionModal,
    useSendTransaction,
    useTransactionModal,
} from '@vechain/vechain-kit';

const MyComponent = () => {
    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
        progress,
    } = useSendTransaction({
        signerAccountAddress: account?.address,
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedWallet.address) return [];

        const clausesArray: any[] = [];
        const abi = new Interface(b3trAbi);
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: abi.encodeFunctionData('transfer', [
                connectedWallet.address,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress(
                connectedWallet.address,
            )}`,
            abi: abi.getFunction('transfer'),
        });

        return clausesArray;
    }, [connectedWallet.address]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    return (
        <Button
            onClick={handleTransactionWithModal}
            isLoading={isTransactionPending}
            isDisabled={isTransactionPending}
        >
            Tx with modal
        </Button>
    );
};
```

You can also use `useSignMessage` and `useSignTypedData` hooks to sign messages and typed data.

## Blockchain Data Reading

The kit provides tons of hooks to read data from the blockchain (VeBetterDAO, veDelegate, vetDomains, balances, etc.)

For example you can use `useGetB3trBalance` to get the balance of the user's wallet.

```typescript
import { useGetB3trBalance } from '@vechain/vechain-kit';

const { data: balance, isLoading, isError } = useGetB3trBalance();
```
