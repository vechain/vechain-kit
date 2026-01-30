---
description: How to install and set up VeChain Kit in your project
---

# Installation

### Get the template

Only one command to setup

```bash
$ npx create-vechain-dapp@latest

? Select template ›
    ❯ VeChain Kit Next.js Template (Chakra, React Query, SDK)
```

Or you can install the kit in your package as follows.

### Quick-start

{% stepper %}
{% step %}
### Install `@vechain/vechain-kit`

{% code fullWidth="true" expandable="true" %}
```shellscript
yarn add @vechain/vechain-kit
```
{% endcode %}
{% endstep %}

{% step %}
### Install peer dependencies

VeChain Kit builds on a few carefully chosen libraries to deliver a better overall experience, bringing powerful tools together while keeping the integration on your side as simple as possible.

```shellscript
yarn add @chakra-ui/react@^2.8.2 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0 \
  @tanstack/react-query@^5.64.2 \
  @vechain/dapp-kit-react@2.1.0-rc.1 \
  framer-motion@^11.15.0
```
{% endstep %}

{% step %}
### Setup provider

Wrap your app with the `VechainKitProvider` at the root of your application.

This provider brings together VeWorld’s native VeChain integration (web3) and Privy’s social login wallet support (web2).

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
{% endstep %}

{% step %}
### Enjoy!

With VeChain Kit’s snippets and primitive components, you can plug in wallet login and fetch key data much faster.

<pre class="language-typescript"><code class="lang-typescript"><strong>"use client";
</strong>import { WalletButton } from "@vechain/vechain-kit";


const Demo = () => {
  return (
    &#x3C;div>
       &#x3C;WalletButton /> {/* Login Button */}
       &#x3C;p>{account?.address}&#x3C;/p> {/* Address of the connected account */}
    &#x3C;/div>
  )
}
</code></pre>
{% endstep %}
{% endstepper %}

{% hint style="danger" %}
Only supported on React and Next.js
{% endhint %}

{% hint style="warning" %}
React query, chakra and dapp-kit are peer dependencies.
{% endhint %}
