/**
 * Resolve a raw address into a human-readable contract label so the user
 * can tell a real contract from a phishing spoof. The registry walks the
 * kit's `appConfig` (which already has every VeChain-maintained contract
 * address keyed by name) and maps each field to a friendly label.
 *
 * Verified = present in the kit's appConfig. Anything else gets an
 * "Unverified" treatment so the UI shows a warning rather than silently
 * rendering a truncated hex string.
 */
import type { AppConfig } from '@vechain/vechain-kit';

export type ContractLabel = {
    label: string;
    verified: boolean;
};

const APP_CONFIG_LABELS: Partial<Record<keyof AppConfig, string>> = {
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
    appConfig: AppConfig | undefined,
    self?: string,
): ContractLabel | null {
    if (!address) return null;
    const lower = address.toLowerCase();

    if (self && lower === self.toLowerCase()) {
        return { label: 'Your account', verified: true };
    }

    if (!appConfig) return null;

    for (const [field, label] of Object.entries(APP_CONFIG_LABELS) as Array<
        [keyof AppConfig, string]
    >) {
        const value = appConfig[field];
        if (typeof value === 'string' && value.toLowerCase() === lower) {
            return { label, verified: true };
        }
    }

    return null;
}
