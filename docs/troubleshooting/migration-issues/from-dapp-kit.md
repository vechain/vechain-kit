# From DApp Kit

If you're coming from DApp Kit or SDK, you may have version conflicts from different versions installed across your project.

{% hint style="info" %}
VeChain Kit includes DApp Kit functionality, but still requires @vechain/dapp-kit-react as a peer dependency for compatibility.
{% endhint %}

### Problem

Multiple versions of DApp Kit packages can cause:

* Version conflicts between different parts of your project
* Runtime errors from competing implementations
* Unexpected behaviour from mixed package versions

### Solution

1. Completely Remove DApp Kit Packages

Remove all existing DApp Kit packages from your project:

```bash
npm uninstall @vechain/dapp-kit @vechain/dapp-kit-react @vechain/dapp-kit-ui
```

2. Completely Remove DApp Kit Packages

VeChain Kit provides similar functionality with updated component names:

```bash
// X Old DApp Kit
import { ConnectWallet } from '@vechain/dapp-kit-react';

// ✅ New VeChain Kit
import { WalletButton } from '@vechain/vechain-kit';
```

3. Clean Installation

After removing old packages:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Component Mapping**

| DApp Kit                     | VeChain Kit                              |
| ---------------------------- | ---------------------------------------- |
| ConnectWallet                | WalletButton                             |
| \<other dapp-kit components> | \<available through VeChain Kit exports> |

#### **Verification**

Ensure clean migration:

* No `dapp-kit` packages in `package.json`
* All imports updated to use `@vechain/vechain-kit`
* Component names updated to VeChain Kit equivalents
