import { Network } from './network';

/**
 * Application configuration for different network environments
 * Moved to separate file to avoid circular dependencies with network configs
 */
export type AppConfig = {
    ipfsFetchingService: string;
    ipfsPinningService: string;
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
    veDelegate: string;
    veDelegateVotes: string;
    veDelegateTokenContractAddress: string;
    oracleContractAddress: string;
    accountFactoryAddress: string;
    cleanifyCampaignsContractAddress: string;
    cleanifyChallengesContractAddress: string;
    veWorldSubdomainClaimerContractAddress: string;
    vetDomainsContractAddress: string;
    vetDomainsPublicResolverAddress: string;
    vetDomainsReverseRegistrarAddress: string;
    vnsResolverAddress: string;
    gloDollarContractAddress: string;
    vetDomainAvatarUrl: string;
    nodeUrl: string;
    indexerUrl: string;
    b3trIndexerUrl: string;
    graphQlIndexerUrl: string;
    network: Network;
    explorerUrl: string;
};
