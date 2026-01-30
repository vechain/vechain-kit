---
hidden: true
---

# Configs

## VeChain Kit Configuration

The configuration system in VeChain Kit provides a comprehensive way to set up different network environments and contract addresses for VeChain applications.

### Network Types

Three network types are supported:

* `main` - VeChain mainnet
* `test` - VeChain testnet
* `solo` - Local development network

### Available data

```typescript
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
    vetDomainAvatarUrl: string;
    nodeUrl: string;
    indexerUrl: string;
    b3trIndexerUrl: string;
    graphQlIndexerUrl: string;
    network: Network;
    explorerUrl: string;
};
```

### Basic Usage

```typescript
// Basic Configuration Usage
import { getConfig, NETWORK_TYPE } from '@vechain-kit/core';

// Get config for specific network
const mainnetConfig = getConfig('main');
const testnetConfig = getConfig('test'); 
const soloConfig = getConfig('solo');

// Access network properties
console.log('Mainnet Node URL:', mainnetConfig.nodeUrl);
console.log('Testnet Explorer:', testnetConfig.explorerUrl);

// Access contract addresses
const {
    vthoContractAddress,
    accountFactoryAddress,
    oracleContractAddress,
    vetDomainsContractAddress
} = mainnetConfig;

// Access IPFS configuration
const {
    ipfsFetchingService,
    ipfsPinningService
} = mainnetConfig;

// Example: Create explorer link
const getExplorerUrl = (txId: string) => 
    `${mainnetConfig.explorerUrl}/${txId}`;
```

### Notes

* Network configurations are immutable after initialization
* Solo network is intended for local development
* Contract addresses vary between networks
* Explorer URLs are network-specific
* Genesis blocks define network identity
* Block time is standardized at 10 seconds
* IPFS services may have rate limits
* Some features may be testnet-only
