/// <reference types="@vechain/connex-types" />

/**
 * The type of network that we are connected to (indentified by the genesis block)
 * */
export type NETWORK_TYPE = 'main' | 'test' | 'solo';

/**
 * A model for the VechainThor network that we are connected to
 * @field `id` - Unique ID for this network
 * @field `defaultNet` - If the network is a default network
 * @field `name` - A name for this network
 * @field `type` - What type of network is it? `main, test, solo or custom`
 * @field `urls` - A list of URLs for this network
 * @field `currentUrl` - The current URL that we are connected to
 * @field `explorerUrl` - The explorer URL for this network
 * @field `genesis` - The genesis block for the network
 * @field `blockTime` - The time it takes to mine a block in milliseconds
 */
export type Network = {
    id: string;
    defaultNet: boolean;
    name: string;
    type: NETWORK_TYPE;
    urls: string[];
    explorerUrl?: string;
    genesis: typeof genesises.main;
    blockTime: number;
};

const THOR_MAIN_URLS = [
    'https://mainnet.vechain.org',
    'https://vethor-node.vechain.com',
    'https://mainnet.veblocks.net',
    'https://mainnet.vecha.in',
];

const THOR_TESTNET_URLS = [
    'https://testnet.vechain.org',
    'https://vethor-node-test.vechaindev.com',
    'https://sync-testnet.veblocks.net',
    'https://testnet.vecha.in',
];

const THOR_SOLO_URLS = ['http://localhost:8669'];

const MAIN_EXPLORER_URL = 'https://explore.vechain.org';
const TEST_EXPLORER_URL = 'https://explore-testnet.vechain.org';

export const genesisesId = {
    get main(): string {
        return '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';
    },
    get test(): string {
        return '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';
    },
    get solo(): string {
        return '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6';
    },
};

export const genesises = {
    get main(): Connex.Thor.Block {
        return {
            number: 0,
            id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    get test(): Connex.Thor.Block {
        return {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    get solo(): Connex.Thor.Block {
        return {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    which(gid: string) {
        switch (gid) {
            case this.main.id:
                return 'main';
            case this.test.id:
                return 'test';
            case this.solo.id:
                return 'solo';
        }
    },
};

export const DEFAULT_GAS_COEFFICIENT = 0;

export const BASE_GAS_PRICE =
    '0x000000000000000000000000000000000000626173652d6761732d7072696365';

export const defaultMainNetwork: Network = {
    id: 'main',
    name: 'main',
    type: 'main',
    defaultNet: true,
    urls: THOR_MAIN_URLS,
    explorerUrl: MAIN_EXPLORER_URL,
    genesis: genesises.main,
    blockTime: 1000 * 10,
};

export const defaultTestNetwork: Network = {
    id: 'test',
    name: 'test',
    type: 'test',
    defaultNet: true,
    urls: THOR_TESTNET_URLS,
    explorerUrl: TEST_EXPLORER_URL,
    genesis: genesises.test,
    blockTime: 1000 * 10,
};

export const defaultSoloNetwork: Network = {
    id: 'solo',
    name: 'solo',
    type: 'solo',
    defaultNet: true,
    urls: THOR_SOLO_URLS,
    explorerUrl: TEST_EXPLORER_URL,
    genesis: genesises.solo,
    blockTime: 1000 * 10,
};

export const defaultNetworks: Network[] = [
    defaultMainNetwork,
    defaultTestNetwork,
    defaultSoloNetwork,
];

export const getNetworkById = (id: string): Network | undefined => {
    return defaultNetworks.find((net) => net.id === id);
};

export const getNetworkByName = (name: string): Network | undefined => {
    return defaultNetworks.find((net) => net.name === name);
};

//https://docs.vechain.org/miscellaneous
export const chainTagToGenesisId: Record<number, string> = {
    74: genesisesId.main,
    39: genesisesId.test,
    246: genesisesId.solo,
};
