# Chakra Conflicts

VeChain Kit components are wrapped in their own Chakra Provider (v2), ensuring consistent styling throughout the modals. This can cause conflicts if your app also uses Chakra UI.

### Problem

* VeChain Kit components not rendering correctly
* Theme conflicts when your app uses Chakra UI
* Missing styles or unexpected appearance

### Solution

#### Install Chakra UI

Even if you don't use Chakra in your app, it's required as a peer dependency:

```bash
yarn add @chakra-ui/react@2.8.2
```

#### Setup ChakraProvider

Wrap your app with `ChakraProvider` and include `ColorModeScript`:

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption><p>One common issue, solvable by installing Chakra and defining &#x3C;ColorModeScript /></p></figcaption></figure>

```bash
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { VeChainKitProvider } from "@vechain/vechain-kit";
import {
  ChakraProvider,
  ColorModeScript,
  useColorMode,
} from "@chakra-ui/react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persister, queryClient } from "./utils/queryClient.ts";

export const AppWrapper = () => {
  const { colorMode } = useColorMode();

  return (
    <VeChainKitProvider
      // ... your config
    >
      <App />
    </VeChainKitProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ChakraProvider theme={stargateStakingTheme}>
        <ColorModeScript initialColorMode="dark" />
        <AppWrapper />
      </ChakraProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
```

#### Key Requirements

The essential setup:

```bash
<ChakraProvider theme={stargateStakingTheme}>
    <ColorModeScript initialColorMode="dark" />
    <AppWrapper />
</ChakraProvider>
```

#### **Framework Flexibility**

You can keep using whatever frontend framework you prefer. The important part is defining the `ChakraProvider` wrapper for VeChain Kit components to function properly.

#### Common Issue&#x20;

One common issue is missing the `<ColorModeScript />` component, which can cause styling inconsistencies. Always include it within your ChakraProvider.
