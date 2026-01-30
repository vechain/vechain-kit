# Should I use it?

VeChain provides a robust set of technologies to facilitate app development, including the VeChain Kit, DApp Kit, and SDKs. This section will guide you through these resources, helping you make informed decisions to choose the most suitable tool for your application's needs.

### VeChain [SDK](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk)

* Similar to viem
* Optimized for backend development and scripting tasks.
* Establish wallet connections from scratch for full control and customization of transactions.

The SDK is ideal for developers seeking to harness the power of VeChainThor in their backend architecture or script-based solutions.

### [DApp Kit](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)

* The DApp Kit is designed to be a lightweight library, handling only essential blockchain features.
* Only allows connection with VeWorld, Wallet Connect and Sync2
* Does not provide hooks for sending transactions, SDK must be used for that
* Supports multiple framworks (React, Next, Svelte, Vue, Angular)

DApp Kit is ideal to who wants a lightweight package, that handles only the essential.

### VeChain Kit

* It uses both dappkit and sdk under the hood, so you have all the functionalities of above
* You have social login
* You have out of the box components, hooks, and functionalities
* Only supports Next and React frameworks

## Which one to use?

### Do you want social login?

If yes, you need to go with VeChain Kit, or build your social login implementation on your own.

### Do you want to enhance your app with the VeChaikit UI components?

If you want to allow your users to swap, send tokens, view balances, switch account out of the box then you need to use VeChain Kit.

### Do you want out of the box hooks for transactions, signings, avatars, etc.?

Then you can use the VeChain Kit, it has all the hooks you may need, and more will be added.

