# Fee Delegation

Fee Delegation is mostly meant to be implemented to support end-user-experience, removing the need to purchase/collect gas tokens and remove need to pay for the applications activities.

{% hint style="warning" %}
Currently, it is mandatory to sponsor transaction for users that use social login. You can deploy your own custom solution or use [vechain.energy](https://vechain.energy/).
{% endhint %}

### FEE\_DELEGATION\_URL

You need to set this parameter in your VeChainKitProvider weapper.

You need one per environmnet.

To obtain one you can deploy your own custom solution or use [vechain.energy](https://vechain.energy/).

## Option 1: create your own

You can deploy this as a microservice (through lambda, cloudflare, etc.) or as an endpoint of your backend.<br>

```typescript
import { Address, HDKey, Transaction, Secp256k1, Hex } from '@vechain/sdk-core';

// the default signer is a solo node seeded account
const DEFAULT_SIGNER = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross'

export async function onRequestPost({ request, env }): Promise<Response> {
    const body = await request.json()
    console.log('Incoming request', body);

    const signerWallet = HDKey.fromMnemonic((env.SIGNER_MNEMONIC ?? DEFAULT_SIGNER).split(' '), HDKey.VET_DERIVATION_PATH).deriveChild(0);
    if (!signerWallet.publicKey || !signerWallet.privateKey) { throw new Error('Could not load signing wallet') }

    const signerAddress = Address.ofPublicKey(signerWallet.publicKey)
    const transactionToSign = Transaction.decode(
        Buffer.from(body.raw.slice(2), 'hex'),
        false
    );
    const transactionHash = transactionToSign.getSignatureHash(Address.of(body.origin))
    const signature = Secp256k1.sign(transactionHash.bytes, signerWallet.privateKey)

    return new Response(JSON.stringify({
        signature: Hex.of(signature).toString(),
        address: signerAddress.toString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'access-control-allow-origin': '*'
        }
    })
}
```

## Option 2: use [vechain.energy](https://vechain.energy/)

<figure><img src="../.gitbook/assets/image (1) (1).png" alt=""><figcaption></figcaption></figure>

{% embed url="https://learn.vechain.energy/vechain.energy/FeeDelegation/Setup/" %}

### [GO TO TUTORIAL](https://learn.vechain.energy/vechain.energy/FeeDelegation/Setup/)

{% hint style="info" %}
Add this address 0xD7B96cAC488fEE053daAf8dF74f306bBc237D3f5 (MAINNET) or 0x7C5114ef27a721Df187b32e4eD983BaB813B81Cb (TESTNET)  in {YourProjectName/FeeDelegation/Configurations/Smart Contract to sponsor  all transactions.
{% endhint %}

{% hint style="info" %}
<pre class="language-solidity"><code class="lang-solidity"><a data-footnote-ref href="#user-content-fn-1">/</a>// Smart contract to allow delegate all requests

/<a data-footnote-ref href="#user-content-fn-1">// SPDX-License-Identifier: MIT</a>
pragma solidity ^0.8.20;

contract FeeDelegation {
    /**
     * @dev Check if a transaction can be sponsored for a user
     */
    function canSponsorTransactionFor(
        address _origin,
        address _to,
        bytes calldata _data
    ) public view returns (bool) {
        return true;
    }
}
</code></pre>
{% endhint %}

{% hint style="info" %}
Enable email notifications to let you know of low VTHO balance.
{% endhint %}

## What is Fee Delegation?

Fee Delegation is a simple process that creates a magical user experience using blockchains without losing decentralized benefits.

The user submitting a transaction requests a second signature from a gas payer.

When the transaction is processed, the gas costs are taken from the gas payers balance instead of the user submitting the transaction.

It creates a feeless and trustless solution for instant blockchain access.

You can read more about it here: [https://docs.vechain.org/thor/learn/fee-delegation (opens in a new tab)](https://docs.vechain.org/thor/learn/fee-delegation)

### Why is it important?

It stops users from instantly using an application. Users that need to pay for transactions are required to obtain a token from somewhere. Regular users do not know where to go and researching a place to buy and accessing a (de)centralized exchange is too much to ask for a user that wants to use your application.

### What does it allow?

Users can open an application and interact with it instantly. An Application can submit transactions in the background and can no longer be be distinguished from regular(web2) alternatives. Fee delegation solves the biggest hurdle of user on - boarding to blockchain - applications without invalidating the web3 - principles.

### Want to learn more?

You can learn more about the feature from docs.vechain.org on [How to Integrate VIP-191 (opens in a new tab)](https://docs.vechain.org/tutorials/how-to-integrate-VIP-191-1.html).

### What are the use-cases?

Fee Delegation is mostly meant to be implemented to support end-user-experience, removing the need to purchase/collect gas tokens and remove need to pay for the applications activities.

Other use-cases are instant interactions with blockchains from different backends or processes without introducing account management for gas tokens.

[^1]: 
