import { AppConfig } from '.';
const config: AppConfig = {
    ipfsFetchingService: 'https://api.gateway-proxy.vechain.org/ipfs',
    indexerUrl: 'https://indexer.mainnet.vechain.org/api/v1',
    ipfsPinningService:
        'https://api.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    b3trIndexerUrl: 'https://b3tr.mainnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'https://mainnet.vechain.org',
    network: {
        id: 'main',
        name: 'main',
        type: 'main',
        defaultNet: true,
        urls: [
            'https://mainnet.vechain.org',
            'https://vethor-node.vechain.com',
            'https://mainnet.veblocks.net',
            'https://mainnet.vecha.in',
        ],
        explorerUrl: 'https://vechainstats.com',
        blockTime: 10000,
        genesis: {
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
        },
    },
    explorerUrl: 'https://vechainstats.com/transaction',
    // general
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    //VeBetterDAO
    b3trContractAddress: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
    vot3ContractAddress: '0x76Ca782B59C74d088C7D2Cce2f211BC00836c602',
    b3trGovernorAddress: '0x1c65C25fABe2fc1bCb82f253fA0C916a322f777C',
    timelockContractAddress: '0x7B7EaF620d88E38782c6491D7Ce0B8D8cF3227e4',
    xAllocationPoolContractAddress:
        '0x4191776F05f4bE4848d3f4d587345078B439C7d3',
    xAllocationVotingContractAddress:
        '0x89A00Bb0947a30FF95BEeF77a66AEdE3842Fe5B7',
    emissionsContractAddress: '0xDf94739bd169C84fe6478D8420Bb807F1f47b135',
    voterRewardsContractAddress: '0x838A33AF756a6366f93e201423E1425f67eC0Fa7',
    galaxyMemberContractAddress: '0x93B8cD34A7Fc4f53271b9011161F7A2B5fEA9D1F',
    treasuryContractAddress: '0xD5903BCc66e439c753e525F8AF2FeC7be2429593',
    x2EarnAppsContractAddress: '0x8392B7CCc763dB03b47afcD8E8f5e24F9cf0554D',
    x2EarnRewardsPoolContractAddress:
        '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631',
    x2EarnCreatorContractAddress: '0xe8e96a768ffd00417d4bd985bec9EcfC6F732a7f',
    nodeManagementContractAddress: '0xB0EF9D89C6b49CbA6BBF86Bf2FDf0Eee4968c6AB',
    veBetterPassportContractAddress:
        '0x35a267671d8EDD607B2056A9a13E7ba7CF53c8b3',
    //veDelegate
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    //utility
    oracleContractAddress: '0x49eC7192BF804Abc289645ca86F1eD01a6C17713',
    accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    //cleanify
    cleanifyCampaignsContractAddress:
        '0x7a11D63338576aE8c038868433ea199d7E5319A6',
    cleanifyChallengesContractAddress:
        '0xa58681692AdDD2e8E37f9113D40Bb9253C03F65e',
    veWorldSubdomainClaimerContractAddress:
        '0xa4173c32fe8a61a8fd0d0234675b559fc360446a',
    vetDomainsContractAddress: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
    vetDomainsPublicResolverAddress:
        '0xabac49445584C8b6c1472b030B1076Ac3901D7cf',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
};
export default config;
