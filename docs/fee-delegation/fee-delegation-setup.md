# Fee Delegation Setup

Fee delegation allows your dApp to sponsor transaction fees for users, removing the barrier of requiring VTHO tokens.

### What is Fee Delegation?

Fee delegation is a VeChain feature that enables applications to pay transaction fees on behalf of users. This creates a seamless user experience, especially for:

* New users without VTHO tokens
* Social login users (email, Google, etc.)
* Improving overall user onboarding

### Configuration

Add fee delegation to your VeChainKitProvider:

```typescript
<VeChainKitProvider
  feeDelegation={{
    delegatorUrl: "YOUR_FEE_DELEGATION_URL",
    delegateAllTransactions: true, // or false for social login only
  }}
>
  {children}
</VeChainKitProvider>
```

#### Configuration Options

* **`delegatorUrl`**: The endpoint URL for your fee delegation service
* **`delegateAllTransactions`**:
  * `true`: Sponsor all transactions (wallet and social users)
  * `false`: Sponsor only social login transactions (mandatory)

### Setup Options

You have two options for setting up fee delegation:

Option 1: Create your own backend service

Option 2: Use existing free tools

#### Create Your Own Service

Deploy a custom fee delegation service as a microservice or backend endpoint.

**Example Implementation (Cloudflare Worker)**

```typescript
import { 
  Address, 
  HDKey, 
  Transaction, 
  Secp256k1, 
  Hex 
} from '@vechain/sdk-core';

// Default signer for development (use env variable in production)
const DEFAULT_SIGNER = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

export async function onRequestPost({ request, env }): Promise<Response> {
  try {
    const body = await request.json();
    console.log('Incoming fee delegation request:', body);

    // Load signer wallet from mnemonic
    const mnemonic = (env.SIGNER_MNEMONIC ?? DEFAULT_SIGNER).split(' ');
    const signerWallet = HDKey.fromMnemonic(
      mnemonic, 
      HDKey.VET_DERIVATION_PATH
    ).deriveChild(0);
    
    if (!signerWallet.publicKey || !signerWallet.privateKey) {
      throw new Error('Could not load signing wallet');
    }

    // Get signer address
    const signerAddress = Address.ofPublicKey(signerWallet.publicKey);
    
    // Decode and sign the transaction
    const transactionToSign = Transaction.decode(
      Buffer.from(body.raw.slice(2), 'hex'),
      false
    );
    
    const transactionHash = transactionToSign.getSignatureHash(
      Address.of(body.origin)
    );
    
    const signature = Secp256k1.sign(
      transactionHash.bytes, 
      signerWallet.privateKey
    );

    return new Response(JSON.stringify({
      signature: Hex.of(signature).toString(),
      address: signerAddress.toString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Fee delegation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

**Environment Variables**

```bash
# .env
SIGNER_MNEMONIC="your twelve word mnemonic phrase here"
```

**Security Considerations**

1. **Never expose your mnemonic**: Store it securely in environment variables
2. **Implement request validation**: Check origin, transaction limits, etc.
3. **Add rate limiting**: Prevent abuse of your delegation service
4. **Monitor usage**: Track delegation requests and VTHO consumption

#### Use VeChain.Energy

VeChain.Energy provides a managed fee delegation service.

**Setup Steps**

For a detailed walkthrough, see the [VeChain.Energy Fee Delegation Tutorial](https://learn.vechain.energy/vechain.energy/FeeDelegation/Setup/).

1.  **Visit VeChain.Energy**

    * Go to [vechain.energy](https://vechain.energy)
    * Create an account and project

    <figure><img src="../.gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>
2. **Configure Fee Delegation**
   * Navigate to: `Your Project → Fee Delegation → Configurations`
   * Add the VeChain Kit smart contract address:
     * **Mainnet**: `0xD7B96cAC488fEE053daAf8dF74f306bBc237D3f5`
     * **Testnet**: `0x7C5114ef27a721Df187b32e4eD983BaB813B81Cb`
3. **Get Your Delegation URL**
   * Your delegation URL will be: `https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID`
4.  **Configure Your Provider**

    ```typescript
    <VeChainKitProvider
      feeDelegation={{
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/YOUR_PROJECT_ID",
        delegateAllTransactions: false,
      }}
    >
      {children}
    </VeChainKitProvider>
    ```

### Smart Contract for Custom Rules

For advanced delegation rules, deploy a smart contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeeDelegation {
    address public owner;
    mapping(address => bool) public whitelist;
    uint256 public dailyLimit = 1000; // VTHO limit
    mapping(address => uint256) public dailyUsage;
    mapping(address => uint256) public lastUsageDate;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    function addToWhitelist(address user) external onlyOwner {
        whitelist[user] = true;
    }
    
    function removeFromWhitelist(address user) external onlyOwner {
        whitelist[user] = false;
    }
    
    /**
     * @dev Check if a transaction can be sponsored
     */
    function canSponsorTransactionFor(
        address _origin,
        address _to,
        bytes calldata _data
    ) public view returns (bool) {
        // Always sponsor for whitelisted addresses
        if (whitelist[_origin]) {
            return true;
        }
        
        // Check daily limit for others
        uint256 today = block.timestamp / 86400;
        if (lastUsageDate[_origin] < today) {
            return true; // New day, can sponsor
        }
        
        return dailyUsage[_origin] < dailyLimit;
    }
    
    function updateUsage(address user, uint256 amount) external {
        uint256 today = block.timestamp / 86400;
        if (lastUsageDate[user] < today) {
            dailyUsage[user] = amount;
            lastUsageDate[user] = today;
        } else {
            dailyUsage[user] += amount;
        }
    }
}
```

