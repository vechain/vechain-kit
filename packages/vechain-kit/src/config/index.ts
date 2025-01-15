import { Network, NETWORK_TYPE } from './network';
import { useConfig } from '@/providers/ConfigProvider';
import { useVeChainKitConfig } from '@/providers';
import localConfig from './solo';
import testnetConfig from './testnet';
import mainnetConfig from './mainnet';

export const getConfig = (env?: NETWORK_TYPE) => {
    try {
        const { getConfig: getConfigFromContext } = useConfig();
        const { network } = useVeChainKitConfig();

        if (!env) env = network.type;
        return getConfigFromContext(env);
    } catch (e) {
        // Fallback to direct config if context is not available
        if (!env)
            throw new Error(
                'Network type is required when context is not available',
            );

        if (env === 'solo') return localConfig;
        if (env === 'test') return testnetConfig;
        if (env === 'main') return mainnetConfig;
        throw new Error(`Unsupported NETWORK_TYPE ${env} ${e}`);
    }
};

export type AppConfig = {
    ipfsFetchingService: string;
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
    nodeUrl: string;
    indexerUrl?: string;
    network: Network;
    explorerUrl: string;
};
