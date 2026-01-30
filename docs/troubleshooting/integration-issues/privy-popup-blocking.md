# Privy Popup Blocking

Browser popup blocking can affect users using social login (Privy) when operations delay the signing popup.

### Problem

When using Privy for social login (cross-app connection), browsers may block the confirmation popup if there's a delay between user\
action and popup trigger.

#### What Causes This

* Fetching data after button click
* API calls before signing
* Any async operations between click and popup

### Solution

#### Pre-fetch Data Before Transaction

Ensure all required data is loaded before the user clicks the button:

```javascript
// ✅ Good: Pre-fetch data
const { data } = useQuery(['someData'], fetchSomeData);
const sendTx = () => sendTransaction(data);

// ❌ Bad: Fetching data during the transaction
const sendTx = async () => {
  const data = await fetchSomeData();  // This delay causes popup blocking
  return sendTransaction(data);
};
```

#### Best Practices

1. **Load Data Early**

<pre class="language-javascript"><code class="lang-javascript">// Load data when component mounts or when form changes
const { data: gasPrice } = useQuery(['gasPrice'], fetchGasPrice, {
    staleTime: 30000 // Cache for 30 seconds
});
// Transaction handler is instant
const handleTransaction = () => {
    sendTransaction({
        gasPrice,
        // ... other pre-loaded data
<strong>    });
</strong>};
</code></pre>

2. **Show Loading States**

```javascript
const MyComponent = () => {
    const { data, isLoading } = useQuery(['requiredData'], fetchData);

    return (
      <button 
        onClick={() => sendTransaction(data)}
        disabled={isLoading}
      >
        {isLoading ? 'Preparing...' : 'Send Transaction'}
      </button>
    );
  };

```

3. **Avoid Async in Click Handlers**

```javascript
// ❌ Avoid
onClick={async () => {
  const result = await someAsyncOperation();
  sendTransaction(result);
}}

// ✅ Better
onClick={() => {
  sendTransaction(preLoadedData);
}}
```

#### **Testing**

To test if your implementation avoids popup blocking:

1. Use social login (Privy)
2. Click transaction buttons
3. Popup should appear immediately
4. No browser blocking warnings

#### **Common Scenarios**

* **Form submissions**: Validate and prepare data before `submit` button is enabled
* **Token approvals**: Pre-fetch allowance amounts
* **Multi-step transactions**: Load all data for subsequent steps upfront
