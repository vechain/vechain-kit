# Smart Accounts v1 to v3

Upgrading to[ **Smart Account v3**](../social-login/smart-accounts.md) unlocks **multi-clause support**, **enhanced security**, and other essential features for transactions on VeChain. This feature is available in VeChain Kit from [v1.5.0](https://github.com/vechain/vechain-kit/releases/tag/1.5.0).

When integrating social login in your app, users might have a version 1 smart account. This version doesn’t support multiclause transactions, potentially causing issues within your app.

To address this scenario, consider wrapping your `onClick` handler or using another suitable method to prompt users to upgrade their smart accounts to version 3.

The kit makes available both the hooks to know if the upgrade is required and the component for upgrading:

* **`useUpgradeRequired(smartAccountAddress, ownerAddress, targetVersion: 3)`** is the hook that will let you know if the user is on v1 and needs to upgrade to v3
* **`useUpgradeSmartAccountModal()`** is the hook that will allow you to open the upgrade modal, that the user will use to upgrade.
* You can also handle this with your own UI by using the **`useUpgradeSmartAccount(smartAccountAddress, targetVersion: 3)`** hook.

View other useful hooks [here](/broken/pages/8wxpoC4K6414le5r9cSu).

### Example usage

```typescript
"use-client"

import { useConvertB3tr } from "@/hooks"
import { useWallet, useUpgradeRequired, useUpgradeSmartAccountModal } from "@vechain/vechain-kit"

// Example component allowing for B3TR to VOT3 conversion
export const ConvertModal = ({ isOpen, onClose }: Props) => {
  const { account, connectedWallet, connection } = useWallet()

  const isSmartAccountUpgradeRequired = useUpgradeRequired(
    account?.address ?? "",
    connectedWallet?.address ?? "",
    3
  )

  const { open: openUpgradeModal } = useUpgradeSmartAccountModal()
  
  // A custom convert b3tr to vot3 hook
  const convertB3trMutation = useConvertB3tr({
    amount,
  })

  const handleConvertB3tr = useCallback(() => {
    if (connection.isConnectedWithPrivy && isSmartAccountUpgradeRequired) {
      //Open Upgrade Modal
      openUpgradeModal()
      return
    }

    convertB3trMutation.resetStatus()
    convertB3trMutation.sendTransaction(undefined)
  }, [isSmartAccountUpgradeRequired, convertB3trMutation, openUpgradeModal, connection])


  return (
    <button onClick={handleConvertB3tr}> Convert my B3TR to VOT3 </button>
  )
}
```

{% hint style="success" %}
You can customize the color button and size of the imported modal from the kit:

```typescript
const { open: openUpgradeSmartAccountModal } = useUpgradeSmartAccountModal({
    accentColor: '#000000',
    modalSize: 'xl',
});
```
{% endhint %}

### Example demo

#### With UI from the Kit

{% embed url="https://streamable.com/hyritw" %}

#### With custom UI

{% embed url="https://streamable.com/wrpzo4" %}
