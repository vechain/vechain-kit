export type IndexerNft = {
    id?: string;
    contractAddress: string;
    tokenId: string;
    owner?: string;
    txId?: string;
    blockNumber?: number;
    blockId?: string;
    blockTimestamp?: number;
};

export type OwnedNft = {
    id: string;
    collectionAddress: string;
    tokenId: string;
    lastTransferTimestamp?: number;
    lastTransferTxId?: string;
};

export type NftAttribute = {
    trait_type?: string;
    value?: string | number | boolean;
    display_type?: string;
};

export type NftMetadata = {
    name?: string;
    description?: string;
    image?: string;
    external_url?: string;
    animation_url?: string;
    attributes?: NftAttribute[];
};
