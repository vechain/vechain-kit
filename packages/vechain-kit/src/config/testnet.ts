import { AppConfig } from '.';

const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0xB30a7E08B476B75686E019fB0db3a0980CF9c1e9',
    vot3ContractAddress: '0xd708CeB1D1A3b0709AAE8C523C66675971871B6f',
    b3trGovernorAddress: '0x2f3aa2C4662002eb37d8168724B4c8c172f47824',
    timelockContractAddress: '0xA272e6E2918aC557ac3cF80A1d9a212Ac5987064',
    xAllocationPoolContractAddress:
        '0x48C2B602AF3A97B2fb91E89711d8d1F22c00aC98',
    xAllocationVotingContractAddress:
        '0xAB8C3B7b77E1dA077aB7FE276eF5df720396ABc5',
    emissionsContractAddress: '0xF7693600390d477c5aAab69A1EF8fc8ac0cc9237',
    voterRewardsContractAddress: '0x9FBd4748D36456a56bA83B16CC915F8d17468A74',
    galaxyMemberContractAddress: '0x073A1f831e247FE06c96C2b060B75e24FBfA38A9',
    treasuryContractAddress: '0xb4E3F2CDd86f8024EC596345B456959fa77B5e43',
    x2EarnAppsContractAddress: '0xF867e87F90F4207B2DD470b2E7d827747Fb8a13d',
    x2EarnRewardsPoolContractAddress:
        '0x8f06fA32CCbf5f074802956c2D72BC2ce67133cC',
    nodeManagementContractAddress: '0x4b40a81B102e4e0621c19a1f25D3F8DeddBF3506',
    veBetterPassportContractAddress:
        '0xD8b4c5763ac868d459fC3A62bf2cac30383992a0',
    x2EarnCreatorContractAddress: '0x7233E26045bEe08DF3C4b5e366039A567E529Bc8',
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
