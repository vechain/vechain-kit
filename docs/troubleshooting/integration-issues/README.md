# Integration Issues

Runtime and functionality problems that occur when integrating VeChain Kit into your application.

### Common Problems

* Fee delegation conflicts with existing setup
* Browser popup blocking for social login users
* Transaction failures due to configuration issues
* Signing delays causing security restrictions

### Quick Fixes

* **Remove existing fee delegation** before using VeChain Kit's delegation
* **Pre-fetch data** before triggering transactions to avoid popup blocking
* **Check configuration** for proper delegation settings

### Issues in This Section

[Fee Delegation](fee-delegation.md)

Resolving conflicts when migrating from existing fee delegation setups and configuring VeChain Kit's delegation properly.

#### [Privy Popup Blocking](./#privy-popup-blocking)

Preventing browser popup blocking for social login users by properly structuring transaction flows.

***

**Can't find your issue?** Search our [GitHub Issues](https://github.com/vechain/vechain-kit/issues) or ask on [Discord](https://discord.com/invite/vechain).
