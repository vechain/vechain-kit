export type TransferDirection = 'sent' | 'received';

export type TransferEventType = 'VET' | 'FUNGIBLE_TOKEN' | 'NFT';

export type IndexerTransfer = {
    id: string;
    blockId: string;
    blockNumber: number;
    blockTimestamp: number;
    txId: string;
    from: string;
    to: string;
    value: string;
    tokenAddress?: string;
    tokenId?: string;
    topics: string[];
    eventType: TransferEventType;
};

export type TransferHistoryItem = {
    id: string;
    txId: string;
    blockNumber: number;
    timestamp: number;
    direction: TransferDirection;
    from: string;
    to: string;
    tokenAddress: string | null;
    tokenSymbol: string;
    tokenDecimals: number;
    rawValue: string;
    amount: number;
    eventType: TransferEventType;
};

export const VET_TOKEN_SENTINEL = '0x';

export const VTHO_TOKEN_ADDRESS =
    '0x0000000000000000000000000000456e65726779';
