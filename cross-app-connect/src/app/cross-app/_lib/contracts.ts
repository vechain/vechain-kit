/**
 * Resolve a raw address into a human-readable contract label so the user
 * can tell a real contract from a phishing spoof. The registry walks a
 * known-contracts map (inlined from the kit's mainnet config) and labels
 * each entry.
 *
 * Verified = present in `knownContracts`. Anything else gets an
 * "Unverified" treatment so the UI shows a warning rather than silently
 * rendering a truncated hex string.
 */
import { knownContracts, type KnownContracts } from './appConfig';

export type ContractLabel = {
    label: string;
    verified: boolean;
};

const APP_CONFIG_LABELS: Partial<Record<keyof KnownContracts, string>> = {
    vthoContractAddress: 'VTHO Token',
    b3trContractAddress: 'B3TR Token',
    vot3ContractAddress: 'VOT3 Token',
    b3trGovernorAddress: 'VeBetter Governor',
    timelockContractAddress: 'Timelock',
    xAllocationPoolContractAddress: 'X-Allocation Pool',
    xAllocationVotingContractAddress: 'X-Allocation Voting',
    emissionsContractAddress: 'Emissions',
    voterRewardsContractAddress: 'Voter Rewards',
    galaxyMemberContractAddress: 'Galaxy Member',
    treasuryContractAddress: 'VeBetter Treasury',
    x2EarnAppsContractAddress: 'X2Earn Apps Registry',
    x2EarnCreatorContractAddress: 'X2Earn Creator',
    x2EarnRewardsPoolContractAddress: 'X2Earn Rewards Pool',
    nodeManagementContractAddress: 'Node Management',
    veBetterPassportContractAddress: 'VeBetter Passport',
    veDelegateTokenContractAddress: 'veDelegate Token',
    oracleContractAddress: 'Oracle',
    accountFactoryAddress: 'Smart Account Factory',
    cleanifyCampaignsContractAddress: 'Cleanify Campaigns',
    cleanifyChallengesContractAddress: 'Cleanify Challenges',
    veWorldSubdomainClaimerContractAddress: 'VeWorld Subdomain Claimer',
    vetDomainsContractAddress: 'VeChain Domains',
    vetDomainsPublicResolverAddress: 'VeChain Domains Resolver',
    vetDomainsReverseRegistrarAddress: 'VeChain Domains Reverse Registrar',
    vnsResolverAddress: 'VNS Resolver',
    sassContractAddress: 'SASS Token',
    vvetContractAddress: 'vVET',
    stargateContractAddress: 'Stargate',
    stargateNftContractAddress: 'Stargate NFT',
    veDelegate: 'veDelegate',
    veDelegateVotes: 'veDelegate Votes',
};

export function resolveContractLabel(
    address: string | undefined,
): ContractLabel | null {
    if (!address) return null;
    const lower = address.toLowerCase();

    for (const [field, label] of Object.entries(APP_CONFIG_LABELS) as Array<
        [keyof KnownContracts, string]
    >) {
        const value = knownContracts[field];
        if (typeof value === 'string' && value.toLowerCase() === lower) {
            return { label, verified: true };
        }
    }

    return null;
}
