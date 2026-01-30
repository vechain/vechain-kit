# Migrate from DAppKit

1\) Install and overwrite the Provider.

2\) Replace all imports of `@vechain/dapp-kit-react` `@vechain/dapp-kit` and `@vechain/dapp-kit-ui` with **`@vechain/vechain-kit.`**

3\) Wherever you use the `account` property from the `useWallet()` hook you need to access the user address differently:

```typescript
// dapp-kit
const { account } = useWallet()
console.log(account) // 0x000000dsadsa

// vechain-kit
const { account } = useWallet()
console.log(account.address, account.domain, account.image)
```

4\) Use the `useSendTransaction()` hook from `@vechain/vechain-kit` to send your transactions to the network. \
Read how to use the hook [here](../quickstart/send-transactions.md).

6\) If you use useConnex() by importing from dapp-kit, import it from vechain-kit.

7\) If you are using certificate signing to authenticate your users with your backend to issue a jwt/session token you will need to switch to use signTypedData instead, since Privy and Smart Accounts does not support the VeChain certificate authentication signature type. Read how to do [here](../sign-messages.md).

8\) Double-check your `yarn.lock` to see that all the `@vechain/dapp-kit-react` `@vechain/dapp-kit` and `@vechain/dapp-kit-ui` installs are using the the 1.5.0 version.

{% hint style="danger" %}
Remove all installations of @vechain/dapp-kit @vechain/dapp-kit-ui and @vechain/dapp-kit-react from your app. If you need some specific hooks or methods from dapp-kit you can import them directly from the @vechain/vechain-kit.
{% endhint %}

