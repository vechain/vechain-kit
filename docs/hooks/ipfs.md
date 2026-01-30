# Ipfs

## IPFS Hooks

The hooks provide tools for interacting with IPFS (InterPlanetary File System):

### Image Hooks

* `useIpfsImage`: Fetches NFT media from IPFS, supporting various image formats (JPEG, PNG, GIF, etc.)
* `useIpfsImageList`: Fetches multiple IPFS images in parallel
* `useSingleImageUpload`: Handles single image upload with optional compression
* `useUploadImages`: Manages multiple image uploads with compression support

### Metadata Hooks

* `useIpfsMetadata`: Fetches and optionally parses JSON metadata from IPFS
* `useIpfsMetadatas`: Fetches multiple IPFS metadata files in parallel

### Usage Example

```typescript
// Example usage of IPFS hooks
import { 
    useIpfsImage, 
    useIpfsMetadata,
    useSingleImageUpload,
    useUploadImages
} from '@vechain/vechain-kit';

const ExampleComponent = () => {
    // Fetch an NFT image from IPFS
    const { 
        data: imageData,
        isLoading: isImageLoading,
        error: imageError 
    } = useIpfsImage("ipfs://...");

    // Fetch metadata from IPFS
    const { 
        data: metadata,
        isLoading: isMetadataLoading,
        error: metadataError 
    } = useIpfsMetadata<{ 
        name: string; 
        description: string 
    }>("ipfs://...", true); // parse as JSON

    // Handle single image upload
    const {
        uploadedImage,
        onUpload: handleSingleUpload,
        onRemove: handleSingleRemove,
        isUploading: isSingleUploading
    } = useSingleImageUpload({
        compressImage: true,
        defaultImage: undefined,
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1920
    });

    // Handle multiple image uploads
    const {
        uploadedImages,
        onUpload: handleMultipleUpload,
        onRemove: handleMultipleRemove,
        isUploading: isMultipleUploading
    } = useUploadImages({
        compressImages: true,
        defaultImages: [],
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1920
    });

    // Example upload handler
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await handleSingleUpload(file);
        }
    };

    // Example multiple files upload handler
    const handleMultipleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        await handleMultipleUpload(files);
    };

    console.log(
        'IPFS Image:', imageData,
        'Loading Image:', isImageLoading,
        'Metadata:', metadata,
        'Loading Metadata:', isMetadataLoading,
        'Uploaded Single Image:', uploadedImage,
        'Single Upload in Progress:', isSingleUploading,
        'Uploaded Multiple Images:', uploadedImages,
        'Multiple Upload in Progress:', isMultipleUploading
    );

    return (
        // Your component JSX here
    );
};

export default ExampleComponent;

/*
Note: These hooks require:
- Valid IPFS gateway configuration
- Network type configuration
- For image hooks:
  - Supported formats: JPEG, PNG, GIF, BMP, TIFF, WebP, SVG
  - Maximum file size: 10MB
- For upload hooks:
  - Default compression to 0.4MB
  - Max width/height: 1920px
  - Web Worker support for compression
*/
```
