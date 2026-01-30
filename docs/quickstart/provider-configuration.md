# Provider Configuration

This guide covers how to set up and configure the `VeChainKitProvider` in your application.

### Basic Setup

Wrap your app with the `VeChainKitProvider`:

```typescript
'use client';

import { VeChainKitProvider } from "@vechain/vechain-kit";

export function Providers({ children }) {
  return (
    <VeChainKitProvider>
      {children}
    </VeChainKitProvider>
  );
}
```

### Next.js Configuration

For Next.js applications, dynamically import the provider to avoid SSR issues:

```typescript
import dynamic from 'next/dynamic';

const VeChainKitProvider = dynamic(
  async () => (await import('@vechain/vechain-kit')).VeChainKitProvider,
  { ssr: false }
);

export function Providers({ children }) {
  return (
    <VeChainKitProvider>
      {children}
    </VeChainKitProvider>
  );
}
```

### Complete Configuration Example

Here's a comprehensive example with all available options:

```typescript
'use client';

import { VeChainKitProvider } from "@vechain/vechain-kit";

export function VeChainKitProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      // Network Configuration
      network={{
        type: "test", // "main" | "test" | "solo"
      }}
      
      // UI Configuration
      darkMode={false}
      language="en"
      theme={{
          backgroundColor: 'black'
      }}
      
      // Login Modal UI Customization
      loginModalUI={{
        logo: '/your-logo.png',
        description: 'Welcome to our DApp',
      }}
      
      // Login Methods Configuration
      loginMethods={[
        { method: "vechain", gridColumn: 4 },
        { method: "dappkit", gridColumn: 4 },
      ]}
      
      // Sponsor transactions
      feeDelegation={{
          delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
      }}
      
      // Wallet Connection Configuration
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect", "sync2"],
        walletConnectOptions: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          metadata: {
            name: "Your DApp Name",
            description: "Your DApp description visible in wallets",
            url: typeof window !== "undefined" ? window.location.origin : "",
            icons: ["https://your-domain.com/logo.png"],
          },
        },
      }}
    >
      {children}
    </VeChainKitProvider>
  );
}
```

### Configuration Options

#### Network Configuration

```typescript
network: {
  type: "main" | "test" | "solo" // Select mainnet or testnet or solo
}
```

#### Fee Delegation

Configure transaction fee sponsorship:

```typescript
feeDelegation: {
  delegatorUrl: string,           // Fee delegation service URL
}
```

#### Login Methods

Configure available authentication methods with a flexible grid layout:

```typescript
loginMethods: [
  // Always available methods
  { method: "vechain", gridColumn: 4 },    // VeChain social login
  { method: "dappkit", gridColumn: 4 },    // VeChain wallets
  { method: "ecosystem", gridColumn: 4 },  // Ecosystem apps (Mugshot, Cleanify, Greencart, etc.)
  
  // Privy-dependent methods (require your own privy configuration)
  { method: "email", gridColumn: 2 },      // Email login
  { method: "passkey", gridColumn: 2 },    // Passkey authentication
  { method: "google", gridColumn: 4 },     // Google OAuth
  { method: "more", gridColumn: 2 },       // Additional Privy methods
]
```

**Grid Layout**: The `gridColumn` property determines the width of each login option in the modal (based on a 4-column grid).

### Privy Integration (Optional)

To enable social login methods with your own Privy account:

```typescript
<VeChainKitProvider
  privy={{
    appId: "your-privy-app-id",
    clientId: "your-privy-client-id",
    // Additional Privy configuration
  }}
  loginMethods={[
    // Now you can use Privy-dependent methods
    { method: "email", gridColumn: 2 },
    { method: "google", gridColumn: 4 },
    { method: "passkey", gridColumn: 2 },
  ]}
>
  {children}
</VeChainKitProvider>
```

### Ecosystem Apps Configuration

Customize which ecosystem apps appear in the login modal:

```typescript
<VeChainKitProvider
  loginMethods={[
    { method: "ecosystem", gridColumn: 4 }
  ]}
  ecosystemApps={{
    allowedApps: ["app-id-1", "app-id-2"], // Find app IDs in Privy dashboard
  }}
>
  {children}
</VeChainKitProvider>
```

### Best Practices

1. **Dynamic Import**: Always use dynamic import in Next.js to avoid SSR issues
2. **Environment Variables**: Store sensitive configuration in environment variables
3. **Fee Delegation**: Consider your fee delegation strategy based on user experience needs
4. **Login Methods**: Choose login methods that match your target audience
5. **Metadata**: Provide clear app metadata for wallet connection requests

### Next Steps

* Implement Authentication Methods
* Customize UI Theme
* Handle Wallet Interactions
