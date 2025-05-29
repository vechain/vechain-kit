import { notFoundImage } from '@/utils';
import { useTranslation } from 'react-i18next';
import { allNodeStrengthLevelToName, NodeStrengthLevelToImage } from '@/utils';
import {
    useGetTokenIdAttachedToNode,
    useGetUserNodes,
    useXNodeCheckCooldown,
} from '@/hooks';

/**
 * Custom hook for retrieving data related to an X-Node.
 *
 * @param address - The address of the account.
 * @returns An object containing the following properties:
 * - xNodeName: The name of the X-Node.
 * - xNodeImage: The image URL of the X-Node.
 * - xNodePoints: The points of the X-Node.
 * - isXNodeHolder: A boolean indicating whether the user is an X-Node holder.
 * - attachedGMTokenId: The token ID of the GM NFT attached to the X-Node.
 * */

interface XNodeData {
    isXNodeLoading: boolean;
    isXNodeError: boolean;
    xNodeError: any;
    xNodeId: string | undefined;
    xNodeName: string;
    nodeType: string;
    xNodeImage: string;
    xNodeLevel: number;
    xNodeOwner: string | undefined;
    isXNodeHolder: boolean;
    isXNodeDelegator: boolean;
    isXNodeDelegated: boolean;
    isXNodeDelegatee: boolean;
    delegatee: string | undefined;
    attachedGMTokenId: string | undefined;
    isXNodeAttachedToGM: boolean;
    isXNodeOnCooldown: boolean;
    allNodes: Array<{
        nodeId: string;
        nodeLevel: number;
        xNodeOwner: string;
        isXNodeHolder: boolean;
        isXNodeDelegated: boolean;
        isXNodeDelegator: boolean;
        isXNodeDelegatee: boolean;
        delegatee: string;
    }>;
}

export const useXNode = (address?: string): XNodeData => {
    const { t } = useTranslation();
    const userNodeDetails = useGetUserNodes(address ?? '');

    // Store raw node data
    const allNodes = userNodeDetails?.data ?? [];

    // Process first node for detailed view
    const firstNode = allNodes[0];
    const xNode = firstNode
        ? {
              id: firstNode.nodeId,
              level: Number(firstNode.nodeLevel),
              image: NodeStrengthLevelToImage[
                  Number(firstNode.nodeLevel)
              ] as string,
              name: allNodeStrengthLevelToName[
                  Number(firstNode.nodeLevel)
              ] as string,
          }
        : undefined;

    const xNodeName = xNode?.name ?? t('Not available');
    const xNodeImage = xNode?.image ?? notFoundImage;
    const xNodeLevel = xNode?.level ?? 0;
    const nodeType = Number(xNodeLevel) >= 4 ? 'XNODE' : 'ECONOMIC NODE';

    const {
        data: attachedGMTokenId,
        isLoading: isLoadingAttachedGMTokenId,
        isError: isErrorAttachedGMTokenId,
        error: errorAttachedGMTokenId,
    } = useGetTokenIdAttachedToNode(xNode?.id ?? '');

    const isXNodeAttachedToGM = !!Number(attachedGMTokenId);

    const isXNodeLoading =
        userNodeDetails.isLoading || isLoadingAttachedGMTokenId;
    const isXNodeError = userNodeDetails.isError || isErrorAttachedGMTokenId;
    const xNodeError = userNodeDetails.error || errorAttachedGMTokenId;

    const { data: isXNodeOnCooldown } = useXNodeCheckCooldown(xNode?.id ?? '');

    return {
        isXNodeLoading,
        isXNodeError,
        xNodeError,
        xNodeId: xNode?.id,
        xNodeName,
        nodeType,
        xNodeImage,
        xNodeLevel,
        xNodeOwner: firstNode?.xNodeOwner,
        isXNodeHolder: firstNode?.isXNodeHolder ?? false,
        isXNodeDelegator: firstNode?.isXNodeDelegator ?? false,
        isXNodeDelegated: firstNode?.isXNodeDelegated ?? false,
        isXNodeDelegatee: firstNode?.isXNodeDelegatee ?? false,
        delegatee: firstNode?.delegatee,
        attachedGMTokenId,
        isXNodeAttachedToGM,
        isXNodeOnCooldown: isXNodeOnCooldown ?? false,
        allNodes,
    };
};
