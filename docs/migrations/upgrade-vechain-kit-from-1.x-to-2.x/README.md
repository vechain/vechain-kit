# Upgrade VeChain Kit from 1.x to 2.x

### What's Changed in 2.0

#### Major Breaking Changes

* **Connex Removal**: `useConnex` is replaced with `useThor`
* **New Contract Interaction Patterns**: Introduction of `useCallClause` and `executeMultipleClausesCall`
* **Enhanced Transaction Building**: New `useBuildTransaction` hook with improved type safety
* **Improved Type Safety**: Better TypeScript support with stricter typing
* `useEvents()` hook was refactored, [more here](../../hooks/blockchain-hooks.md)
* The following hooks were also removed in order to improve permeances.

<details>

<summary>Deprecated Hooks</summary>

Utils Hooks

* useRoundAppVotes
* useSustainabilityActions

Galaxy Member Hooks

* useGMbalance
* useB3trToUpgrade
* useB3trToUpgradeToLevel
* useGetNodeIdAttached
* useGetTokenIdAttachedToNode
* useGMMaxLevel
* useParticipatedInGovernance
* useTokenIdByAccount
* useNFTImage
* useB3trDonated
* useGMBaseUri
* useSelectedTokenId
* useIsGMClaimable
* useSelectedGmNft
* useLevelOfToken
* useNFTMetadataUri

NodeManagement

* useGetNodeManager
* useIsNodeHolder
* useUserXNodes

VeBetterPassport

* useAccountLinking
* usePassportChecks
* useUserDelegation
* useUserStatus
* useAppSecurityLevel
* useGetCumulativeScoreWithDecay
* useGetDelegatee
* useGetDelegator
* useGetEntitiesLinkedToPassport
* useGetPassportForEntity
* useGetPendingDelegationsDelegateePOV
* useGetPendingDelegationsDelegatorPOV
* useGetPendingLinkings
* useIsEntity
* useIsPassportCheckEnabled
* useIsPassport
* useParticipationScoreThreshold
* useSecurityMultiplier
* useThresholdParticipationScore
* useThresholdParticipationScoreAtTimepoint
* useIsBlacklisted
* useIsWhitelisted
* useUserRoundScore

VBD VoterRewards:

* useLevelMultiplier

X2Earn Apps:

* useUserVotesInAllRounds
* useUserTopVotedApps
* useXNode
* useAppAdmin
* useAppExists
* useAppsEligibleInNextRound
* useGetX2EarnAppAvailableFunds
* useXAppsMetadataBaseUri
* useXNodeCheckCooldown

XAllocation Voting

* useAllocationAmount
* useXAppVotesQf

</details>

{% hint style="info" %}
`useCallClause` is for reading data from smart contracts with automatic\
caching and refetching

`executeMultipleClausesCall` is to execute multiple contract calls in a single batch
{% endhint %}

{% hint style="info" %}
It might require to `rm -rf node_modules yarn.lock && yarn`
{% endhint %}

### Migration Path

#### Preparation Steps

1. Create a git branch for migration
2. Identify all places where `useConnex` is used (This is the main breaking change and easiest to find)
3. Run `tsc` compiler to see all broken references
4. Fix the compiler errors and migrate incrementally. The new methods provide type-safe returns that will guide you
5. Verify functionality as you fix each error
6. Ensure you have adequate test coverage before starting

### Getting Help

* **Documentation**: Refer to individual migration guide sections
* **GitHub Issues**: [Report issues](https://github.com/vechain/vechain-kit/issues)

### Next Steps

1. Start with the [API Changes](api-migration-guide.md) guide to update your core dependencies and imports
2. Review [Contract Patterns](/broken/pages/6c9hPxysSCGLPWFc1HTV) to understand new interaction methods
3. Apply [Best Practices](../../best-practices.md) for optimal performance
4. Consult [Troubleshooting](../../troubleshooting/general.md) if you encounter issues
