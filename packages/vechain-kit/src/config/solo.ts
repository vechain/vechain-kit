import { AppConfig } from '.';
const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4',
    vot3ContractAddress: '0x028Af33230576c1e073C8245F72a7A4aa53564E4',
    b3trGovernorAddress: '0x36E0e9b46D56dF12Dd69fD560e41954C73cE9ded',
    timelockContractAddress: '0x125389845c93Efcf6471BA8BE1AC19c11e128603',
    xAllocationPoolContractAddress:
        '0xC8232c91E2f744E533322B99F95f809b9f7ec446',
    xAllocationVotingContractAddress:
        '0x074F093f4C534a16cDD09cb4b2669713218A762a',
    emissionsContractAddress: '0x6a084E85f38400790043788FcCee39595616aa3A',
    voterRewardsContractAddress: '0xbAb852081C459c0060960287aDcf9a0C2c1dc4b8',
    galaxyMemberContractAddress: '0xbdA1cff75d2D43AB9186Ada41fECF79e25c49Ba3',
    treasuryContractAddress: '0xe9414513Fe0e3b9bf7a61eC5c1AC7Df943fB3e77',
    x2EarnAppsContractAddress: '0x432C46476f4970575C43B19588A170D237dC4929',
    x2EarnRewardsPoolContractAddress:
        '0x134E4Fce6761f660401808CF86aE0e62cE52a81E',
    nodeManagementContractAddress: '0xa96B5057171D797298A71178b48449A7bC615D8E',
    veBetterPassportContractAddress:
        '0x8db6D14452fE36ba86C341AfEFaC0f90A0Db2bcb',
    x2EarnCreatorContractAddress: '0x4e5f7eb452e9ecd75c0B29e3540014cBe01bBF52',
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    oracleContractAddress: '0x49eC7192BF804Abc289645ca86F1eD01a6C17713',
    accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    cleanifyCampaignsContractAddress:
        '0x7a11D63338576aE8c038868433ea199d7E5319A6',
    cleanifyChallengesContractAddress:
        '0xa58681692AdDD2e8E37f9113D40Bb9253C03F65e',
    veWorldSubdomainClaimerContractAddress:
        '0x0000000000000000000000000000000000000000',
    vetDomainsContractAddress: '0x0000000000000000000000000000000000000000',
    vetDomainsPublicResolverAddress:
        '0x0000000000000000000000000000000000000000',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0x0000000000000000000000000000000000000000',
    vetDomainAvatarUrl: 'https://testnet.vet.domains/api/avatar',
    indexerUrl: 'https://b3tr.testnet.vechain.org/api/v1',
    b3trIndexerUrl: 'https://b3tr.testnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'http://localhost:8669',
    network: {
        id: 'solo',
        name: 'solo',
        type: 'solo',
        defaultNet: true,
        urls: ['http://localhost:8669'],
        explorerUrl: 'https://explore-testnet.vechain.org',
        blockTime: 10000,
        genesis: {
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
        },
    },
    explorerUrl: 'https://explore-testnet.vechain.org',
};
export default config;
