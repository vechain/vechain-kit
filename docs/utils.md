---
hidden: true
---

# Utils

## VeChain Kit Utilities

A comprehensive collection of utility functions for VeChain development.

### Address Utilities

```typescript
import { 
    compareAddresses,
    compareListOfAddresses,
    isValidAddress,
    leftPadWithZeros
} from '@vechain-kit/utils';

// Compare two addresses (case-insensitive)
compareAddresses('0x123...', '0x123...'); // true

// Compare arrays of addresses
compareListOfAddresses(
    ['0x123...', '0x456...'], 
    ['0x456...', '0x123...']
); // true

// Validate address format
isValidAddress('0x123...'); // true/false

// Pad address with leading zeros
leftPadWithZeros('0x123', 40); // '0x0000...0123'
```

### Formatting Utilities

```typescript
import { 
    humanAddress,
    humanDomain,
    humanNumber,
    getPicassoImage
} from '@vechain-kit/utils';

// Format address for display
humanAddress('0x123456789...', 6, 4); // '0x1234••••89ab'

// Format domain for display
humanDomain('very.long.domain.vet', 8, 6); // 'very.lon••••in.vet'

// Format numbers with optional symbol
humanNumber('1000000', null, 'VET'); // '1,000,000 VET'
humanNumber('1000000', 2); // '1,000,000.00'

// Generate avatar image from address
getPicassoImage('0x123...', false); // SVG data URL
```

### Hex Utilities

```typescript
// Hex Utilities
import { 
    removePrefix,
    addPrefix,
    isValid,
    normalize,
    compare,
    generateRandom
} from '@vechain-kit/utils';

// Remove '0x' prefix
removePrefix('0x123'); // '123'

// Add '0x' prefix
addPrefix('123'); // '0x123'

// Validate hex string
isValid('0x123abc'); // true

// Normalize hex string (lowercase with prefix)
normalize('0X123ABC'); // '0x123abc'

// Compare hex strings
compare('0x123', '0X123'); // true

// Generate random hex
generateRandom(10); // '0x1234567890'
```

### IPFS Utilities

```typescript
// IPFS Utilities
import { 
    validateIpfsUri,
    toIPFSURL,
    uploadBlobToIPFS,
    ipfsHashToUrl
} from '@vechain-kit/utils';

// Validate IPFS URI
validateIpfsUri('ipfs://QmfSTia...'); // true

// Convert CID to IPFS URL
toIPFSURL('QmfSTia...', 'image.png'); // 'ipfs://QmfSTia.../image.png'

// Upload to IPFS
const hash = await uploadBlobToIPFS(blob, 'file.jpg', 'main');

// Convert IPFS hash to gateway URL
ipfsHashToUrl('QmfSTia...', 'main'); // https://gateway.ipfs.io/ipfs/QmfSTia...
```

### Media Type Resolver

```typescript
// Media Type Resolver
import { 
    resolveMediaTypeFromMimeType,
    NFTMediaType 
} from '@vechain-kit/utils';

// Determine NFT media type
const imageType = resolveMediaTypeFromMimeType('image/jpeg'); // NFTMediaType.IMAGE
const videoType = resolveMediaTypeFromMimeType('video/mp4'); // NFTMediaType.VIDEO
const audioType = resolveMediaTypeFromMimeType('audio/mp3'); // NFTMediaType.AUDIO
const modelType = resolveMediaTypeFromMimeType('model/gltf-binary'); // NFTMediaType.MODEL

// Available media types
console.log(NFTMediaType.IMAGE); // 'image'
console.log(NFTMediaType.VIDEO); // 'video'
console.log(NFTMediaType.AUDIO); // 'audio'
console.log(NFTMediaType.MODEL); // 'model'
```
