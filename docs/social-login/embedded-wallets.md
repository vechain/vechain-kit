# Embedded Wallets

When a user initiates a connection through Privy, either directly or via cross-app integration, a secure wallet is immediately created for them. Privy implements a sophisticated key management technique known as key splitting, specifically using Shamir’s secret sharing method. This approach ensures that users retain full custody of their wallets without needing to manage any secret keys themselves. Importantly, neither Privy nor any integrated application ever accesses the user's keys; these secrets are only reconstituted directly on the user's device during the signing of messages or transactions. This process guarantees the utmost security and privacy for the user's onchain activities.

This type of wallet created by Privy is called Embedded Wallet.

#### Seamless Wallet Integration

Users benefit from an intuitively integrated wallet management experience that aligns seamlessly with their existing accounts, removing any unnecessary technical barriers. Applications built with Privy can generate wallets automatically for new accounts, such as those registered with an email address or phone number, even before the user logs in for the first time. Additionally, Privy provides users with the option to export their wallet keys, serving as an escape mechanism should they choose to transition away from Privy’s services at any point.

### Using wallets across apps[​](https://docs.privy.io/guide/embedded-wallets#using-wallets-across-apps) <a href="#using-wallets-across-apps" id="using-wallets-across-apps"></a>

Privy embedded wallets are portable and can be used by any app––even apps not using Privy. Privy’s cross application wallet system supports interoperability with simple user experiences accessible to everyone, and seamlessly integrates with other Privy integrations and wallet connector solutions like RainbowKit and wagmi.

<figure><img src="../.gitbook/assets/image (2) (1).png" alt=""><figcaption><p>Sample cross app wallet flow</p></figcaption></figure>

Embedded wallets can be backed up by the user through the VeChain Kit modal in the Settings page.

Many login methods can be attached to the Embedded Wallet.
