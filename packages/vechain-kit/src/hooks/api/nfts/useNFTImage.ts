import { useTokenIdByAccount } from '@/hooks';
import { useNFTMetadataUri } from '../../thor/contracts/useNFTMetadataUri';
import { useIpfsImage } from '@/hooks/api/ipfs/useIpfsImage';
import { useIpfsMetadata } from '@/hooks/api/ipfs/useIpfsMetadata';

/**
 * Fetches NFT image from IPFS
 * @param fetchNFT - Whether to fetch the NFT
 * @returns The NFT image
 */

export type NFTMetadata = {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
};

export const useNFTImage = (address?: string) => {
    const {
        data: tokenID,
        isLoading: isLoadingTokenID,
        isError: isErrorTokenID,
        error: errorTokenID,
    } = useTokenIdByAccount(address ?? '', 0);

    const {
        data: metadataURI,
        isLoading: isLoadingMetadataUri,
        isError: isErrorMetadataUri,
        error: errorMetadataURI,
    } = useNFTMetadataUri(tokenID ?? null);

    const {
        data: imageMetadata,
        isLoading: isLoadingMetadata,
        isError: isErrorMetadata,
        error: errorMetadata,
    } = useIpfsMetadata<NFTMetadata>(metadataURI);

    const {
        data: imageData,
        isLoading: isLoadingImageData,
        isError: isErrorImageData,
        error: errorImageData,
    } = useIpfsImage(imageMetadata?.image ?? null);

    return {
        imageData,
        imageMetadata,
        tokenID,
        isLoading:
            isLoadingTokenID ||
            isLoadingMetadataUri ||
            isLoadingMetadata ||
            isLoadingImageData,
        isError:
            isErrorTokenID ??
            isErrorMetadataUri ??
            isErrorMetadata ??
            isErrorImageData,
        error:
            errorTokenID ?? errorMetadataURI ?? errorMetadata ?? errorImageData,
    };
};
