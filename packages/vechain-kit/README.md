#### An all-in-one library for building VeChain applications.

<div align="center">
    <img src="https://prod-vechainkit-docs-images-bucket.s3.eu-west-1.amazonaws.com/intro.png" alt="VeChain Kit Banner">
</div>

## Introduction

VeChain Kit is a comprehensive library designed to make building VeChain applications fast and straightforward.

It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, VeChain Embedded Wallet, and social logins (powered by Privy).
-   <b>Unified Ecosystem Accounts:</b> Leverage Privy’s Ecosystem feature to give users a single wallet across multiple dApps, providing a consistent identity within the VeChain network.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.
-   <b>Multi-Language Support:</b> Built-in i18n for a global audience.
-   <b>Token Operations:</b> Send tokens, check balances, manage VET domains, and more—all in one place.

> **Note**: Currently supports React and Next.js only

📚 For detailed documentation, visit our [VeChain Kit Docs](https://docs.vechainkit.vechain.org/)

## Demo & Examples

-   [Live Demo](https://vechainkit.vechain.org/)
-   [Sample Next.js App](https://github.com/vechain/vechain-kit/tree/main/examples/next-template)
-   [Smart Account Factory](https://vechain.github.io/smart-accounts/)

# Installation

```bash
yarn add @tanstack/react-query@"^5.64.2" @chakra-ui/react@"^2.8.2" @vechain/dapp-kit-react@"2.0.4" @vechain/vechain-kit
```

# Quick Start

### Define Provider

```typescript
'use client';

import { VeChainKitProvider } from '@vechain/vechain-kit';

export function VeChainKitProviderWrapper({ children }: Props) {
    return (
        <VechainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
            ]}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId:
                        // Get this on https://cloud.reown.com/sign-in
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'Your App Name',
                        description:
                            'This is the description of your app visible in VeWorld upon connection request.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: ['https://path-to-logo.png'],
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

On Next.js you will need to dynamically load the import

```typescript
import dynamic from 'next/dynamic';
const VeChainKitProvider = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);
interface Props {
    children: React.ReactNode;
}
```

### Login Methods

The modal implements a dynamic grid layout system that can be customized through the `loginMethods` configuration.

The modal can be configured through the `VeChainKitProvider` props.

```typescript
<VeChainKitProvider
    loginModalUI={{
        logo: '/your-logo.png',
        description: 'Custom login description',
    }}
    loginMethods={[
        { method: 'vechain', gridColumn: 4 },
        { method: 'dappkit', gridColumn: 4 }, // VeChain wallets, always available
        { method: 'ecosystem', gridColumn: 4 }, // Mugshot, Cleanify, Greencart, ...
        { method: 'email', gridColumn: 2 }, // only available with your own Privy
        { method: 'passkey', gridColumn: 2 }, // only available with your own Privy
        { method: 'google', gridColumn: 4 }, // only available with your own Privy
        { method: 'more', gridColumn: 2 }, // will open your own Privy login, only available with your own Privy
    ]}
    allowCustomTokens={false} // allow the user to manage custom tokens
>
    {children}
</VeChainKitProvider>
```

### Setup Fee Delegation (mandatory if allowing social login)

Fee delegation is mandatory if you want to use this kit with social login. Learn how to setup fee delegation in the following guide:

[Fee Delegation](https://docs.vechainkit.vechain.org/vechain-kit/fee-delegation)

### Show the login button

Once you set up the kit provider, you are good to go, and you can allow your users to login, customizing the login experience based on your needs.

#### Wallet Button

You can use this component by importing it from the kit, it will handle for you the connection state and show a login button if the user is disconnected or the profile button when the user is connected.

```typescript
'use client';

import { WalletButton } from '@vechain/vechain-kit';

export function Page() {
    return <WalletButton />;
}
```

#### Custom button

Alternatively, you can create your own custom button and invoke the connect modal or account modal based on your needs.

```typescript
'use client';

import {
    useConnectModal,
    useAccountModal,
    useWallet,
} from '@vechain/vechain-kit';

export function Page() {
    const { connection } = useWallet();

    const {
        open: openConnectModal,
        close: closeConnectModal,
        isOpen: isConnectModalOpen,
    } = useConnectModal();

    const {
        open: openAccountModal,
        close: openAccountModal,
        isOpen: isAccountModalOpen,
    } = useAccountModal();

    if (!connection.isConnected) {
        return <button onClick={openConnectModal}> Connect </button>;
    }

    return <button onClick={openAccountModal}> View Account </button>;
}
```

# Hooks

The kit provides hooks for developers to interact with smart contracts like VeBetterDAO, VePassport, veDelegate, and price oracles.

The hooks in this package provide a standardized way to interact with various blockchain and web services. All hooks are built using TanStack Query (formerly React Query), which provides powerful data-fetching and caching capabilities.

## Main Hooks

### useWallet

The `useWallet` hook will be the one you will use more frequently and it provides quite a few useful informations like the connected account, the connected wallet, the smart account, the dappkit wallet, the embedded wallet, the cross app wallet, the privy user and the connection status.

```typescript
import { useWallet } from "@vechain/vechain-kit";

function MyComponent = () => {
    const {
        account,
        connectedWallet,
        smartAccount,
        connection,
        disconnect
    } = useWallet();

    return <></>
}
```

### useSendTransaction

This hook will take care of checking your connection type and handle the transaction submission between privy, cross-app and wallet connections.
When implementing VeChain Kit it is mandatory to use this hook to send transaction.

```typescript
'use client';

import {
    useWallet,
    useSendTransaction,
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

    // This is the function triggering the transaction and opening the modal
    const handleTransaction = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses, openTransactionModal]);

    return (
        <>
            <button
                onClick={handleTransactionWithModal}
                isLoading={isTransactionPending}
                isDisabled={isTransactionPending}
            >
                Send B3TR
            </button>
        </>
    );
}
```

## Blockchain Data Reading

The kit provides hooks for developers to interact with smart contracts like VeBetterDAO, VePassport, veDelegate, and price oracles. These hooks work with react-query, improving query capabilities by caching responses and offering real-time states like isLoading and isError. This helps developers manage and update user interfaces effectively, ensuring a responsive experience.


### Contract Getters Package

VeChain Kit now makes use of and maintains two external packages:

* [`contract-getters`](https://www.npmjs.com/package/@vechain/contract-getters) — standardized methods for fetching blockchain data
* [`contracts-types`](https://www.npmjs.com/package/@vechain/vechain-contract-types) — TypeScript contract interfaces and type definitions

The `contract-getters` package provides efficient methods for:

* **Avatar Management**: Retrieve user avatars and profile information
* **Token Balances**: Fetch B3TR and VOT3 balances
* **Domain Services**: Resolve domain addresses or get user-owned domains
* **Smart Contract Data**: Access information from core VeChain ecosystem contracts

Together, these packages ensure consistent data-fetching patterns across the ecosystem and deliver optimized queries for better performance.

### Usage Example

For example you can use `useGetB3trBalance` to get the balance of the user's wallet which is using `getB3trbalance` from `contract-getters`:

```typescript
import { useGetB3trBalance } from '@vechain/vechain-kit';

const { data: balance, isLoading, isError } = useGetB3trBalance('0x.....');

console.log(balance.formatted, balance.original, balance.scaled);
```

# Resources

Read the complete documentation on [VeChain Kit Docs](https://docs.vechainkit.vechain.org/)

Are you having issues using the kit? Join our discord server to receive support from our devs or open an issue on our Github!

Check our [Troubleshooting](https://docs.vechainkit.vechain.org/vechain-kit/troubleshooting) section.

Contact us on [Discord](https://discord.gg/wGkQnPpRVq)

Open an issue on [Github](https://github.com/vechain/vechain-kit/issues)
