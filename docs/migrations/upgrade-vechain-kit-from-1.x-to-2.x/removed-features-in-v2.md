# Removed Features in v2

This document lists all hooks, modules, and features that have been completely removed in v2. If you use any of these, you'll need to find alternatives or implement custom solutions.

### Core Hooks Removed

<details>

<summary><strong>View removed core hooks</strong></summary>

#### `useConnex`

* **Removed**: `useConnex` hook
* **Replacement**: Use `useThor`&#x20;
* **Migration**: [See API Migration Guide](https://app.gitbook.com/o/PqN0Gs1QEzg8tbeJCHXC/s/S8udqSGhGctlwwL1kst7/~/changes/139/~/revisions/yfL9yTrGRF5EFTvaNNK7/migrations/upgrade-vechain-kit-from-1.x-to-2.x/api-migration-guide#connex-to-thor)

#### `useCall`

* **Removed**: Generic `useCall` hook
* **Replacement**: Use `useCallClause` with proper typing
* **Migration**: [See API Migration Guide](https://app.gitbook.com/o/PqN0Gs1QEzg8tbeJCHXC/s/S8udqSGhGctlwwL1kst7/~/changes/139/~/revisions/yfL9yTrGRF5EFTvaNNK7/migrations/upgrade-vechain-kit-from-1.x-to-2.x/api-migration-guide#reading-contract-data)

#### `useEvents`

* **Status**: Completely refactored with new API
* **Note**: Not removed, but has breaking API changes
* **Documentation**: [Blockchain Hooks](../../hooks/blockchain-hooks.md)

</details>

### VeBetterDAO Module (Completely Removed)

The entire VeBetterDAO module has been removed. All hooks under `api/vebetterdao/` are no longer available.

<details>

<summary><strong>View all removed VeBetterDAO hooks</strong></summary>

#### Galaxy Member Hooks

* `useGMbalance`
* `useB3trToUpgrade`
* `useB3trToUpgradeToLevel`
* `useGetNodeIdAttached`
* `useGetTokenIdAttachedToNode`
* `useGMMaxLevel`
* `useParticipatedInGovernance`
* `useTokenIdByAccount`
* `useNFTImage`
* `useB3trDonated`
* `useGMBaseUri`
* `useSelectedTokenId`
* `useIsGMClaimable`
* `useSelectedGmNft`
* `useLevelOfToken`
* `useNFTMetadataUri`

#### Node Management Hooks

* `useGetNodeManager`
* `useIsNodeHolder`
* `useUserXNodes`

#### Rewards Hooks

* `useLevelMultiplier`

#### VePassport Hooks

* `useAccountLinking`
* `usePassportChecks`
* `useUserDelegation`
* `useUserStatus`
* `useAppSecurityLevel`
* `useGetCumulativeScoreWithDecay`
* `useGetDelegatee`
* `useGetDelegator`
* `useGetEntitiesLinkedToPassport`
* `useGetPassportForEntity`
* `useGetPendingDelegationsDelegateePOV`
* `useGetPendingDelegationsDelegatorPOV`
* `useGetPendingLinkings`
* `useIsEntity`
* `useIsPassportCheckEnabled`
* `useIsPassport`
* `useParticipationScoreThreshold`
* `useSecurityMultiplier`
* `useThresholdParticipationScore`
* `useThresholdParticipationScoreAtTimepoint`
* `useIsBlacklisted`
* `useIsWhitelisted`
* `useUserRoundScore`

#### X2Earn Rewards Pool Hooks

* `useUserVotesInAllRounds`
* `useUserTopVotedApps`

#### XAllocation Pool Hooks

* `useAllocationAmount`
* `useXAppVotesQf`

#### XApps Hooks

* `useXNode`
* `useAppAdmin`
* `useAppExists`
* `useAppsEligibleInNextRound`
* `useGetX2EarnAppAvailableFunds`
* `useXAppsMetadataBaseUri`
* `useXNodeCheckCooldown`

#### XNodes Hooks

All XNodes-related functionality has been removed.

</details>

### Other Removed Modules

<details>

<summary><strong>View other removed modules</strong></summary>

#### Blockchain Module

* `getEvents` utility removed
* Use new event handling patterns instead

#### ERC20 Module

* `useGetErc20Balance` removed
* Use `useCallClause` with ERC20 ABI instead

#### Indexer Module

* All indexer hooks removed
* Implement custom indexing if needed

#### Oracle Module

* `useGetTokenUsdPrice` removed
* Integrate with external price feeds directly

#### veDelegate Module

* `useGetVeDelegateBalance` removed
* Use contract calls directly

#### NFTs Module

* All NFT-related hooks removed
* Use generic contract interaction patterns

</details>

### Removed Utility Hooks

<details>

<summary><strong>View removed utility hooks</strong></summary>

#### `useDecodeFunctionSignature`

* **Purpose**: Decoded function signatures from transaction data
* **Alternative**: Use ethers.js or web3.js utilities directly

#### `useGetCustomTokenBalances`

* **Purpose**: Fetched balances for custom tokens
* **Alternative**: Use `useCallClause` with token contracts

#### `useGetCustomTokenInfo`

* **Purpose**: Retrieved token metadata
* **Alternative**: Query token contracts directly

</details>

### Removed Components

<details>

<summary><strong>View removed components</strong></summary>

#### `ProfileCard`

* **Purpose**: component showing avatar, description, vet domain and address of the user
* **Alternative**: Use the available hooks to build your own UI

#### `TransactionToast`   &#x20;

* **Purpose**: Show the status of a transaction in a toast component
* **Alternative**: Use the receipt hook to track the status of the transaction and create your own UI or use the `TransactionModal` component

</details>

### Migration Strategies

#### For VeBetterDAO Features

If you depend on VeBetterDAO functionality:

1. **Option 1**: Implement custom hooks using `useCallClause`
2. **Option 2**: Wait for community implementations
3. **Option 3**: Use direct contract interactions

Example custom implementation:

```typescript
// Custom Galaxy Member balance hook
const useGMBalance = (address: string) => {
  return useCallClause({
    abi: GalaxyMemberABI,
    address: GM_CONTRACT_ADDRESS,
    method: 'balanceOf',
    args: [address],
    queryOptions: {
      enabled: !!address
    }
  });
};
```

#### For Removed Utility Functions

Most removed utilities can be replaced with:

1. Direct contract calls using `useCallClause`
2. Thor client methods
3. External libraries (ethers.js, web3.js)
