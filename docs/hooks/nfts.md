# NFTs

## NFT Hooks

The hooks provide tools for interacting with NFTs (Non-Fungible Tokens) on VeChain:

### NFT Data Hooks

* `useNFTImage`: Fetches NFT image and metadata from IPFS, handling the complete flow from token ID to final image
* `useNFTMetadataUri`: Retrieves the metadata URI for an NFT using its token ID

### Types

```typescript
// NFT Types
interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string | number;
    }[];
}

interface NFTImageHookParams {
    address: string;
    contractAddress: string;
}

interface NFTMetadataUriParams {
    tokenId: string;
    contractAddress: string;
}

interface NFTImageHookResult {
    imageData: string | null;
    imageMetadata: NFTMetadata | null;
    tokenID: string | null;
    isLoading: boolean;
    error: Error | null;
}

interface NFTMetadataUriResult {
    data: string | null;
    isLoading: boolean;
    error: Error | null;
}
```

### Example usage

```typescript
// Example usage of NFT hooks
import { useNFTImage, useNFTMetadataUri } from '@vechain/vechain-kit';

const ExampleComponent = () => {
    const walletAddress = "0x...";
    const tokenId = "1";
    const contractAddress = "0x...";

    // Get complete NFT data including image
    const { 
        imageData,
        imageMetadata,
        tokenID,
        isLoading: isLoadingNFT,
        error: nftError 
    } = useNFTImage({
        address: walletAddress,
        contractAddress: contractAddress
    });

    // Get just the metadata URI
    const {
        data: metadataUri,
        isLoading: isLoadingUri,
        error: uriError
    } = useNFTMetadataUri({
        tokenId,
        contractAddress
    });

    // Handle loading states
    if (isLoadingNFT || isLoadingUri) {
        return <div>Loading NFT data...</div>;
    }

    // Handle errors
    if (nftError || uriError) {
        return <div>Error: {nftError?.message || uriError?.message}</div>;
    }

    console.log(
        'NFT Image:', imageData,
        'NFT Metadata:', imageMetadata,
        'Token ID:', tokenID,
        'Metadata URI:', metadataUri
    );

    // Example of using the NFT data
    return (
        <div>
            {imageData && (
                <img 
                    src={imageData} 
                    alt={imageMetadata?.name || 'NFT'} 
                />
            )}
            {imageMetadata && (
                <div>
                    <h2>{imageMetadata.name}</h2>
                    <p>{imageMetadata.description}</p>
                    {imageMetadata.attributes?.map((attr, index) => (
                        <div key={index}>
                            {attr.trait_type}: {attr.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExampleComponent;

/*
Note: These hooks require:
- Valid thor connection
- Network type configuration
- Valid IPFS gateway for image fetching
- The hooks handle the complete flow:
  1. Get token ID from address
  2. Get metadata URI from token ID
  3. Fetch metadata from IPFS
  4. Fetch image from IPFS

Types:
interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
}
*/
```
