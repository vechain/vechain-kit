/**
 * Inlined VeChain mainnet/testnet contract addresses, ported from
 * `@vechain/vechain-kit/src/config/{mainnet,testnet}.ts`. Used by
 * `resolveContractLabel` to identify known VeChain-maintained contracts so
 * the transact UI can mark them as verified rather than rendering a raw
 * truncated hex string.
 *
 * Keep in sync with the kit if a new contract is added to its appConfig.
 */

export type KnownContracts = {
    vthoContractAddress: string;
    b3trContractAddress: string;
    vot3ContractAddress: string;
    b3trGovernorAddress: string;
    timelockContractAddress: string;
    xAllocationPoolContractAddress: string;
    xAllocationVotingContractAddress: string;
    emissionsContractAddress: string;
    voterRewardsContractAddress: string;
    galaxyMemberContractAddress: string;
    treasuryContractAddress: string;
    x2EarnAppsContractAddress: string;
    x2EarnCreatorContractAddress: string;
    x2EarnRewardsPoolContractAddress: string;
    nodeManagementContractAddress: string;
    veBetterPassportContractAddress: string;
    veDelegateTokenContractAddress: string;
    veDelegate: string;
    veDelegateVotes: string;
    oracleContractAddress: string;
    accountFactoryAddress: string;
    cleanifyCampaignsContractAddress: string;
    cleanifyChallengesContractAddress: string;
    veWorldSubdomainClaimerContractAddress: string;
    vetDomainsContractAddress: string;
    vetDomainsPublicResolverAddress: string;
    vetDomainsReverseRegistrarAddress: string;
    vnsResolverAddress: string;
    sassContractAddress: string;
    vvetContractAddress: string;
    stargateContractAddress: string;
    stargateNftContractAddress: string;
    // DEX router addresses (not in the kit's AppConfig — sourced from
    // `packages/vechain-kit/src/utils/swap/*`).
    betterSwapRouterAddress: string;
    veTradeRouterAddress: string;
    veTradeCustomRouterAddress: string;
};

const MAINNET: KnownContracts = {
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
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
        '0xa4173c32fe8a61a8fd0d0234675b559fc360446a',
    vetDomainsContractAddress: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
    vetDomainsPublicResolverAddress:
        '0xabac49445584C8b6c1472b030B1076Ac3901D7cf',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    sassContractAddress: '0x84b0caf6436aace4e21d10f126963fdd53ac31ea',
    vvetContractAddress: '0x45429A2255e7248e57fce99E7239aED3f84B7a53',
    stargateContractAddress: '0x03C557bE98123fdb6faD325328AC6eB77de7248C',
    stargateNftContractAddress: '0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7',
    betterSwapRouterAddress: '0xf21Dd7108D93af56FaB07423EfB90F4a3604DA89',
    veTradeRouterAddress: '0xE5fA980a6EfE5B79C2150a529da06AeF455963b6',
    veTradeCustomRouterAddress: '0x7C755EC0165fCD926cC6faB10E7BB16a72E9f34A',
};

// Testnet contract addresses are out of scope for this host (cross-app
// requesters running on testnet bring their own dapp; the host doesn't
// need a separate mapping unless we want to label them too).
const TESTNET: Partial<KnownContracts> = {
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
};

// Validate explicitly — an unexpected value otherwise sneaks past the
// `as` cast and silently falls back to undefined when indexed.
const rawNetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const NETWORK_TYPE: 'main' | 'test' =
    rawNetworkType === 'test' ? 'test' : 'main';

export const knownContracts: KnownContracts =
    NETWORK_TYPE === 'main' ? MAINNET : ({ ...MAINNET, ...TESTNET } as KnownContracts);
