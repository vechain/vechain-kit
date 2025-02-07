<div align="center">
    <h1><code>vechain-kit</code></h1>
    <p>
        <strong>An all-in-one library for building VeChain applications</strong>
    </p>
    <img src="https://i.ibb.co/k539SN7/kit-banner.png" alt="VeChain Kit Banner">
</div>

VeChain Kit is a comprehensive library designed to make building VeChain applications fast and straightforward.

It offers:

-   <b>Seamless Wallet Integration:</b> Support for VeWorld, Sync2, WalletConnect, VeChain Embedded Wallet, and social logins (powered by Privy).
-   <b>Unified Ecosystem Accounts:</b> Leverage Privy’s Ecosystem feature to give users a single wallet across multiple dApps, providing a consistent identity within the VeChain network.
-   <b>Developer-Friendly Hooks:</b> Easy-to-use React Hooks that let you read and write data on the VeChainThor blockchain.
-   <b>Pre-Built UI Components:</b> Ready-to-use components (e.g., TransactionModal) to simplify wallet operations and enhance your users’ experience.
-   <b>Multi-Language Support:</b> Built-in i18n for a global audience.
-   <b>Token Operations:</b> Send tokens, check balances, manage VET domains, and more—all in one place.

> **Note**: Currently supports React and Next.js only

📚 For detailed documentation, visit our [VeChain Kit Docs](https://docs.vechain-kit.vechain.org/)

## Demo & Examples

-   [Live Demo](https://vechain-kit.vechain.org/)
-   [Sample Next.js App](https://github.com/vechain/vechain-kit/tree/main/examples/next-template)
-   [Smart Account Factory](https://vechain.github.io/smart-accounts-factory/)

# Installation

```bash
yarn add @tanstack/react-query@"^5.64.2" @chakra-ui/react@"^2.8.2" @vechain/dapp-kit-react@"1.5.0" @vechain/vechain-kit
```

# Quick Start

### Define Provider

```typescript
'use client';

import VeChainKitProvider from '@vechain/vechain-kit';
export function VeChainKitProviderWrapper({ children }: Props) {
    return (
        <VechainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'sync2'],
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
const VeChainKitProviderWrapper = dynamic(
    async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
    {
        ssr: false,
    },
);
interface Props {
    children: React.ReactNode;
}
```

### Available Login Methods

The modal supports several authentication methods:

-   Social Login - Email and Google authentication through Privy (only available for self hosted Privy)
-   VeChain Login - Direct VeChain wallet authentication
-   Passkey - Biometric/device-based authentication (only available for self hosted Privy)
-   DappKit - Connection through VeWorld or other VeChain wallets
-   Ecosystem - Cross-app authentication within the VeChain ecosystem
-   More Options - Additional Privy-supported login methods (only available for self hosted Privy)

#### Configuration

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
        { method: 'email', gridColumn: 2 },
        { method: 'passkey', gridColumn: 2 },
    ]}
>
    {children}
</VeChainKitProvider>
```

#### Ecosystem button

The ways to show the ecosystem login button are:

1. You define "ecosystem" in the loginMethods in the config
2. You do not define the loginMethods in the config, so we default to showing the ecosystem login button

To not show the ecosystem login button, you must explicitly define the loginMethods array in the config and not include ecosystem in the options.

By default we have a list of default apps that will be shown as ecosystem login options. If you want to customize this list you can pass the `allowedApps` array prop. You can find the app ids in the [Ecosystem](https://dashboard.privy.io/) tab in the Privy dashboard.

### Setup Fee Delegation (mandatory)

Fee delegation is mandatory in order to use this kit. Learn how to setup fee delegation in the following guide:

[Fee Delegation](https://app.gitbook.com/o/PqN0Gs1QEzg8tbeJCHXC/s/S8udqSGhGctlwwL1kst7/~/changes/42/vechain-kit/fee-delegation)

### Setup Privy (optional)

If you already use Privy you can pass an additional prop with you settings and you will be able to access Privy SDK, customizing the login modal based on your needs.

Pros of self hosting Privy:

-   No UI confirmations on users transactions
-   Allow your users to backup their keys and update security settings directly in your app
-   Targetted social login methods

Cons:

-   Price
-   Responsibilities to correctly secure your Privy account, since it contains access to user's wallet settings
-   Your users will need to login into other apps through ecosystem mode

To setup Privy you need to add the following parameters:

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
            //other props
        >
            {children}
        </VechainKitProvider>
    );
}
```

Go to privy.io and create an app. You will find the APP ID and the CLIENT ID in the App Settings tab.
For further information on how to implement Privy SDK please refer to their [docs](https://docs.privy.io/)

This project uses:

-   `@privy-io/react-auth` for Privy connection type
-   `@privy-io/cross-app-connect` for ecosystem cross app connection

You can import privy from the kit as

```typescript
import { usePrivy } from '@vechain/vechain-kit';

const { user } = usePrivy();
```

### Use the kit

Once you setup the kit provider and created your fee delegation service you are good to go and you can allow your users to login.

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

# Usage Guide

## Wallet Information

The `useWallet` hook provides a unified interface for managing wallet connections in a VeChain application, supporting multiple connection methods including social logins (via Privy), direct wallet connections (via DappKit), and cross-application connections.
This will be the hook you will use more frequently and it provides quite a few useful informations.

```typescript
import { useWallet } from "@vechain/vechain-kit";

function MyComponent = () => {
    const {
        account,
        connectedWallet,
        smartAccount,
        dappKitWallet,
        embeddedWallet,
        crossAppWallet,
        privyUser,
        connection,
        disconnect
    } = useWallet();

    return <></>
}
```

## Transaction Management

You need to use the `useSendTransaction` hook to send transactions to the blockchain, all you will need is to build the clause and pass it to the hook.

This hook will take care of checking your connection type and handle the transaction submission between privy, cross-app and wallet connections.
When implementing VeChain Kit it is mandatory to use this hook to send transaction.

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
        progress,
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
                progress={progress}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showSocialButtons={true}
                showExplorerButton={true}
                onTryAgain={handleTransactionWithModal}
                showTryAgainButton={true}
            />
        </>
    );
}
```

You can also use `useSignMessage` and `useSignTypedData` hooks to sign messages and typed data.

## Blockchain Data Reading

The kit provides hooks for developers to interact with smart contracts like VeBetterDAO, VePassport, veDelegate, and price oracles. These hooks work with react-query, improving query capabilities by caching responses and offering real-time states like isLoading and isError. This helps developers manage and update user interfaces effectively, ensuring a responsive experience.

For example you can use `useGetB3trBalance` to get the balance of the user's wallet.

```typescript
import { useGetB3trBalance } from '@vechain/vechain-kit';

const { data: balance, isLoading, isError } = useGetB3trBalance('0x.....');

console.log(balance.formatted, balance.original, balance.scaled);
```
