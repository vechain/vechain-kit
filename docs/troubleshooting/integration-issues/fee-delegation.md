# Fee Delegation

VeChain Kit includes built-in fee delegation handling. If you already have fee delegation in your app, you must remove it to avoid conflicts.

### Problem

Using both your own fee delegation and VeChain Kit's delegation causes:

* Transaction failures
* Double delegation attempts
* Multiple signatures on transactions
* Incorrect transaction format

### Solution

1. **Remove Existing Fee Delegation**

Remove all custom fee delegation logic from your application:

* Remove fee delegation middleware
* Remove delegation signing logic
* Remove any custom delegation providers

{% hint style="danger" %}
If you do not remove your own delegation then transactions could fail because your transaction will delegate 2 times, will have 2 signatures and an incorrect format.
{% endhint %}



2. **Configure VeChain Kit Fee Delegation**

Simply provide the delegation URL in the VeChainKitProvider:

<pre class="language-javascript"><code class="lang-javascript">&#x3C;VeChainKitProvider
<strong>  feeDelegation={{
</strong>    delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL,
    delegateAllTransactions: false
  }}
  // ... other config
>
  &#x3C;App />
&#x3C;/VeChainKitProvider>
</code></pre>



3. **Delegation Options**

* delegatorUrl: Your fee delegation service URL
* delegateAllTransactions: Set to true to delegate fees for all transactions, including VeWorld users

### Important Notes

* VeChain Kit handles all delegation logic internally
* No additional delegation setup required
* Works automatically with all supported wallets

#### Verification

To verify that delegation is working correctly:

1. Check that transactions only have one delegation signature
2. Monitor your delegation service logs
3. Ensure transactions complete successfully

#### Common Errors

_**"Transaction has multiple delegations"**_: You still have custom delegation code active. Remove all custom delegation logic.

_**"Delegation failed"**_: Check that your delegation URL is correct and the service is running.
