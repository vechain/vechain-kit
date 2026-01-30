# Intro

## Component Overview

All views of the kit (Receive, Send tokens, Swap, Profile, Settings, Notifications, Ecosystem, etc.) can be opened isolated by the other parts of the app, so you could add your own custom receive button that on click will open the Receive modal of the kit.

```typescript
const { open: openProfileModal } = useProfileModal();

// Open profile modal in isolated mode
openProfileModal({ isolatedView: true });
```

The hook offers a versatile suite of components for seamless integration into web applications. Below are some of the key components:

* **Wallet Button**: Dynamically triggers either a login or account modal based on the user's connection status.
* **Transaction Components:** A set of components that will guide the user through the transaction lifecycle (confirm -> loading -> success/error). You can use both a modal or a toast.
* **DAppKitWalletButton**: Provides a focused interface for selecting wallet connection options, in case you do not want social login.

These components collectively enhance user interaction and streamline.

Head over the [VeChain Kit homepage](https://vechainkit.vechain.org/) to see all the components in action.
