import { useMemo } from 'react';
import { Interface } from 'ethers';
import { useQueryClient } from '@tanstack/react-query';
import {
    UseSendTransactionReturnValue,
    useRefreshBalances,
    useSendTransaction,
} from '@/hooks';
import { getOwnedNftsQueryKey } from '@/hooks/api/nfts/useOwnedNfts';
import { useVeChainKitConfig } from '@/providers';
import { humanAddress, isValidAddress } from '@/utils';
import { EnhancedClause } from '@/types';

type UseTransferERC721Props = {
    fromAddress: string;
    receiverAddress: string;
    collectionAddress: string;
    tokenId: string;
    collectionName?: string;
    onSuccess?: () => void;
    onError?: (error?: string) => void;
};

type UseTransferERC721ReturnValue = {
    sendTransaction: () => Promise<void>;
    clauses: EnhancedClause[];
} & Omit<UseSendTransactionReturnValue, 'sendTransaction'>;

const ERC721Interface = new Interface([
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
]);

export const buildERC721Clauses = (
    fromAddress: string,
    receiverAddress: string,
    collectionAddress: string,
    tokenId: string,
    collectionName?: string,
): EnhancedClause[] => {
    if (
        !receiverAddress ||
        !isValidAddress(receiverAddress) ||
        !fromAddress ||
        !isValidAddress(fromAddress) ||
        !collectionAddress ||
        !isValidAddress(collectionAddress) ||
        tokenId === ''
    ) {
        throw new Error('Invalid transfer parameters');
    }

    const safeTransferFrom = ERC721Interface.getFunction('safeTransferFrom');
    if (!safeTransferFrom) {
        throw new Error('safeTransferFrom not found in ERC721 interface');
    }

    const clausesArray: any[] = [
        {
            to: collectionAddress,
            value: '0x0',
            data: ERC721Interface.encodeFunctionData('safeTransferFrom', [
                fromAddress,
                receiverAddress,
                BigInt(tokenId),
            ]),
            comment: `Transfer ${
                collectionName ?? 'NFT'
            } #${tokenId} to ${receiverAddress}`,
            abi: safeTransferFrom,
        },
    ];
    return clausesArray;
};

export const useTransferERC721 = ({
    fromAddress,
    receiverAddress,
    collectionAddress,
    tokenId,
    collectionName,
    onSuccess,
    onError,
}: UseTransferERC721Props): UseTransferERC721ReturnValue => {
    const { refresh } = useRefreshBalances();
    const queryClient = useQueryClient();
    const { network } = useVeChainKitConfig();

    const clauses = useMemo(() => {
        try {
            return buildERC721Clauses(
                fromAddress,
                receiverAddress,
                collectionAddress,
                tokenId,
                collectionName,
            );
        } catch {
            return [];
        }
    }, [
        fromAddress,
        receiverAddress,
        collectionAddress,
        tokenId,
        collectionName,
    ]);

    const result = useSendTransaction({
        signerAccountAddress: fromAddress,
        privyUIOptions: {
            title: 'Confirm NFT Transfer',
            description: `Transfer ${
                collectionName ?? 'NFT'
            } #${tokenId} to ${humanAddress(receiverAddress)}`,
            buttonText: 'Sign to continue',
        },
        onTxConfirmed: async () => {
            refresh();
            await queryClient.invalidateQueries({
                queryKey: getOwnedNftsQueryKey(fromAddress, network.type),
            });
            onSuccess?.();
        },
        onTxFailedOrCancelled: async (error) => {
            onError?.(error instanceof Error ? error.message : String(error));
        },
    });

    return {
        ...result,
        clauses,
        sendTransaction: async () => {
            if (!clauses.length) {
                onError?.('Invalid transfer parameters');
                return;
            }
            return result.sendTransaction(clauses);
        },
    };
};
