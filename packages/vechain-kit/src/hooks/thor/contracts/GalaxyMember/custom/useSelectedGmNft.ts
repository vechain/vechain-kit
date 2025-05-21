import { notFoundImage, gmNfts } from '@/utils';
import {
    NFTMetadata,
    useB3trToUpgrade,
    useGetB3trBalance,
    useLevelMultiplier,
    useLevelOfToken,
    useNFTImage,
    useNFTMetadataUri,
    useIpfsImage,
    useIpfsMetadata,
    useXNode,
    useIsGMClaimable,
    useGetNodeIdAttached,
    useGMMaxLevel,
    useSelectedTokenId,
} from '@/hooks';

/**
 * Custom hook for retrieving data related to a Galaxy Member NFT.
 *
 * @returns An object containing the following properties:
 *   - gmImage: The image URL of the Galaxy Member NFT.
 *   - gmName: The name of the Galaxy Member NFT.
 *   - gmLevel: The level of the Galaxy Member NFT.
 *   - gmRewardMultiplier: The reward multiplier of the Galaxy Member NFT.
 *   - isGMLoading: A boolean indicating whether the Galaxy Member NFT data is currently being loaded.
 *   - isGMOwned: A boolean indicating whether the user owns the Galaxy Member NFT.
 *   - isGMClaimable: A boolean indicating whether the Galaxy Member NFT is claimable.
 *   - attachedNodeId: The ID of the node attached to the Galaxy Member NFT.
 */
export const useSelectedGmNft = (userAddress?: string) => {
    const { isOwned: isGMOwned } = useIsGMClaimable(userAddress);
    const { isLoading: isGMLoading } = useNFTImage(userAddress);
    const { data: b3trBalance } = useGetB3trBalance(userAddress ?? '');
    const {
        data: selectedTokenId,
        isLoading: isSelectedTokenIdLoading,
        isError: isErrorSelectedTokenId,
        error: errorSelectedTokenIdError,
    } = useSelectedTokenId(userAddress as `0x${string}`);

    const {
        data: gmLevel,
        isLoading: isLevelOfTokenLoading,
        isError: isErrorLevelOfToken,
        error: errorLevelOfToken,
    } = useLevelOfToken(selectedTokenId);

    const {
        data: gmRewardMultiplier,
        isLoading: isGMLoadingMultiplier,
        isError: isErrorGMLoadingMultiplier,
        error: errorGMLoadingMultiplier,
    } = useLevelMultiplier(gmLevel);

    const {
        data: nextLevelGMRewardMultiplier,
        isLoading: isNextLevelGMRewardMultiplierLoading,
        isError: isErrorNextLevelGMRewardMultiplier,
        error: errorNextLevelGMRewardMultiplier,
    } = useLevelMultiplier(gmLevel && String(Number(gmLevel) + 1));

    const {
        data: b3trToUpgradeGMToNextLevel,
        isLoading: isB3trToUpgradeGMToNextLevelLoading,
        isError: isErrorB3trToUpgradeGMToNextLevel,
        error: errorB3trToUpgradeGMToNextLevel,
    } = useB3trToUpgrade(selectedTokenId);

    const {
        data: metadataURI,
        isLoading: isLoadingMetadataUri,
        isError: isErrorMetadataUri,
        error: errorMetadataURI,
    } = useNFTMetadataUri(selectedTokenId ?? null);

    const {
        data: nftMetadata,
        isLoading: isLoadingMetadata,
        isError: isErrorMetadata,
        error: errorMetadata,
    } = useIpfsMetadata<NFTMetadata>(metadataURI);

    const {
        data: gmNftImage,
        isLoading: isLoadingImageData,
        isError: isErrorImageData,
        error: errorImageData,
    } = useIpfsImage(nftMetadata?.image ?? null);

    const {
        data: attachedNodeId,
        isLoading: isLoadingAttachedNodeId,
        isError: isErrorAttachedNodeId,
        error: errorAttachedNodeId,
    } = useGetNodeIdAttached(selectedTokenId);

    const {
        data: maxGmLevel,
        isLoading: isLoadingMaxGmLevel,
        isError: isErrorMaxGmLevel,
        error: errorMaxGmLevel,
    } = useGMMaxLevel();

    // INFO: workaround to get the NFT image and token ID
    const { imageData, tokenID, isLoading: isLoadingNFT } = useNFTImage();

    const isLoading =
        isGMLoading ||
        isSelectedTokenIdLoading ||
        isLoadingMetadataUri ||
        isLoadingMetadata ||
        isLoadingImageData ||
        isLevelOfTokenLoading ||
        isGMLoadingMultiplier ||
        isB3trToUpgradeGMToNextLevelLoading ||
        isNextLevelGMRewardMultiplierLoading ||
        isLoadingAttachedNodeId ||
        isLoadingMaxGmLevel ||
        isLoadingNFT;
    const isError =
        isErrorSelectedTokenId ||
        isErrorMetadataUri ||
        isErrorMetadata ||
        isErrorImageData ||
        isErrorLevelOfToken ||
        isErrorGMLoadingMultiplier ||
        isErrorB3trToUpgradeGMToNextLevel ||
        isErrorNextLevelGMRewardMultiplier ||
        isErrorAttachedNodeId ||
        isErrorMaxGmLevel;
    const error =
        errorSelectedTokenIdError ||
        errorMetadataURI ||
        errorMetadata ||
        errorImageData ||
        errorLevelOfToken ||
        errorGMLoadingMultiplier ||
        errorB3trToUpgradeGMToNextLevel ||
        errorNextLevelGMRewardMultiplier ||
        errorAttachedNodeId ||
        errorMaxGmLevel;

    const isEnoughBalanceToUpgradeGM =
        b3trBalance &&
        b3trToUpgradeGMToNextLevel &&
        Number(b3trBalance?.scaled || 0) >= b3trToUpgradeGMToNextLevel;
    const missingB3trToUpgrade =
        (b3trToUpgradeGMToNextLevel || 0) - Number(b3trBalance?.scaled || 0);

    const { xNodeId } = useXNode(userAddress);
    const isXNodeAttachedToGM = attachedNodeId === xNodeId;

    const isMaxGmLevelReached =
        !!maxGmLevel && !!gmLevel && Number(gmLevel) === Number(maxGmLevel);

    // TODO: workaround to let it work until we enable upgradable gm nft
    const gmImage =
        gmNftImage?.image ||
        imageData?.image ||
        gmNfts[Number(gmLevel) - 1]?.image ||
        notFoundImage;
    const nftName = nftMetadata?.name || gmNfts[Number(gmLevel) - 1]?.name;
    const gmName = `${nftName} #${tokenID}`;

    return {
        gmId: selectedTokenId,
        gmImage,
        gmName,
        gmLevel,
        gmRewardMultiplier,
        nextLevelGMRewardMultiplier,
        isGMLoading,
        isGMOwned,
        b3trToUpgradeGMToNextLevel,
        isEnoughBalanceToUpgradeGM,
        missingB3trToUpgrade,
        attachedNodeId,
        isLoading,
        isError,
        error,
        isXNodeAttachedToGM,
        maxGmLevel,
        isMaxGmLevelReached,
    };
};
