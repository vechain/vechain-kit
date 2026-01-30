# Smart Accounts

Our [smart accounts](https://github.com/vechain/smart-accounts) are a simplified version of the Account Abstraction pattern, made for the VeChain blockchain, and are required in order to enable social login.

### Addresses

#### Mainnet

[0xC06Ad8573022e2BE416CA89DA47E8c592971679A](https://vechainstats.com/account/0xc06ad8573022e2be416ca89da47e8c592971679a/)

#### Testnet

[0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF](https://explore-testnet.vechain.org/accounts/0x713b908bcf77f3e00efef328e50b657a1a23aeaf)

{% hint style="info" %}
Every wallet on VeChain owns a smart account. The address of your smart account is deterministic, and it can be deployed at any time, and receive tokens even if it is not deployed yet.
{% endhint %}

{% hint style="warning" %}
Testnet Factory address changed from v1 to v3 from `0x7EABA81B4F3741Ac381af7e025f3B6e0428F05Fb` to  `0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF` which will cause all your testnet smart account addresses to change when upgrading to v1.5.0.
{% endhint %}

### Contracts

There are 2 contracts that work together to enable social login and account abstraction:

* **SimpleAccount**: A smart contract wallet owned by the user that can:
  * Execute transactions directly from the owner or through signed messages
  * Handle both single and batch transactions
* **SimpleAccountFactory**: Factory contract that creates and manages SimpleAccount contracts:
  * Creates new accounts with deterministic addresses using CREATE2
  * Get the account address of a smart account without deploying it
  * Supports multiple accounts per owner through custom salts
  * Manages different versions of the SimpleAccount implementation

### How it works

1. **Account Creation**: When a user wants to create a smart account, they interact with the `SimpleAccountFactory`, which creates a new `SimpleAccount` instance with the user as the owner.
2. **Transaction Execution**: The `SimpleAccount` can execute transactions in several ways:
   * Direct execution by the owner
   * Batch execution of multiple transactions
   * Signature-based execution (useful for social login) - _Deprecated, should avoid using this_
   * Batch signature-based execution with replay protection (useful for social login + multiclause)
   * Batch signature-based execution with 16-bit chain ID to allow iOS and Android developers handle VeChain chain ID.
3. **Nonce Management**: For batch transactions with authorization (`executeBatchWithAuthorization`), a nonce is required to protect users against replay attacks:
   * The nonce should be generated when requesting the signature
   * Best practice is to use `Date.now()` as the nonce value
   * Each nonce can only be used once per account
   * Without proper nonce management, malicious actors could replay the same signed transaction multiple times
   * Nonces are only used and required for `executeBatchWithAuthorization` method
4. **Social Login Integration**: This system enables social login by creating deterministic account addresses for each user and allowing transactions to be signed off-chain and executed by anyone. This creates a seamless experience where users can interact with dApps using their social credentials.

### Version Management

The system has evolved through multiple versions to improve functionality and security:

* **SimpleAccount**:
  * V1: Basic account functionality with single transaction execution
  * V2: _Skipped for misconfiguration during upgrade_
  * V3: Introduced batch transactions with nonce-based replay protection, ownership transfer and version tracking
* **SimpleAccountFactory**:
  * V1: Basic account creation and management
  * V2: Added support for multiple accounts per owner using custom salts
  * V3: Support for V3 SimpleAccounts, enhanced version management and backward compatibility with legacy accounts

The factory maintains compatibility with all account versions, ensuring a smooth experience across different dApps and versions.

{% hint style="warning" %}
Testnet Factory address changed from v1 to v3 from `0x7EABA81B4F3741Ac381af7e025f3B6e0428F05Fb` to  `0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF` which will cause all your testnet smart account addresses to change.
{% endhint %}

### Smart Accounts V3 upgrade

Upgrading the user's smart accounts from V1 to V3 is mandatory, in order to protect against reply attacks and to allow multiclause transactions on VeChain.

To facilitate the mandatory upgrade process, the kit now includes:

* **Built-in Check**: Automatically displays an alert prompting users to upgrade if they possess a V1 smart account.
* **Hooks & Component**: To avoid apps spending VTHO to upgrade accounts of users that won't do any action on the app we allow the developer to check upgradeability on demand by using the `useUpgradeRequiredForAccount` hook and show the `UpgradeSmartAccountModal` (importable from the kit).

<figure><img src="../.gitbook/assets/image (8).png" alt=""><figcaption><p>Example of the upgrade modal</p></figcaption></figure>

### Hooks

Developers can efficiently manage smart accounts using a [variety of hooks](/broken/pages/8wxpoC4K6414le5r9cSu) provided by the kit.

By importing these hooks, developers can:

* Easily check if an upgrade is needed
* Determine the current smart account version
* Simplify maintaining and upgrading smart accounts

This ensures users seamlessly benefit from the latest features and protections.

### Multiclause transactions

Multiclause transactions offer enhanced security and flexibility within the VeChain ecosystem. Here's a breakdown of the key points for developers:

* **Single Clause Transactions**:\
  You can still use `executeWithAuthorization`, but keep in mind it retains a replay attack vector. This method is primarily for backward compatibility.
* **Recommended Adoption**:\
  Switch to `executeBatchWithAuthorization` for a more secure solution. This method:
  * Solves replay attack issues.
  * Executes multiple transactions with a single signature, simulating multiclause capabilities.
* **Automatic Management**:\
  Using `useSendTransaction` from the kit automates this process, negating the need for manual adjustments.

Understanding these components is crucial for those working with smart accounts outside of the vechain-kit. This knowledge ensures both security and operational efficiency.

How to use `executeBatchWithAuthorization` and the `nonce` :

<pre class="language-javascript"><code class="lang-javascript">const executeBatchWithAuthorization = (txClauses: Connex.VM.Clause[]) => {
    const toArray: string[] = [];
    const valueArray: string[] = [];
    const dataArray: string[] = [];
    
    txClauses.forEach((clause) => {
        toArray.push(clause.to ?? '');
        valueArray.push(String(clause.value));
        if (typeof clause.data === 'object' &#x26;&#x26; 'abi' in clause.data) {
            dataArray.push(encodeFunctionData(clause.data));
        } else {
            dataArray.push(clause.data || '0x');
        }
    });
        
    const dataToSign = {
        domain: {
            name: 'Wallet',
            version: '1',
            chainId,
            verifyingContract, // the smart account of the user
        },
        types: {
            ExecuteBatchWithAuthorization: [
                { name: 'to', type: 'address[]' },
                { name: 'value', type: 'uint256[]' },
                { name: 'data', type: 'bytes[]' },
                { name: 'validAfter', type: 'uint256' },
                { name: 'validBefore', type: 'uint256' },
                { name: 'nonce', type: 'bytes32' },
            ],
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
        },
        primaryType: 'ExecuteBatchWithAuthorization',
        message: {
            to: toArray,
            value: valueArray,
            data: dataArray,
            validAfter: 0,
            validBefore: Math.floor(Date.now() / 1000) + 60, // e.g. 1 minute from now
            nonce: ethers.hexlify(ethers.randomBytes(32)), // nonce needs to be random
        },
    };
        
    // Sign the typed data with Privy
    const signature = (
      await signTypedDataPrivy(typedData, {
          uiOptions: {
              title,
              description,
              buttonText,
          },
      })
    ).signature;
    
      
    // Rebuild the clauses to call the executeBatchWithAuthorization 
    const clauses = [];
<strong>    clauses.push(
</strong>        Clause.callFunction(
            Address.of(smartAccount.address),
            ABIContract.ofAbi(SimpleAccountABI).getFunction(
                'executeBatchWithAuthorization',
            ),
            [
                typedData.message.to,
                typedData.message.value?.map((val) => BigInt(val)) ?? 0,
                typedData.message.data,
                BigInt(typedData.message.validAfter),
                BigInt(typedData.message.validBefore),
                typedData.message.nonce, // If your contract expects bytes32
                signature as `0x${string}`,
            ],
        ),
    );
                   
    //Now you can broadcast the transaction to the blockchain with one of your delegator wallets
    // ...
};
</code></pre>

{% hint style="danger" %}
Currently VeChain Kit does not support the handling of a smart account by a VeWorld wallet.
{% endhint %}