### Monitoring and Alerts

#### For VeChain.Energy

* Enable email notifications for low VTHO balance
* Set up alerts in your project dashboard
* Monitor usage statistics regularly

#### For Custom Solutions

Implement monitoring for:

* VTHO balance of delegation wallet
* Number of delegated transactions
* Failed delegation attempts
* Unusual activity patterns

```typescript
// Example monitoring middleware
async function monitorDelegation(request, response, next) {
  const vthoBalance = await getVTHOBalance(DELEGATION_ADDRESS);
  
  if (vthoBalance < MINIMUM_THRESHOLD) {
    await sendAlert('Low VTHO balance for fee delegation');
  }
  
  // Log delegation request
  await logDelegationRequest({
    origin: request.body.origin,
    timestamp: Date.now(),
    transactionHash: request.body.hash
  });
  
  next();
}
```

### Testing Fee Delegation

1.  **Test with Social Login**

    ```typescript
    // Ensure social login users can transact without VTHO
    const { sendTransaction } = useWallet();

    try {
      const tx = await sendTransaction({
        to: '0x...',
        value: '0',
        data: '0x...'
      });
      console.log('Transaction sponsored:', tx);
    } catch (error) {
      console.error('Delegation failed:', error);
    }
    ```
2.  **Verify Delegation Headers.** Check that your delegation service returns proper headers:

    ```json
    {
      "signature": "0x...",
      "address": "0x..."
    }
    ```

### Troubleshooting

#### Common Issues

1. **"Fee delegation failed" error**
   * Check delegation URL is correct
   * Verify VTHO balance in delegation wallet
   * Ensure CORS headers are properly set
2. **Social login users can't transact**
   * Confirm `feeDelegation` is configured in provider
   * Check delegation service is running
   * Verify smart contract address is whitelisted
3. **High VTHO consumption**
   * Implement transaction limits
   * Add user verification
   * Monitor for unusual patterns

### Best Practices

1. **Security First**
   * Never expose private keys or mnemonics
   * Implement proper authentication
   * Add rate limiting
2. **User Experience**
   * Ensure sufficient VTHO balance
   * Provide clear error messages
   * Monitor service uptime
3. **Cost Management**
   * Set reasonable limits
   * Track usage per user
   * Implement fair use policies
