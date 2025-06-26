import { AppConfig } from '.';

const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F',
    vot3ContractAddress: '0xa704c45971995467696EE9544Da77DD42Bc9706E',
    b3trGovernorAddress: '0xDF5E114D391CAC840529802fe8D01f6bdeBE41eC',
    timelockContractAddress: '0x30ee94F303643902a68aD8A7A6456cA69d763192',
    xAllocationPoolContractAddress:
        '0x9B9CA9D0C41Add1d204f90BA0E9a6844f1843A84',
    xAllocationVotingContractAddress:
        '0x5859ff910d8b0c127364c98E24233b0af7443c1c',
    emissionsContractAddress: '0x3D7616213191a10460e49CfdB7edBf88D6a10942',
    voterRewardsContractAddress: '0x2E47fc4aabB3403037fB5E1f38995E7a91Ce8Ed2',
    galaxyMemberContractAddress: '0xa9aC49C030c1148b95F056E86f2531f8F3d5bf27',
    x2EarnCreatorContractAddress: '',
    nodeManagementContractAddress: '',
    x2EarnAppsContractAddress: '0xcB23Eb1bBD5c07553795b9538b1061D0f4ABA153',
    treasuryContractAddress: '0x039893EBe092A2D22B08E2b029735D211bfF7F50',
    x2EarnRewardsPoolContractAddress:
        '0x5F8f86B8D0Fa93cdaE20936d150175dF0205fB38',
    veBetterPassportContractAddress:
        '0x63c061a2753e84635a22ff05954e1687f104f002',
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    oracleContractAddress: '0xdcCAaBd81B38e0dEEf4c202bC7F1261A4D9192C6',
    accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
    cleanifyCampaignsContractAddress:
        '0x22d19ACBD2cBf6b2B6C546395c26B9Cb448248BF',
    cleanifyChallengesContractAddress:
        '0x8Cc885DC3e5c376632CCEA0e8e1a51F1B3572442',
    veWorldSubdomainClaimerContractAddress:
        '0xe5af50e7ad1aaab4fbe4efbb2b30f764013918b3',
    vetDomainsContractAddress: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
    vetDomainsPublicResolverAddress:
        '0xA6eFd130085a127D090ACb0b100294aD1079EA6f',
    vetDomainsReverseRegistrarAddress:
        '0x6878f1aD5e3015310CfE5B38d7B7071C5D8818Ca',
    vnsResolverAddress: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
    gloDollarContractAddress: '0x0000000000000000000000000000000000000000',
    vetDomainAvatarUrl: 'https://testnet.vet.domains/api/avatar',
    indexerUrl: 'https://indexer.testnet.vechain.org/api/v1',
    b3trIndexerUrl: 'https://b3tr.testnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'https://testnet.vechain.org',
    network: {
        id: 'testnet',
        name: 'testnet',
        type: 'test',
        defaultNet: true,
        urls: [
            'https://testnet.vechain.org',
            'https://vethor-node-test.vechaindev.com',
            'https://sync-testnet.veblocks.net',
            'https://testnet.vecha.in',
        ],
        nodeUrl: 'https://testnet.vechain.org',
        delegateUrl: 'https://testnet.vechain.org',
        chainId: 100010,
        explorerUrl: 'https://insight.vecha.in/#/test',
        blockTime: 10000,
        genesis: {
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
        },
    },
    explorerUrl: 'https://explore-testnet.vechain.org/transactions',
};
export default config;
