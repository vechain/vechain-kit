# Generic Delegator - Default Option

### Handling Transaction Fee Notifications

When using Vechain Kit with the Generic Delegator, it's important to provide clear information to users regarding transaction fees. Consider the following UI alerts:

* **Transaction Confirmation Alert**: Notify users of the exact amount of VET, VTHO, or B3TR tokens that will be deducted from their wallet when initiating a transaction.
* **Insufficient Funds Alert**: Alert users if they lack sufficient balance to cover the transaction fees, providing details on the required amount.

Implement these alerts effectively to enhance user experience and ensure transparency regarding transaction costs.

{% hint style="success" %}
By using this default option, you, as an app owner, won't spend any money for the user operations.
{% endhint %}

### **Estimating Transaction Costs**

You can use the `useEstimateGas` hook to determine how much a user will spend on transaction fees. This hook provides an estimation of the gas fees required for a transaction before it is initiated. Additionally, users have the option to change the default token used for transaction fees in the settings, allowing for greater flexibility and control over transaction costs.

The `useGasEstimation` hook is designed for estimating transaction gas costs within applications using the Generic Delegator fee sponsorship system. It handles multi-token estimations, automatically selecting the most suitable gas token based on user balance and token availability. The hook is suited for scenarios requiring flexibility and balance validation in transaction processes.

### Sponsor only specific transactions

To implement this feature, use the `useSendTransaction` hook with the parameters `sponsor: true` or `sponsor: false` based on the specific transactions you wish to sponsor. By including the `feeDelegationUrl`, you can direct the fee delegation process accordingly, giving you control over which transactions are sponsored. This offers flexibility in transaction sponsorship while maintaining an efficient fee management strategy.
