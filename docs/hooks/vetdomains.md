# vetDomains

## VetDomains Hooks

The hooks provide tools for interacting with VET domains and their functionality:

### Domain Resolution Hooks

* `useVechainDomain`: Resolves VET domains to addresses and vice versa, returning domain info and validation status
* `useIsDomainProtected`: Checks if a domain is protected from claiming
* `useGetDomainsOfAddress`: Gets all domains owned by an address, with optional parent domain filtering

### Domain Record Management Hooks

* `useGetTextRecords`: Gets all text records for a domain
* `useGetAvatar`: Gets the avatar URL for a domain. This hook will return directly the URL of the image, removing the need for developers to convert the URI to URL manually. The response can be null if the domain name does not exist or if there is no avatar attached to this domain.
* `useGetAvatarOfAddress` : This hook will check if the address has any primary domain name set, if yes it will fetch and return the avatar URL (again, no need to manually convert URI to URL, the hook does it). If there is no domain name attached to it or if there is no avatar attached to the domain, it will return the Picasso image.
* `useGetResolverAddress`: Gets the resolver contract address for a domain
* `useUpdateTextRecord`: Updates text records for a domain with transaction handling

### Subdomain Management Hooks

* `useClaimVeWorldSubdomain`: Claims a VeWorld subdomain with transaction handling and success/error callbacks

### Usage Example

```typescript
/**
 * Domain Management Hooks
 * The hooks provide tools for interacting with VET domains and their functionality
 */

// Domain Resolution Hooks
- `useVechainDomain(addressOrDomain: string)`: 
  Returns { address?: string; domain?: string; isValidAddressOrDomain: boolean }
  // Resolves VET domains to addresses and vice versa

- `useIsDomainProtected(domain: string)`: 
  Returns boolean
  // Checks if a domain is protected from claiming

- `useGetDomainsOfAddress(address: string, parentDomain?: string)`: 
  Returns { domains: Array<{ name: string }> }
  // Gets all domains owned by an address

// Domain Record Management Hooks
- `useGetTextRecords(domain: string)`: 
  Returns TextRecords object
  // Gets all text records for a domain

- `useGetAvatar(domain: string)`: 
  Returns string | null
  // Gets the avatar URL for a domain

- `useGetResolverAddress(domain: string)`: 
  Returns string
  // Gets the resolver contract address for a domain

- `useUpdateTextRecord({
    onSuccess?: () => void,
    onError?: (error: Error) => void,
    signerAccountAddress?: string,
    resolverAddress: string
  })`: 
  Returns { sendTransaction, isTransactionPending, error }
  // Updates text records for a domain

// Subdomain Management Hooks
- `useClaimVeWorldSubdomain({
    subdomain: string,
    domain: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
    alreadyOwned?: boolean
  })`: 
  Returns { sendTransaction, isTransactionPending, error }
  // Claims a VeWorld subdomain

// Example Usage
const ExampleComponent = () => {
    const address = "0x...";
    const domain = "example.vet";
    
    // Resolve domain or address
    const { data: domainInfo } = useVechainDomain(address);
    
    // Check domain protection
    const { data: isProtected } = useIsDomainProtected(domain);
    
    // Get owned domains
    const { data: ownedDomains } = useGetDomainsOfAddress(address);
    
    // Get domain records
    const { data: textRecords } = useGetTextRecords(domain);
    const { data: avatar } = useGetAvatar(domain);
    const { data: avatarOfAddress } = useGetAvatarOfAddress(address);
    
    // Update domain records
    const { sendTransaction: updateRecord } = useUpdateTextRecord({
        onSuccess: () => console.log("Record updated"),
        resolverAddress: "0x..."
    });
    
    // Claim subdomain
    const { sendTransaction: claimSubdomain } = useClaimVeWorldSubdomain({
        subdomain: "mysub",
        domain: "veworld.vet",
        onSuccess: () => console.log("Subdomain claimed")
    });

    console.log(
        'Domain Info:', domainInfo,
        'Is Protected:', isProtected,
        'Owned Domains:', ownedDomains,
        'Text Records:', textRecords,
        'Avatar:', avatar
    );

    return (
        // Your component JSX
    );
};

/*
Requirements:
- All hooks require a valid thor connection
- Appropriate network configuration must be set
- Valid input parameters must be provided
- Most hooks are part of the @tanstack/react-query ecosystem

Additional Notes:
- Domain resolution works for both .vet domains and addresses
- Text records can include various fields like email, description, url, etc.
- Subdomain claiming is specific to veworld.vet domains
- Protection status affects whether a domain can be claimed or transferred
*/
```
