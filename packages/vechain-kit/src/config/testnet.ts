import { AppConfig } from '.';

const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0x95761346d18244bb91664181bf91193376197088',
    vot3ContractAddress: '0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e',
    b3trGovernorAddress: '0xc30b4d0837f7e3706749655d8bde0c0f265dd81b',
    timelockContractAddress: '0x835509222aa67c333a1cbf29bd341e014aba86c9',
    xAllocationPoolContractAddress:
        '0x6f7b4bc19b4dc99005b473b9c45ce2815bbe7533',
    xAllocationVotingContractAddress:
        '0x8800592c463f0b21ae08732559ee8e146db1d7b2',
    emissionsContractAddress: '0x66898f98409db20ed6a1bf0021334b7897eb0688',
    voterRewardsContractAddress: '0x851ef91801899a4e7e4a3174a9300b3e20c957e8',
    galaxyMemberContractAddress: '0x38a59fa7fd7039884465a0ff285b8c4b6fe394ca',
    x2EarnCreatorContractAddress: '0xb89f0ecdaf9987f87912d6c77756435fe4085b05',
    nodeManagementContractAddress: '0xde17d0a516c38c168d37685bb71465f656aa256e',
    x2EarnAppsContractAddress: '0x0b54a094b877a25bdc95b4431eaa1e2206b1ddfe',
    treasuryContractAddress: '0x3d531a80c05099c71b02585031f86a2988e0caca',
    x2EarnRewardsPoolContractAddress:
        '0x2d2a2207c68a46fc79325d7718e639d1047b0d8b',
    veBetterPassportContractAddress:
        '0x592c756df7a5d39de1735030e8b9c18b7417e6c4',
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
    b3trIndexerUrl: 'https://indexer.testnet.vechain.org/api/v1',
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
